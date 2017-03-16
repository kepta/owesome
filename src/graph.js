/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

const {
    buildSchema,
} = require('graphql');

export default buildSchema(`
    type RandomDie {
        roll(numRolls: Int!): [Int]
        name: String
    }
    type LatLng {
        lat: Float
        lon: Float
    }
    type Nodes {
        count: Int
    }
    type Node {
        user: String
        uid: ID
        timestamp: String
        version: Int
        changeset: String
        id: ID
        cdm: String
    }
    type Way {
        count: Int
    }
    type Relation {
        count: Int
    }
    type User {
        uid: ID
        user: String
        count: Int
        changeset: [String]
        points: [LatLng]
        nodes: [Node]
        ways: [Way]
        relations: Relation
    }
    type PageBuilder {
        data: String
    }
    type Query {
        getDie(numSides: Int): RandomDie
        users(user: [String]): [User]
        pages(pageIds: [Int]!): PageBuilder
        nodes: [Node]
        ways: [Way]
        relations: [Relation]
    }
`);
