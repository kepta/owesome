// @flow
import ranger, {apiGet } from './initiator';
import R from 'ramda';
var log = (x) => {console.log(x); return x};
import { tagsFilter } from './filters'; 
function arraysEqual(arr1, arr2) {
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
class PageBuilder {
    constructor() {
        // const identifiers = pages.map(e => parseInt(e, 10));
        // this.pages = ranger(identifiers, 'andygol,PlaneMad');
        this.filters = {};
        this.promise = new Promise((res, rej) => {
            this.promiseRes = res;
            this.promiseRej = rej;
        });
    }
    createPinky() {
        this.promise = new Promise((res, rej) => {
            this.promiseRes = res;
            this.promiseRej = rej;
        });
    }
    getDie(args) {
        return this.promise.then(x => args);
    }
    setFilters(filters) {
        this.filters.users = filters.users;
        this.filters.dateFrom = filters.dateFrom;
        this.filters.dateTo = filters.dateTo;
        this.filters.tags = filters.tags;
        if (filters.users || filters.dateFrom || filters.dateTo || filters.tags) {
            return this.loadOSc();
        }
        return Promise.resolve();
    }
    getResult() {
        return this.result;
    }
    usersFilter(users) {
        return Promise.resolve(R.toPairs(R.groupBy(R.path(['$', 'user']), this.result)));
    }
    loadOSc() {
        return apiGet(this.filters)
        .then(x => {
            return ranger.load(x, this.filters);
        })
        .then(r => {
            var result = R.unnest(r).filter(R.identity);
            this.result = result;
            console.log('processed all');
            this.promiseRes();
            return r;
        });
    }
}
const pageBuilder = new PageBuilder();
window.page = pageBuilder;
export default pageBuilder;
