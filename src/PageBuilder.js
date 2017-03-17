// @flow
import ranger, {apiGet } from './initiator';
import R from 'ramda'
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
    userFilter(args) {
        this.filters.users = args.users;
        this.filters.dateFrom = args.dateFrom;
        this.filters.dateTo = args.dateTo;
        this.filters.tags = args.tags;
        apiGet(this.filters)
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
        return this.promise.then((x) => ({
            args,
            result: this.result
        }));
    }
    data() {
    }
}
const pageBuilder = new PageBuilder();
window.page = pageBuilder;
export default pageBuilder;
