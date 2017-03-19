import R from 'ramda';
import work from 'webworkify-webpack';
import moment from 'moment';

const url = 'http://localhost:5000/page';
const LIMIT = 900;


const THREADS = 10;
class WorkerHandler {
    constructor() {
        this.workers = [];
        this.result = [];
        this.errored = []
        for (var i = 0; i < THREADS; i++) {
            const w =  {};
            w.instance = work(require.resolve('./worker.js'));
            w.currentPage = -1;
            w.id = i;
            w.queue = [];
            w.instance.onmessage = e => {
                if (typeof e.data === 'number') {
                    this.errored.push(e.data);
                } else {
                    this.result.push(e.data);
                }
                this.giveItWork(w);
            };
            this.workers.push(w);
        }
    }
    arraysEqual(arr1, arr2) {
        if (!arr2) return false;
        arr1 = arr1.sort((a, b) => a - b);
        arr2 = arr2.sort((a, b) => a - b);
        if (arr1.length !== arr2.length)
            return false;
        for (var i = arr1.length; i--;) {
            if (arr1[i] !== arr2[i])
                return false;
        }
        return true;
    }
    load(pages, filter) {
        if (pages.length === 0) {
            return Promise.reject("No data found");
        }        
        if (this.arraysEqual(pages, this.pages)) {
            return Promise.resolve(this.result);
        }
        console.log('starting load osc');
        this.result = [];
        this.errored = [];
        this.pages = pages;
        this.filter = filter;
        let grp = R.groupBy(n => n % THREADS, R.range(0, pages.length));
        this.oscstarted = new CustomEvent("oscstarted", { detail: pages.length});
        document.body.dispatchEvent(this.oscstarted);
        grp = R.map(r => r.map(x => pages[x]), grp);
        for(var i in grp) {
            this.workers[i].queue = grp[i];
            this.workers[i].currentPage = -1;
            this.giveItWork(this.workers[i]);
        }
        return new Promise((res, rej) => {
            document.body.addEventListener('oscloaded',() => res(this.result), { once: true });
        });
        
    }
    giveItWork(w) {
        var page = w.queue.pop()
        if (page) {
            w.currentPage = page;
            document.body.dispatchEvent(new CustomEvent("oscpageload", {
                detail: page
            }));
            w.instance.postMessage([page, JSON.stringify(this.filter)]);
        } else {
            w.currentPage = -1;
            if (this.errored.length + this.result.length === this.pages.length) {
                console.log('finished oscs, dispatching event')
                this.oscloaded = new CustomEvent("oscloaded");
                document.body.dispatchEvent(this.oscloaded);
            }
        }
    }
}
let ranger = new WorkerHandler();
window.ranger = ranger;
export default ranger;
//     w.onmessage = e => {
//         result.push(e.data);
//         count++;
//         if (count === Object.keys(grp).length) {
//             res(R.unnest(result));
//         }
//     };
//     w.postMessage([x, limit, JSON.stringify(_filter)]);
// }), grp)
export function ranger2(identifiers, filter, limit = 4, conc = 8)  {
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
        return R.forEach(((x) => {
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
        const { dateFrom, dateTo, bbox, users, tags } = filters;
        if (users) {
            params.push(`users=${users}`);
        }
        if (dateFrom) {
            params.push(`from=${moment(dateFrom).toISOString()}`);
        }
        if (dateTo) {
            params.push(`to=${moment(dateTo).toISOString()}`);
        }
        if (tags) {
            params.push(`tags=${tags.join(',')}`);
        }
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
            if (d.len > LIMIT) {
                console.log('rejecting', d && d.len)
                return Promise.reject("The query is insanely huge("+d.len+"). Only god knows the answer!" );
            }
            return d.docs;
        })
}