import R from 'ramda';
import work from 'webworkify-webpack';
import moment from 'moment';

const url = 'http://localhost:5000/page';
const LIMIT = 900;

export function ranger(identifiers, filter, limit = 4, conc = 8)  {
    let result = [];
    let count = 0;
    let grp = R.groupBy(n => n % conc, R.range(0, identifiers.length));
    grp = R.map(r => r.map(x => identifiers[x]), grp);
    var _filter = {
        way: true,
        node: true,
        relation: true
    };
    if (filter.users) {
        _filter.users = filter.users;
    }
    return new Promise((res, rej) => {
        return R.map(((x) => {
            const w = work(require.resolve('./worker.js'));
            w.onmessage = e => {
                result.push(e.data);
                count++;
                if (count === Object.keys(grp).length) {
                    res(R.unnest(result));
                }
            };
            w.postMessage([x, limit, JSON.stringify(_filter)]);
        }), grp);
    });
}
function getQueryStr(filters) {
    var params = [];
    if (filters) {
        const { dateFrom, dateTo, bbox, users } = filters;
        if (users) {
            params.push(`users=${users}`);
        }
        if (moment.isMoment(dateFrom)) {
            params.push(`from=${dateFrom.toISOString()}`);
        }
        if (moment.isMoment(dateTo)) {
            params.push(`to=${dateTo.toISOString()}`);
        }
        // if (tags) {
        //     params.push(`tags=${tags}`);
        // }
        if (bbox) {
            params.push(`bbox=${bbox}`);
        }
    }
    return params.length > 0 ? params.join('&') : '';
}
export function apiGet(filters) {
    if (filters.users) {
        filters.users = filters.users.join(',');
    }
    return fetch(`${url}?${getQueryStr(filters)}`)
        .then(d => d.json())
        .then(d => {
            console.log(d.len);
            if (d.len > LIMIT) {
                console.log('rejecting', d && d.len)
                return Promise.reject(d.problem);
            }
            return d.docs.map(x => x.page);
        })
        .catch(console.error);
}