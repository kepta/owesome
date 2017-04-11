/*eslint-disable*/
import R from 'ramda';
onmessage = function(event) {
	var template = event.data;
    console.log('te', template);
    postMessage(JSON.stringify(R));

}