export default `

        #geojsons
        type GeoJSONCoordinateReferenceSystem {
            type: GeoJSONCRSType!
            properties: GeoJSONCRSProperties!
        }

        scalar GeoJSONCoordinates

        union GeoJSONCRSProperties = GeoJSONNamedCRSProperties | GeoJSONLinkedCRSProperties

        enum GeoJSONCRSType {
        name
        link
        }
        union geometries = GeoJSONPoint | GeoJSONLineString
        type GeoJSONFeature implements GeoJSONInterface {
        type: GeoJSONType!
        bbox: [Float]
        geometry: JSONObject!
        properties: JSONObject
        id: String
        }

        type GeoJSONFeatureCollection implements GeoJSONInterface {
        type: GeoJSONType!
        features: [GeoJSONFeature!]!
        }

        type GeoJSONGeometryCollection implements GeoJSONInterface {
        type: GeoJSONType!
        bbox: [Float]
        geometries: [GeoJSONGeometryInterface!]!
        }

        interface GeoJSONGeometryInterface {
        type: GeoJSONType!
        bbox: [Float]
        coordinates: GeoJSONCoordinates
        }

        interface GeoJSONInterface {
        type: GeoJSONType!
        # bbox: [Float]
        }

        type GeoJSONLineString implements GeoJSONInterface, GeoJSONGeometryInterface {
        type: GeoJSONType!
        bbox: [Float]
        coordinates: GeoJSONCoordinates
        }

        type GeoJSONLinkedCRSProperties {
        href: String!
        type: String
        }

        type GeoJSONMultiLineString implements GeoJSONInterface, GeoJSONGeometryInterface {
        type: GeoJSONType!
        bbox: [Float]
        coordinates: GeoJSONCoordinates
        }

        type GeoJSONMultiPoint implements GeoJSONInterface, GeoJSONGeometryInterface {
        type: GeoJSONType!
        bbox: [Float]
        coordinates: GeoJSONCoordinates
        }

        type GeoJSONMultiPolygon implements GeoJSONInterface, GeoJSONGeometryInterface {
            type: GeoJSONType!
            bbox: [Float]
            coordinates: GeoJSONCoordinates
        }

        type GeoJSONNamedCRSProperties {
            name: String!
        }

        type GeoJSONPoint implements GeoJSONInterface, GeoJSONGeometryInterface {
            type: GeoJSONType!
            bbox: [Float]
            coordinates: GeoJSONCoordinates
        }

        type GeoJSONPolygon implements GeoJSONInterface, GeoJSONGeometryInterface {
            type: GeoJSONType!
            bbox: [Float]
            coordinates: GeoJSONCoordinates
        }

        enum GeoJSONType {
            Point
            MultiPoint
            LineString
            MultiLineString
            Polygon
            MultiPolygon
            GeometryCollection
            Feature
            FeatureCollection
        }

        scalar JSONObject
`;