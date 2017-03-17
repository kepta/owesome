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
    type TagKey {
        count: Int,
        values: [String]
        key: String
    }
    type Tags {
        count: Int
        keys: [TagKey]
    }
    type User {
        uid: ID
        user: String
        objectCount: Int
        wayCount: Int
        nodeCount: Int
        relationCount: Int
        changeset: [String]
        points: [LatLng]
        nodes: [Node]
        ways: [Way]
        relations: Relation
        tags(tags: [String]): Tags
    }
    type PageBuilder {
        data: String
    }
    type Query {
        getDie(numSides: Int): RandomDie
        users(users: [String], dateFrom: String, dateTo: String): [User]
        pages(pageIds: [Int]!): PageBuilder
        nodes: [Node]
        ways: [Way]
        relations: [Relation]
    }
`);
