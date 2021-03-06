import React from 'react';
import GraphiQL from 'graphiql';
import moment from 'moment';
import schema from './data/graph';
import { root } from './data/root';
import { graphql, parse, Source, visit, validate } from 'graphql';
import { PAGE_LIMIT } from './config';

import PageBuilder from './data/PageBuilder';
import R from 'ramda';
import SplitPane from 'react-split-pane';
import JSONViewer from './ui/JSONViewer';
import Navbar from './ui/Navbar';
import debounce from 'lodash.debounce';
import { defaultQuery } from './config';
import { getPages } from './data/network';
import { WarningToaster } from './ui/Toaster';
class Cache {
    getItem(key) {
        return localStorage.getItem(key);
    }
    removeItem(key) {
        return localStorage.removeItem(key);
    }
    setItem(key, val) {
        if (key === 'graphiql:query') {
            const source = new Source(val);
            const documentAST = parse(source);
            const validationErrors = validate(schema, documentAST);
            if (validationErrors.length > 0) {
                console.error(new Error('wrong schema'));
                return;
            }
        }
        if (key === 'graphiql:variables') {
            try {
                JSON.parse(val);
            } catch (e) {
                console.error(e);
                return;
            }
        }
        return localStorage.setItem(key, val);
    }
}

const cache = new Cache();

function findFilters(documentAST) {
    const filters = {};
    visit(documentAST, {
        enter(node, key, parent, path, ancestors) {
            if (node.arguments && node.arguments.length > -1) {
                try {
                    node.arguments.forEach(a => {
                        let argValues;
                        let argKey = a.name.value;
                        if (a.value.kind === 'ListValue') {
                            argValues = a.value.values.map(R.prop('value'));
                        } else {
                            argValues = a.value.value;
                        }

                        if (Array.isArray(filters[argKey])) {
                            filters[argKey] = R.uniq(
                                filters[argKey].concat(argValues)
                            );
                        } else {
                            filters[argKey] = argValues;
                        }
                    });
                } catch (e) {
                    if (e) console.log(e);
                }
            }
        }
    });
    return filters;
}

export default class App extends React.Component {
    constructor() {
        super();
        const variables = this.getCachedStuff();
        this.state = {
            focusedInput: null,
            variables: variables,
            result: undefined,
            pagesLoaded: true
        };
        this.graphQLFetcher = this.graphQLFetcher.bind(this);
        this.getCachedStuff = this.getCachedStuff.bind(this);
        this.debounceHandleEditVariables = debounce(
            this.handleEditVariables.bind(this),
            750
        );
    }
    getCachedStuff(key) {
        if (key === 'graphiql:variables') {
            var variables;
            try {
                variables = JSON.parse(cache.getItem('graphiql:variables'));
            } catch (e) {
                if (e) {
                    console.error(e);
                }
            }

            if (!variables) {
                variables = {};
            }

            if (!variables.dateTo || !variables.dateFrom) {
                variables.dateTo = moment().toISOString();
                variables.dateFrom = moment().subtract(3, 'days').toISOString();
            }
            this.setState({
                variables: variables
            });
            return JSON.stringify(variables, null, 2);
        }
        return cache.getItem(key);
    }
    graphQLFetcher = graphQLParams => {
        return graphql(
            schema,
            graphQLParams.query,
            root,
            null,
            graphQLParams.variables,
            graphQLParams.operationName
        )
            .then(r => {
                this.setState({ result: r });
                return r;
            })
            .catch(console.error);
    };
    onOutsideClick = () => {
        console.log(arguments);
    };
    onDatesChange = ({ startDate, endDate }) => {
        this.setState({ startDate, endDate });
    };
    onFocusChange = focusedInput => {
        this.setState({ focusedInput });
    };
    handleChangeDate = ({ startDate, endDate }) => {
        const variables = Object.assign({}, this.state.variables, {
            dateFrom: startDate && startDate.toISOString(),
            dateTo: endDate && endDate.toISOString()
        });
        const editor = this.graphiql.getVariableEditor();
        const stringified = JSON.stringify(variables, null, 2);
        editor.setValue(stringified);
        this.graphiql.handleEditVariables(stringified);
        this.graphiql.refresh();
    };
    jsonLiteHandler = () => {
        this.setState({
            advanced: !this.state.advanced
        });
    };
    handleEditVariables(vars) {
        let variables;
        try {
            variables = JSON.parse(vars);
        } catch (e) {
            variables = undefined;
        } finally {
            if (variables) {
                this.setState({
                    variables: variables
                });
            }
        }
    }
    prettify = () => {
        const editor = this.graphiql.getQueryEditor();
        const currentText = editor.getValue();
        const { parse, print } = require('graphql');
        const prettyText = print(parse(currentText));
        editor.setValue(prettyText);
    };
    handleRunQuery = () => {
        console.log('here', this.graphiql);
        this.setState({
            pagesLoaded: false
        });
        const query = this.graphiql.getQueryEditor().getValue();
        const variables = this.state.variables;
        const source = new Source(query);
        const documentAST = parse(source);
        const validationErrors = validate(schema, documentAST);

        if (validationErrors.length > 0) {
            this.setState({
                pagesLoaded: true
            });
            this.graphiql.autoCompleteLeafs();
            return Promise.resolve({ errors: validationErrors });
        }
        const filters = Object.assign({}, findFilters(documentAST), variables);

        getPages(filters)
            .then(pages => {
                if (pages.length === 0) {
                    WarningToaster.show({
                        message: 'This query has no data, try lenient filtering!'
                    });
                    return Promise.reject('The query is empty');
                }

                if (pages.length > PAGE_LIMIT) {
                    console.log('rejecting');
                    WarningToaster.show({
                        message: `This query has an insane amount of data (${pages.length}), try a stricter filtering!`
                    });

                    return Promise.reject('The query is insanely huge');
                }
                this.setState({ pagesLoaded: true, pages });
                return PageBuilder.loadOSc(pages, filters);
            })
            .then(pages => {
                this.graphiql.handleRunQuery();
            })
            .catch(e => {
                this.setState({
                    pagesLoaded: true,
                    result: undefined,
                    pages: []
                });
            });
    };
    downloadJSON = () => {
        if (!this.state.pages || this.state.pages.length === 0) {
            return;
        }
        var file = new Blob([JSON.stringify(this.state.result, null, 2)], {
            type: 'text/json'
        });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = 'result.json';
        a.click();
    };
    handleStopQuery = () => {};
    render() {
        return (
            <div className="app">
                <Navbar
                    runQuery={this.handleRunQuery}
                    onStop={this.handleStopQuery}
                    pagesLoaded={!this.state.pagesLoaded}
                    handleChangeDate={this.handleChangeDate}
                    variables={this.state.variables || undefined}
                    advanced={this.state.advanced}
                    jsonLiteHandler={this.jsonLiteHandler}
                    prettify={this.prettify}
                    downloadJSON={this.downloadJSON}
                />
                <SplitPane
                    split="vertical"
                    minSize={250}
                    maxSize={-200}
                    defaultSize={
                        parseInt(localStorage.getItem('splitPos'), 10) ||
                            document.body.clientWidth / 2
                    }
                    onChange={size => localStorage.setItem('splitPos', size)}
                    style={{ position: 'relative' }}
                >
                    <GraphiQL
                        ref={c => {
                            this.graphiql = c;
                            window.c = c;
                        }}
                        fetcher={this.graphQLFetcher}
                        defaultQuery={defaultQuery}
                        onEditVariables={this.debounceHandleEditVariables}
                        storage={{
                            getItem: this.getCachedStuff,
                            setItem: cache.setItem,
                            removeItem: cache.removeItem
                        }}
                    />
                    <JSONViewer
                        result={this.state.result}
                        advanced={this.state.advanced}
                    />
                </SplitPane>
            </div>
        );
    }
}
