import React from 'react';
import GraphiQL from 'graphiql';
import schema from './data/graph';
import {root} from './data/root';
import { graphql, parse, Source, visit, validate} from 'graphql';
import './graphiql.css';
import PageBuilder from './data/PageBuilder';
import R from 'ramda';

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
            this.setState({
                loaded: this.state.loaded + 1,
            });
        });
    }
    render() {
        return this.state.total ? 
            <span> Loading {this.state.loaded}/{this.state.total} {this.state.loaded % 3 === 0 ? '.' : this.state.loaded % 3 === 1 ? '..' : '...'} </span>
          : null
    }
}

export default class App extends React.Component{
    render() {
        return (
            <GraphiQL 
              fetcher={graphQLFetcher}
              defaultQuery={defaultQuery}
            >
                <GraphiQL.Logo>
                  Owesome
                </GraphiQL.Logo>
                <GraphiQL.Footer>
                    <ProgressIndicator />
                </GraphiQL.Footer>
            </GraphiQL>
        );
    }
}
