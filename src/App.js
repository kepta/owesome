import React from 'react';
import GraphiQL from 'graphiql';
import moment from 'moment';
import schema from './data/graph';
import {root} from './data/root';
import { graphql, parse, print, Source, visit, validate} from 'graphql';
import 'normalize.css/normalize.css'
import '@blueprintjs/core/dist/blueprint.css';
import './graphiql.css';
import { Intent, Spinner, DatePickerFactory } from "@blueprintjs/core";
import PageBuilder from './data/PageBuilder';
import R from 'ramda';
import { DateRangePicker } from 'react-dates';
import JSONTree from 'react-json-tree';
import SplitPane from 'react-split-pane';
import copy from 'copy-to-clipboard';
import JSONViewer from './ui/JSONViewer';
import ProgressIndicator from './ui/ProgressIndicator';
import Navbar from './ui/Navbar';
const defaultQuery = `
    # Keyboard shortcuts:
    #   Run Query:  Ctrl-Enter (or press the play button above)
    #   Auto Complete:  Ctrl-Space (or just start typing)

    query ($dateFrom: String, $dateTo: String){
        days(dateFrom: $dateFrom, dateTo: $dateTo) {
        day
            users(users:["andygol", "manings"]) {
            user
            changeset
            }
        }
    }
`;

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
            } 
            catch(e) {
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
                            argValues = a.value.values.map(R.prop('value'))
                        } else {
                            argValues = a.value.value;
                        }

                        if (Array.isArray(filters[argKey])) {
                            filters[argKey] = R.uniq(filters[argKey].concat(argValues));
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


export default class App extends React.Component{
    constructor() {
        super();
        const variables = this.getCachedVariables();
        this.state = {
            focusedInput: null,
            variables: variables,
            result: undefined
        };
        this.graphQLFetcher = this.graphQLFetcher.bind(this);
    }
    getCachedVariables() {
        var variables;
        try {
            variables = JSON.parse(cache.getItem('graphiql:variables'));
        }
        catch(e) {
            if (e) {
                console.error(e);
            }
        }
        
        if (!variables) {
            variables = {};
        }

        if (!variables.dateTo || !variables.dateFrom) {
            variables.dateTo = moment().toISOString();
            variables.dateFrom = moment().subtract(3, 'days').toISOString()
        }

        return variables;
    }
    graphQLFetcher(graphQLParams) {
        const source = new Source(graphQLParams.query);
        const documentAST = parse(source);
        const validationErrors = validate(schema, documentAST);
        if (validationErrors.length > 0) {
            return Promise.resolve({ errors: validationErrors });
        }
        const filters = Object.assign({}, findFilters(documentAST), graphQLParams.variables);
        // check if more than one month
        console.log(filters, findFilters(documentAST));
        if (filters.dateFrom && filters.dateTo) {

        }
        return PageBuilder
        .setFilters(filters)
        .then(() => graphql(schema, graphQLParams.query, root, null, graphQLParams.variables, graphQLParams.operationName))
        .then((result) => {
            this.setState({ result });
            return result;
        })
        .catch(console.error);
    }
    onOutsideClick = () => {
        console.log(arguments);
    };
    onDatesChange = ({ startDate, endDate }) => {
        this.setState({ startDate, endDate });
    };
    onFocusChange = (focusedInput) => {
        this.setState({ focusedInput });
    };
    handleChangeDate = ({ startDate, endDate }) => {
        const variables = Object.assign({}, this.state.variables, {
            dateFrom: startDate.toISOString().slice(0, 11) + '00:00:00Z',
            dateTo: endDate.toISOString().slice(0, 11) + '23:59:00Z'
        });
        // editor.setValue(variab);
        this.setState({ variables });
        this.graphiql.refresh();
    };
    jsonLiteHandler = () => {
        this.setState({
            advanced: !this.state.advanced
        })
    };
    handleEditVariables = (vars) => {
        const variables = JSON.parse(vars);
        this.setState({
            variables: variables
        });
    };
    render() {
        return (
            <div className="app">
                <Navbar 
                    variables={this.state.variables}
                    handleChangeDate={this.handleChangeDate}
                    focusedInput={this.state.focusedInput}
                    onFocusChange={this.onFocusChange}
                    advanced={this.state.advanced}
                    jsonLiteHandler={this.jsonLiteHandler}
                />
                <SplitPane split="vertical" minSize={250} maxSize={-200} defaultSize={parseInt(localStorage.getItem('splitPos'), 10) || document.body.clientWidth / 2}
                    onChange={size => localStorage.setItem('splitPos', size)}  style={{position: 'relative'}} >
                    <GraphiQL
                        ref={c => { this.graphiql = c; window.c = c }}
                        fetcher={this.graphQLFetcher}
                        defaultQuery={defaultQuery}
                        variables={JSON.stringify(this.state.variables)}
                        onEditVariables={this.handleEditVariables}
                        storage={{
                            getItem: cache.getItem,
                            setItem: cache.setItem,
                            removeItem: cache.removeItem
                        }}
                    />
                    <JSONViewer result={this.state.result} advanced={this.state.advanced}/>
                </SplitPane>
            </div>
        );
    }
}

