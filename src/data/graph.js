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
    type Tag {
        count: Int
        values: [TagValue]
        key: String
        valueCount: Int
        users(users: [String]): [User]
    }
    type TagValue {
        value: String
        count: Int
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
        tags(tags: [String]): [Tag]
    }
    type PageBuilder {
        data: String
    }
    type Day {
        day: String
        timestamp: String
        users(users: [String]): [User]
        tags(tags: [String]): [Tag]
    }
    type Query {
        users(users: [String], dateFrom: String, dateTo: String): [User]
        pages(pageIds: [Int]!): PageBuilder
        nodes: [Node]
        ways: [Way]
        relations: [Relation]
        tags(tags: [String], dateFrom: String, dateTo: String) : [Tag]
        days(dateFrom: String, dateTo: String): [Day]
    }
`);
