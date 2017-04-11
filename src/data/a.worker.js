import { getGz, digest } from './processing';
import 'whatwg-fetch';

function slave(n, filter) {
  var [y, x] = split(n);
  return getGz(x, y, filter).then(digest).then(postMessage);
}
function split(n) {
  return [parseInt(n / 1000, 10), n % 1000];
}
self.onmessage = function(event) {
  var page = event.data[0];
  var filter = JSON.parse(event.data[1]);
  slave(page, filter).catch(e => {
    console.error(e);
    postMessage(page);
  });
};
