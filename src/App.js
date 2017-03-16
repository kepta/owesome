import React from 'react';
import ReactDOM from 'react-dom';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import schema from './graph';
import {root} from './root';
import { graphql } from 'graphql';
import './graphiql.css';
export function graphQLFetcher(graphQLParams) {
  // return Promise.resolve(
  return graphql(schema, graphQLParams.query, root).then(r => {
    return r;
  })
}

export default class App extends React.Component{
  render() {
    return (
      <GraphiQL 
        fetcher={graphQLFetcher}
      >
          <GraphiQL.Logo>
            Custom Logo
          </GraphiQL.Logo>
          <GraphiQL.Toolbar>
              <span>Hello</span>
          </GraphiQL.Toolbar>
      </GraphiQL>
    );
  }
}
