import { digest, getGz } from './network.processing';

function ranger(indentities, t, filter) {
    function goo(x, y, prev) {
        if (x >= indentities.length) {
            return Promise.resolve(prev.filter(x => x));
        };
        return Promise.all(indentities.slice(x, y).map((r) => getGz(r[1], r[0], filter)))
            .then(r => {
                return goo(y, Math.min(y + t, indentities.length),
                    prev.concat(digest(r)))
            })
            .catch(console.error);
    }
    return goo(0, Math.min(t, indentities.length), []);
}
function split(n) {
    return [parseInt(n / 1000), n % 1000];
}
export default function worker(self) {
    self.addEventListener('message', (event) => {
        var identities = event.data[0].map(split);
        var t = event.data[1];
        var filter = JSON.parse(event.data[2]);
        if (identities.length === 0) {
            return Promise.resolve([]).then(postMessage).then(self.close).catch(console.error);
        }
        var data = ranger(identities, t, filter);
        data.then(postMessage).then(self.close).catch(console.error);
    });
};

