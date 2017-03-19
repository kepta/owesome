// @flow
import ranger, {apiGet } from './initiator';
import R from 'ramda';

// @Singleton
class PageBuilder {
    constructor() {
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
        this.filters = filters;
        if (filters.users || filters.dateFrom || filters.dateTo || filters.tags) {
            return this.loadOSc();
        }
        return Promise.resolve();
    }
    getResult() {
        return this.result;
    }
    loadOSc() {
        return apiGet(this.filters)
        .then(x => {
            return ranger.load(x, this.filters);
        })
        .then(r => {
            var result = R.unnest(r).filter(R.identity);
            this.result = result;
            console.debug('processed all oscs');
            this.promiseRes();
            return r;
        });
    }
}

const pageBuilder = new PageBuilder();

export default pageBuilder;
