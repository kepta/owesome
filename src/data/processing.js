import R from 'ramda';
import pako from 'pako';
import { parseString as xtoj } from 'xml2js';
import { OSC_URL } from '../config';
const concatAll = R.unapply(R.reduce(R.concat, []));

export const gimme = R.curry((s, d) => R.pluck(s, d).filter(R.identity));
const bgMp = R.forEachObjIndexed((cdm, key1) =>
    R.forEachObjIndexed(
        (nwr, key2) => {
            nwr.forEach(m => {
                if (!m) return;
                m.$.nwr = key2;
                m.$.cdm = key1;
            });
        },
        cdm
    ));
const flattenIt = R.curry(d =>
    R.unnest(R.unnest(R.compose(R.map(R.values), R.values)(d))));

export const extractNWR = rron => ({
    node: R.unnest(R.unnest(R.map(gimme('node'))(rron))),
    way: R.unnest(R.unnest(R.map(gimme('way'))(rron))),
    relation: R.unnest(R.unnest(R.map(gimme('relation'))(rron)))
});

export const extractCDM = r => ({
    create: extractNWR(gimme('create', r)),
    delete: extractNWR(gimme('delete', r)),
    modify: extractNWR(gimme('modify', r))
});

export function digest(r) {
    const pick = (x, y) =>
        R.compose(
            R.map(i => {
                if (!i) {
                    return;
                }
                i.$.nwr = x;
                i.$.cdm = y;
                return i;
            }),
            R.filter(R.identity),
            R.unnest,
            gimme(x)
        );
    const newExtractNWR = (rron, cdm) => {
        if (!rron) return [];
        return concatAll(
            pick('node', cdm)(rron),
            pick('way', cdm)(rron),
            pick('relation', cdm)(rron)
        );
    };
    return concatAll(
        newExtractNWR(r.osmChange.create, 'create'),
        newExtractNWR(r.osmChange.modify, 'modify'),
        newExtractNWR(r.osmChange.delete, 'delete')
    );
}
export function convertToObj(d, filter) {
    return new Promise((res, rej) =>
        xtoj(d, { async: true, validator: validator(filter) }, (er, result) => {
            if (er) rej(er);
            return res(result);
        }));
}

export function validator(filter = {}) {
    const nwr = ['node', 'way', 'relation'];
    const cmd = ['create', 'modify', 'delete'];
    return (xpath, currentValue, newValue) => {
        var retValue = newValue;
        for (let b of cmd) {
            if (xpath === `/osmChange/${b}`) {
                for (let m of nwr) {
                    if (filter[m] === false) {
                        delete newValue[m];
                        retValue = newValue;
                    }
                }
            } else if (filter.users) {
                if (xpath === `/osmChange/${b}/node`) {
                    if (filter.users.indexOf(newValue.$.user) === -1) {
                        retValue = undefined;
                    }
                } else if (xpath === `/osmChange/${b}/way`) {
                    if (filter.users.indexOf(newValue.$.user) === -1) {
                        retValue = undefined;
                    }
                } else if (xpath === `/osmChange/${b}/relation`) {
                    if (filter.users.indexOf(newValue.$.user) === -1) {
                        retValue = undefined;
                    }
                }
            }
        }
        return retValue;
    };
}

export function getGz(_n, p, filter) {
    var n = _n;
    if (_n === 0) n = '0';
    if (_n < 10) n = '0' + n;
    if (_n < 100) n = '0' + n;
    return fetch(`${OSC_URL}/${p}/${n}.osc.gz`)
        .then(d => d.arrayBuffer())
        .then(d => pako.inflate(d, { to: 'string' }))
        .then(d => convertToObj(d, filter));
}
