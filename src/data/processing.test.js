var fs = require('fs');
var pako = require('pako');
var xtoj = require('xml2js').parseString;
import { validator, gimme, convertToObj } from './processing';
const xml = require('./fixtures/sample1.xml.js')
const wayXml = require('./fixtures/way.sample.xml.js')
const R = require('ramda');

const getSubStrCount = R.curry((str, sub) => (str.match(sub) || []).length);

function readFile() {
    var file = './__tests__/fixtures/999.osc';
    return new Promise((res, rej) => {
        fs.readFile(file, function read(err, data) {
            if (err) {
                return rej(err);
            }
            return res(data);

        });
    });

}

it('filters the way ', () => {
    const wayFree = convertToObj(xml, {
        way: false,
        node: true,
        relation: true
    });
    const way = convertToObj(xml);
    return Promise.all([wayFree, way]).then(r => {
        var [wayFree, way] = r;
        delete way.osmChange.modify[2].way
        expect(wayFree).toEqual(way);
    });
});

it('filters the way 2 ', () => {
    const wayFree = convertToObj(wayXml, {
        way: false,
        node: true,
        relation: true
    });
    const way = convertToObj(wayXml);
    return Promise.all([wayFree, way]).then(r => {
        var [wayFree, way] = r;
        delete way.osmChange.create[0].way;
        delete way.osmChange.modify[2].way;
        expect(wayFree).toEqual(way);
    });
});

it('filters the node ', () => {
    const nodeFree = convertToObj(xml, {
        way: true,
        node: false,
        relation: true
    });
    const node = convertToObj(xml);
    return Promise.all([nodeFree, node]).then(r => {
        var [nodeFree, node] = r;
        delete node.osmChange.modify[0].node;
        delete node.osmChange.modify[1].node;
        delete node.osmChange.delete[0].node;
        delete node.osmChange.delete[1].node;
        expect(nodeFree).toEqual(node);
    });
});

it('filters the node 2', () => {
    const nodeFree = convertToObj(wayXml, {
        way: true,
        node: false,
        relation: true
    });
    const node = convertToObj(wayXml);
    return Promise.all([nodeFree, node]).then(r => {
        var [nodeFree, node] = r;
        delete node.osmChange.create[0].node;
        delete node.osmChange.modify[0].node;
        delete node.osmChange.modify[1].node;
        delete node.osmChange.delete[0].node;
        delete node.osmChange.delete[1].node;
        expect(nodeFree).toEqual(node);
    });
});

it('filters the relation ', () => {
    const relationFree = convertToObj(xml, {
        way: true,
        node: true,
        relation: false
    });
    const relation = convertToObj(xml);
    return Promise.all([relationFree, relation]).then(r => {
        var [relationFree, relation] = r;
        delete relation.osmChange.create[0].relation;
        expect(relationFree).toEqual(relation);
    });
});

it('filters  relation, node ', () => {
    const nodeRelationFree = convertToObj(xml, {
        way: true,
        node: false,
        relation: false
    });
    const nodeRelation = convertToObj(xml);

    return Promise.all([nodeRelationFree, nodeRelation]).then(r => {
        var [nodeRelationFree, nodeRelation] = r;
        delete nodeRelation.osmChange.create[0].relation;
        delete nodeRelation.osmChange.modify[0].node;
        delete nodeRelation.osmChange.modify[1].node;
        delete nodeRelation.osmChange.delete[0].node;
        delete nodeRelation.osmChange.delete[1].node;
        expect(nodeRelationFree).toEqual(nodeRelation);
    });
});


it('filters  user ', () => {
    const nodeRelationFree = convertToObj(xml, {
        way: true,
        node: true,
        relation: true,
        users: ['8dirfriend']
    });
    const nodeRelation = convertToObj(xml);
    return Promise.all([nodeRelationFree, nodeRelation]).then(r => {
        var [nodeRelationFree, nodeRelation] = r;
        const userCountFree = getSubStrCount(JSON.stringify(nodeRelationFree));
        const userCount = getSubStrCount(JSON.stringify(nodeRelation));
        expect(userCount(/8dirfriend/g)).toEqual(userCountFree(/8dirfriend/g));
        expect(userCountFree(/tlt83/g)).toEqual(0);
        expect(userCountFree(/MikeN/g)).toEqual(0);
        expect(userCountFree(/sinclarius/g)).toEqual(0);
    });
});



