// @flow
import master from './master';
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
    getDie(args) {
        return this.promise.then(x => args);
    }
    getResult() {
        return this.result;
    }
    loadOSc(pages, filters) {
        this.filters = filters;
        if (
            filters.users || filters.dateFrom || filters.dateTo || filters.tags
        ) {
            return master.load(pages, this.filters).then(r => {
                var result = R.unnest(r).filter(R.identity);
                this.result = result;
                console.debug('processed all oscs');
                return r;
            });
        } else {
            return Promise.resolve();
        }
    }
}

const pageBuilder = new PageBuilder();
export default pageBuilder;
