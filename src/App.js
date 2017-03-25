import React from 'react';
import GraphiQL from 'graphiql';
import moment from 'moment';
import schema from './data/graph';
import {root} from './data/root';
import { graphql, parse, print, Source, visit, validate} from 'graphql';
import 'normalize.css/normalize.css'
import '@blueprintjs/core/dist/blueprint.css';
import './graphiql.css';
import { Intent, Spinner, DatePickerFactory,  } from "@blueprintjs/core";
import PageBuilder from './data/PageBuilder';
import R from 'ramda';
import { DateRangePicker } from 'react-dates';
import JSONTree from 'react-json-tree';
import SplitPane from 'react-split-pane';

const defaultQuery = `
{
	days(dateFrom: "2017-03-10", dateTo: "2017-03-20") {
	  day
	  timestamp
    users(users:["manings", "andygol"]) {
      uid
      user
      wayCount
      nodeCount
     	relationCount
      changeset
      tags {
        key
        count
      }
    }
	}
}
`
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

const themed = {
    scheme: 'monokai',
    author: 'wimer hazenberg (http://www.monokai.nl)',
    base00: '#272822',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633'
};

class ProgressIndicator extends React.Component {
    constructor() {
        super();
        this.state = {
            loaded: 0,
            total: 0
        }
        this.timestamp = Date.now();
        this.diff = 15;
        this.oscStarted = (n) => {
            this.setState({
                loaded: 0,
                total: n.detail
            });
        }
        this.oscloaded = (n) => {
            this.setState({
                loaded: 0,
                total: 0
            });
        }
        this.oscpageload = (n) => {
            const currentTime = Date.now();
            this.diff = 0.98 * (this.diff) + 0.02 * (currentTime - this.timestamp);
            this.timestamp = currentTime;
            this.setState({
                loaded: this.state.loaded + 1,
            });
        }
        document.body.addEventListener('oscstarted', this.oscStarted);
        document.body.addEventListener('oscloaded',  this.oscloaded);
        document.body.addEventListener('oscpageload', this.oscpageload);
    }
    componentWillUnmount() {
        document.body.removeEventListener('oscpageload', this.oscpageload);
        document.body.removeEventListener('oscstarted', this.oscStarted);
        document.body.removeEventListener('oscloaded', this.oscloaded);
        
    }
    render() {
        return this.state.total ? 
            <div>
                <span> Loading {this.state.loaded}/{this.state.total} </span>
                <span> {parseInt((this.state.total - this.state.loaded)*(this.diff/1000), 10) } seconds left</span>
                <span> {this.state.loaded % 3 === 0 ? '.' : this.state.loaded % 3 === 1 ? '..' : '...'}</span>
            </div>
          : null
    }
}

export default class App extends React.Component{
    constructor() {
        super();
        this.state = {
            focusedInput: null,
            startDate: moment().subtract(3, 'days'),
            endDate: moment()
        };
        this.graphQLFetcher = this.graphQLFetcher.bind(this);
    }

    graphQLFetcher(graphQLParams) {
        const source = new Source(graphQLParams.query, graphQLParams.variables);
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
            this.setState({ result, loading: false });
            return result;
        })
        .catch(console.error);
    }
    onOutsideClick = () => {
        console.log(arguments);
    }
    onDatesChange = ({ startDate, endDate }) => {
        this.setState({ startDate, endDate });
    }
    onFocusChange = (focusedInput) => {
        this.setState({ focusedInput });
    }
    handleChangeDate = ({ startDate, endDate }) => {
        const editor = this.graphiql.getVariableEditor();
        const variables = JSON.stringify({
            ...JSON.parse(editor.getValue()),
            dateFrom: startDate.toISOString().slice(0, 11) + '00:00:00Z',
            dateTo: endDate.toISOString().slice(0, 11) + '23:59:00Z'
        }, null, 2);
        // editor.setValue(variab);
        this.setState({ startDate, endDate, variables });
        this.graphiql.refresh();
    }
    render() {
        console.log(this.state.result);
        return (
            <div className="app">
                <nav className="pt-navbar .modifier">
                    <div className="pt-navbar-group pt-align-left">
                        <div className="pt-navbar-heading">Owesome</div>
                        <DateRangePicker
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            isOutsideRange={() => { }}
                            onNextMonthClick={() => { }}
                            onPrevMonthClick={() => { }}
                            onDatesChange={this.handleChangeDate} // PropTypes.func.isRequired,
                            focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                            onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                        />
                    </div>
                    <div className="pt-navbar-group pt-align-right">
                        <ProgressIndicator />
                        <button className="pt-button pt-minimal pt-icon-document">Files</button>
                        <span className="pt-navbar-divider"></span>
                        <button className="pt-button pt-minimal pt-icon-user"></button>
                        <button className="pt-button pt-minimal pt-icon-notifications"></button>
                        <button className="pt-button pt-minimal pt-icon-cog"></button>
                    </div>
                </nav>
                <SplitPane split="vertical" minSize={250} maxSize={-200} defaultSize={parseInt(localStorage.getItem('splitPos'), 10) || document.body.clientWidth / 2}
                    onChange={size => localStorage.setItem('splitPos', size)}  style={{position: 'relative'}} >
                    <GraphiQL
                        ref={c => { this.graphiql = c; }}
                        variables={this.state.variables}
                        fetcher={this.graphQLFetcher}
                        defaultQuery={defaultQuery}
                    />

                    <JSONTree 
                        theme={themed} 
                        className="random" 
                        data={this.state.result}
                        valueRenderer={(val, val2, val3, val4) => {
                            if (val4 === 'changeset') {
                                return <a target="_black" href={`https://osmcha.mapbox.com/${val2}`}>{val2}</a>
                            }
                            return <span>{val}</span>;
                        }}
                        shouldExpandNode={(keyName, data, level) => {
                            if (level < 2) return true;
                            if (Array.isArray(data)) {
                                return data.length < 30;
                            }
                            return Object.keys(data).length < 10;
                        }} />
                </SplitPane>
            </div>
        );
    }
}

