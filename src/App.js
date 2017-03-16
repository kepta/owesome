import React from 'react';
import ReactDOM from 'react-dom';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import schema from './graph';
import {root} from './root';
import { graphql } from 'graphql';
import './graphiql.css';
import PageBuilder from './PageBuilder';
export function graphQLFetcher(graphQLParams) {
    PageBuilder.createPinky();
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
              <GraphiQL.Button
              onClick={this.handleClickPrettifyButton}
              label="Prettify"
              title="Prettify Query"
            />

              <span>Hello</span>
          </GraphiQL.Toolbar>
      </GraphiQL>
    );
  }
}
