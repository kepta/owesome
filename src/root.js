import PageBuilder from './PageBuilder';
import R from 'ramda';
window.R = R;
const limit = 1000;
class RandomDie {
    constructor(numSides) {
        this.numSides = numSides;
    }

    rollOnce() {
        return 1 + Math.floor(Math.random() * this.numSides);
    }

    roll({ numRolls }) {
        var output = [];
        for (var i = 0; i < numRolls; i++) {
            output.push(this.rollOnce());
        }
        return output;
    }
    name() {
        return 'kushan';
    }
}

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
        return R.uniq(R.pluck('v', this.tags));
    }
}
class Tags {
    constructor(tagFilters, tags) {
        this.tags = R.compose(
            R.pluck('$'),
            R.unnest,
            R.pluck('tag'),
            R.forEach(r => r.tag.forEach(t => t.$.info = r.$))
        )(tags);
        this.tagFilters = tagFilters;
        console.log(tagFilters);
    }
    count() {
        return this.tags.length;
    }
    filter(k, v) {
        // return
        // tagFilters.forEach()
    }
    keys() {
        return R.compose(R.map(t => new TagKey(t[0], t[1])), R.toPairs, R.groupBy(t => t.k))(this.tags);
    }
}
class User {
    constructor(user, result) {
        this.user = user;
        this.result = result;
        this.dollarFree = R.pluck('$', result);
        this.userData = this.dollarFree.filter(x => x.user === this.user);
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
    tags(args) {
        const tags = this.result.filter(x => x.$.user === this.user && x.hasOwnProperty('tag'));
        return new Tags(args, tags)
    }
}

export var root = {
    getDie: function ({ numSides }) {
        return PageBuilder.getDie(numSides).then(() => new RandomDie(numSides || 6));
    },
    users: (args) => PageBuilder.userFilter(args).then(obj => obj.args.users.map(x => new User(x, obj.result))),
};
