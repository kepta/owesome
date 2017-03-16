// @flow
import { ranger, apiGet } from './initiator';
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
        this.filters.users = args;
        apiGet(this.filters)
        .then(x => {
            console.log(arraysEqual(x, this.pages),x, this.pages, this.filters)
            if (arraysEqual(x, this.pages)) {
                return this.result;
            }
            this.pages = x;
            
            if (x.length > 200) {
                var i = 0;
                this.result = [];
                return ranger(x.slice(0, 200), this.filters)
                .then(r => {
                    this.result = r.concat(this.result);
                    console.log('first atch');
                    return ranger(x.slice(200, Math.min(400, this.pages.length)), this.filters);
                })
                .then( r => {
                    this.result = r.concat(this.result);
                    if (x.length > 400) {
                        return ranger(x.slice(400, this.pages.length), this.filters).then(r => {
                            this.result = r.concat(this.result);
                            return this.result;
                        });
                    }
                    return this.result;
                });
            }
            return this.result
        })
        .then(r => {
            this.result = r;
            window.r = r;
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
