import PageBuilder from './PageBuilder';

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

class User {
    constructor(name) {
        console.log(name)
        this.name = name || 'kwaha';
    }
    uid() {
        return 213;
    }
    name() {
        return this.name;
    }
}

export var root = {
    getDie: function ({ numSides }) {
        return new RandomDie(numSides || 6);
    },
    users: ({ names }) => names.map(n => new User(n)),
    pages: ({ pages }) => new PageBuilder(pages)
};
