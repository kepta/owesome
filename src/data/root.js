import R from 'ramda';
import { tagsFilter, usersFilter, daysFilter, wayFilter, cdmFilter } from './filters';
import moment from 'moment';
import { GraphQLScalarType } from 'graphql';

class CDM {
    constructor(create) {
        this.create = create;
    }
    days({ dateFrom, dateTo }) {
        return R.map(([day, o]) => new Day(day, o), daysFilter(dateFrom, dateTo));
    }
    users({users}) {
        return R.map(([u, o]) => new User(u, o), usersFilter(users));
    }
    tags({tags}) {
        return R.map(([tag, o]) => new Tag(tag, o), tagsFilter(tags));
    }
}

class LatLon {
    constructor(lat, lon) {
        this.lat = parseFloat(lat);
        this.lon = parseFloat(lon);
    }
    lat() {
        return this.lat;
    }
    lon() {
        return this.long;
    }
}

class FeatureCollection {
    constructor(data) {
        this.data = data;
    }
    type() {
        return "FeatureCollection"
    }
    features() {
       
    }
}

class Node {
    constructor(dollarNode) {
        this.dollarNode = dollarNode;
    }
    Feature() {
        return {

        }
    }
    point() {
        return new LatLon(this.dollarNode.lat, this.dollarNode.lon);
    }
    user() {
        return this.dollarNode.user;
    }
    uid() {
        return this.dollarNode.uid;
    }
    timestamp() {
        return this.dollarNode.timestamp;
    }
    version() {
        return this.dollarNode.version;
    }
    changeset() {
        return this.dollarNode.changeset;
    }
    id() {
        return this.dollarNode.id;
    }
    cdm() {
        return this.dollarNode.cdm;
    }
}
class Way {
    constructor(way) {
        this.way = way;
    }
    nd() {
        return R.map(R.path(['$', 'ref']), this.way.nd);
    }
    tag() {
        if (!this.way.tag) return;
        const obj = tagsFilter(null, [this.way]);
        return R.map(([tag, o]) => new Tag(tag, o), obj);
    }
    user() {
        return this.dollarNode.user;
    }
    uid() {
        return this.dollarNode.uid;
    }
    timestamp() {
        return this.dollarNode.timestamp;
    }
    version() {
        return this.dollarNode.version;
    }
    changeset() {
        return this.dollarNode.changeset;
    }
    id() {
        return this.dollarNode.id;
    }
    cdm() {
        return this.dollarNode.cdm;
    }
}

class TagKey {
    constructor(key, tags) {
        this.tags = tags;
        this.key = key;
    }
    key() {
        return this.key
    }
    count() {
        return this.tags.length;
    }
    values() {
        return R.countBy(R.toLower, R.pluck('v', this.tags));
    }
}

class Tag {
    constructor(key, tags) {
        // this.data = Rtags;
        this.tags = tags;
        this.key = key;
    }
    key() {
        return this.key
    }
    count() {
        return R.uniq(R.map(R.path(["$", "v"]), this.tags)).length;
    }
    values() {
        return R.values(R.mapObjIndexed((v, k) => ({ value: k, count: v }), R.countBy(R.identity, R.map(R.path(["$", "v"]), this.tags))));
    }
}

class Day {
    constructor(day, result) {
        this.day = moment(day);
        this.result = result;
        this.dollarFree = R.pluck('$', result);
        this.changeset = R.uniq(R.pluck('changeset', this.dollarFree));
        this.count = R.countBy(x => x.nwr, this.dollarFree);
    }
    timestamp() {
        return this.day.toISOString();
    }
    users(args) {
        return R.map(([u, o]) => new User(u, o), usersFilter(args, this.result));
    }
    tags(args) {
        const obj = tagsFilter(args, this.result);
        return R.map(([tag, o]) => new Tag(tag, o), obj);
    }
    nodeCount() {
        return this.count.node || 0;
    }
    wayCount() {
        return this.count.way || 0;
    }
    relationCount() {
        return this.count.relation || 0;
    }
    changesetCount() {
        return this.changeset.length;
    }

    getMoment() {
        return this.day;
    }
    day() {
        return this.day.format("Do MMM");
    }
}
class GeoJSONPoint {
    constructor(data) {
        this.data = data;
    }
    type() {
        return "Point";
    }
    coordinates() {
        console.log('here bro')
        return [[1232, 22], [12, 21]];
    }
}
class Feature {
    constructor(data) {
        this.data = data;
    }
    type() {
        return "Feature";
    }
    geometry() {
        return JSON.stringify({
            type: "Point",
            coordinates: [parseFloat(this.data.$.lon), parseFloat(this.data.$.lat)]
            });      
    }
    properties() {
        return JSON.stringify({
            random: "properties"
        })
    }
}
class FeatureCollectionObject {
    constructor(data) {
        this.data = data;
    }
    type() {
        return "FeatureCollection";
    }
    features() {
        return this.data.filter(d => d.$.lat).map(d => new Feature(d));
    }
}
class User {
    constructor(user, result) {
        this.user = user;
        this.result = result;
        this.dollarFree = R.pluck('$', result);
        this.userData = this.dollarFree;
        this.changeset = R.uniq(R.pluck('changeset', this.userData));
        this.count = R.countBy(x => x.nwr, this.userData);
    }
    points() {
        var lat = R.pluck('lat', this.userData).filter(R.identity).map(parseFloat);
        var lon = R.pluck('lon', this.userData).filter(R.identity).map(parseFloat);
        return R.range(0,lat.length).map(n => ({
            lat: lat[n],
            lon: lon[n]
        }));
    }
    featureCollection() {
        return new FeatureCollectionObject(this.result);
    }
    changeset() {
        return this.changeset;
    }
    changesetCount() {
        return this.changeset.length;
    }
    uid() {
        return this.userData[0].uid;
    }
    user() {
        return this.user;
    }
    ways() {
        return wayFilter(null, this.result).map(x => new Way(x));
    }
    objectCount() {
        return this.userData.length || 0;
    }
    nodeCount() {
        return this.count.node || 0;
    }
    wayCount() {
        return this.count.way || 0;
    }
    relationCount() {
        return this.count.relation || 0;
    }
    nodes() {
        return this.dollarFree.filter(x => x.nwr === 'node').map(x => new Node(x));
    }
    // TOFIX args uniform everywhere
    tags({tags}) {
        const obj = tagsFilter(tags, this.result);
        return  R.map(([tag, o]) => new Tag(tag, o), obj);
    }
}

export var root = {
    days: ({ dateFrom, dateTo }) => R.map(([day, o]) => new Day(day, o), daysFilter(dateFrom, dateTo)),
    users: ({ users }) => R.map(([u, o]) => new User(u, o), usersFilter(users)),
    tags: ({ tags }) => R.map(([tag, o]) => new Tag(tag, o), tagsFilter(tags)),
    create: () => new CDM('create', cdmFilter()),
    modify: () => new CDM('create', cdmFilter()),
    delete: () => new CDM('delete', cdmFilter()),
};
