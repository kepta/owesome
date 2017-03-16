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
    type User {
        uid: Int
        name: String
    }
    type Query {
        getDie(numSides: Int): RandomDie
        users(names: [String]): [User]
    }
`);
