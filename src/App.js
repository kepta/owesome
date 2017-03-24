import React from 'react';
import GraphiQL from 'graphiql';
import schema from './data/graph';
import {root} from './data/root';
import { graphql, parse, print, Source, visit, validate} from 'graphql';
import './graphiql.css';
import PageBuilder from './data/PageBuilder';
import R from 'ramda';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
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

export function graphQLFetcher(graphQLParams) {
    const source = new Source(graphQLParams.query);
    const documentAST = parse(source);
    const validationErrors = validate(schema, documentAST);
    if (validationErrors.length > 0) {
        return Promise.resolve({ errors: validationErrors });
    }
    const filters = findFilters(documentAST);
    // check if more than one month
    if (filters.dateFrom && filters.dateTo) {

    }
    return PageBuilder
        .setFilters(filters)
        .then(() => graphql(schema, graphQLParams.query, root, null, graphQLParams.variables, graphQLParams.operationName))
        .catch(console.error);
}

class ProgressIndicator extends React.Component {
    constructor() {
        super();
        this.state = {
            loaded: 0,
            total: 0
        }
        this.timestamp = Date.now();
        this.diff = 0.5;
        document.body.addEventListener('oscstarted',  (n)=> {
            this.setState({
                loaded: 0,
                total: n.detail
            });
        });
        document.body.addEventListener('oscloaded',  (n)=> {
            this.setState({
                loaded: 0,
                total: 0
            });
        });
        document.body.addEventListener('oscpageload', (n) => {
            const currentTime = Date.now();
            this.diff = 0.90 * (this.diff) + 0.05 * (currentTime - this.timestamp);
            this.timestamp = currentTime;
            this.setState({
                loaded: this.state.loaded + 1,
            });
        });
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
            startDate: null,
            endDate: null
        }
    }
    handleClickPrettifyButton = (event) => {
        console.log('ji')
        const editor = this.graphiql.getQueryEditor();
        const currentText = editor.getValue();
        const prettyText = print(parse(currentText));
        editor.setValue(prettyText);
    }
    render() {
        return (
            <GraphiQL 
              fetcher={graphQLFetcher}
              defaultQuery={defaultQuery}
              ref={c => { this.graphiql = c; }}
              />
        );
    }
}
                // <DateRangePicker
                //     withPortal
                //     withFullScreenPortal
                //     startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                //     endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                //     onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
                //     focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                //     onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                // />