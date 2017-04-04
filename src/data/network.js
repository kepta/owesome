import moment from 'moment';
import { SERVER_URL, PAGE_LIMIT } from '../config';

export function getPages(filters) {
    if (filters.users) {
        filters.users = filters.users.join(',');
    }
    return fetch(`${SERVER_URL}?${getQueryStr(filters)}`)
        .then(d => d.json())
        .then(d => {
            if (d.len > PAGE_LIMIT) {
                console.log('rejecting', d && d.len);
                return Promise.reject(
                    'The query is insanely huge(' +
                        d.len +
                        '). Only god knows the answer!'
                );
            }
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
