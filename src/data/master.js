import R from 'ramda';
import work from 'webworkify-webpack';
import moment from 'moment';
import { THREADS } from '../config';

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
        if (R.equals(pages, this.pages)) {
            return Promise.resolve(this.result);
        }
        console.log('starting load osc');
        this.result = [];
        this.errored = [];
        this.pages = pages;
        this.filter = filter;
        let grp = R.groupBy(n => n % THREADS, R.range(0, pages.length));
        grp = R.map(r => r.map(x => pages[x]), grp);
        for(var i in grp) {
            this.workers[i].queue = grp[i];
            this.workers[i].currentPage = -1;
            this.giveItWork(this.workers[i]);
        }
        this.oscstarted = new CustomEvent("oscstarted", { detail: pages.length});
        document.body.dispatchEvent(this.oscstarted);
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
let master = new WorkerHandler();
window.master = master;
export default master;
