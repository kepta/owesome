import moment from 'moment';
import { SERVER_URL, PAGE_LIMIT } from '../config';

export function getPages(filters) {
    if (filters.users) {
        filters.users = filters.users.join(',');
    }
    return fetch(`${SERVER_URL}?${getQueryStr(filters)}`)
        .then(d => d.json())
        .then(d => {
            return d.docs;
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
