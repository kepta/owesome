import { GraphQLScalarType } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import geojsonSchema from './geojsonSchema';

const JSONObject = new GraphQLScalarType({
    name: 'JSONObject',
    description: 'Arbitrary JSON value',
    serialize: coerceObject,
    parseValue: coerceObject,
    parseLiteral: parseObject
});

const GeoJSONCoordinates = new GraphQLScalarType({
    name: 'GeoJSONCoordinates',
    description: 'A (multidimensional) set of coordinates following x, y, z order.',
    serialize: coerceCoordinates,
    parseValue: coerceCoordinates,
    parseLiteral: parseCoordinates
});

export default makeExecutableSchema({
    typeDefs: `
    type LatLon {
        lat: Float
        lon: Float
    }
    type Nodes {
        count: Int
    }
    type Node {
        Feature: JSONObject
        user: String
        uid: ID
        timestamp: String
        version: Int
        changeset: String
        id: ID
        cdm: String
        point: LatLon
    }
    type Way {
        count: Int
        nd: [String]
        tag: [Tag]
    }
    type Relation {
        count: Int
    }
    type TagKey {
        count: Int
        values: [String]
        key: String
    }
    type Tag {
        count: Int
        values: [TagValue]
        key: String
    }
    type TagValue {
        value: String
        count: Int
    }
    type User {
        featureCollection: GeoJSONFeatureCollection
        uid: ID
        user: String
        objectCount: Int
        wayCount: Int
        nodeCount: Int
        relationCount: Int
        changeset: [String]
        points: [LatLon]
        nodes: [Node]
        changesetCount: Int
        ways: [Way]
        relations: Relation
        tags(tags: [String]): [Tag]
        days(dateFrom: String, dateTo: String): [Day]
    }

    type PageBuilder {
        data: String
    }
    # A feed of repository submissions
    type Day {
        day: String
        timestamp: String
        users(users: [String]): [User]
        tags(tags: [String]): [Tag]
        objectCount: Int
        wayCount: Int
        nodeCount: Int
        relationCount: Int
        changesetCount: Int
        changeset: [String]
        nodes: [Node]
        ways: [Way]
        relations: Relation
        points: [LatLon]
    }

    ${geojsonSchema}

    type Query {
        users(users: [String] = ["andygol"], dateFrom: String, dateTo: String): [User]
        nodes: [Node]
        ways: [Way]
        relations: [Relation]
        tags(tags: [String], dateFrom: String, dateTo: String) : [Tag]
        # random shit
        # goes on
        days(dateFrom: String = "2017-03-23", dateTo: String = "2017-03-17", bbox: [Float]): [Day]
    }

`,
    resolvers: {
        JSONObject,
        GeoJSONCoordinates
    }
});

function coerceObject(value) {
    return JSON.parse(value);
}

function parseObject(valueAST) {
    return JSON.stringify(valueAST.value);
}

function coerceCoordinates(value) {
    console.log('here', value);

    return value;
}

function parseCoordinates(valueAST) {
    console.log('here', valueAST);

    return valueAST.value;
}
