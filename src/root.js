import PageBuilder from './PageBuilder';
import R from 'ramda';
window.R = R;
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
class User {
    constructor(user, result) {
        debugger;
        this.user = user;
        this.result = result;
        this.dollarFree = R.pluck('$', result);
        this.userData = this.dollarFree.filter(x => x.user === this.user);
    }
    points() {
        var lat = R.pluck('lat', this.dollarFree).map(parseFloat);
        var lon = R.pluck('lon', this.dollarFree).map(parseFloat);
        debugger;
        return R.range(0, lat.length).map(n => ({
            lat: lat[n],
            lon: lon[n]
        }));
    }
    changeset() {
        return R.uniq(R.pluck('changeset', this.dollarFree));
    }
    uid() {
        return this.userData[0].uid;
    }
    user() {
        return this.user;
    }
    count() {
        return  this.userData.length;
    }
    nodes() {
        return this.dollarFree.filter(x => x.nwr === 'node').map(x => new Node(x));
    }
}

export var root = {
    getDie: function ({ numSides }) {
        return PageBuilder.getDie(numSides).then(() => new RandomDie(numSides || 6));
    },
    users: ({ user }) => PageBuilder.userFilter(user).then(obj => obj.args.map(x => new User(x, obj.result))),
    
};
