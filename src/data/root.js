import R from 'ramda';
import { tagsFilter, usersFilter, dayFilter } from './filters';
import moment from 'moment';
class Node {
    constructor(dollarNode) {
        this.dollarNode = dollarNode;
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
    // @tags [{$: {k, v}, parent: {$, nd, tag}}] 
    // not the parent.tag will be filtered from source
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
    }
    getMoment() {
        return this.day;
    }
    day() {
        return this.day.format("Do MMM");
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
}

class User {
    constructor(user, result) {
        this.user = user;
        this.result = result;
        this.dollarFree = R.pluck('$', result);
        this.userData = this.dollarFree;
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
    changeset() {
        return R.uniq(R.pluck('changeset', this.userData));
    }
    uid() {
        return this.userData[0].uid;
    }
    user() {
        return this.user;
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
    days: ({ dateFrom, dateTo }) => R.map(([day, o]) => new Day(day, o), dayFilter(dateFrom, dateTo)),
    users: ({ users }) => R.map(([u, o]) => new User(u, o), usersFilter(users)),
    tags: ({ tags }) => R.map(([tag, o]) => new Tag(tag, o), tagsFilter(tags)),
};
