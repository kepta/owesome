import R from 'ramda';
import PageBuilder from './PageBuilder';
export function tagsFilter(filters, entries) {
    if (!entries) {
        entries = PageBuilder.getResult();
    }
    const getKeyFromString = R.ifElse(R.contains('='), s => s.split('=')[0], R.identity);
    const tagFiltersKey = Array.isArray(filters) && filters.map(getKeyFromString);
    const filterTags = R.ifElse(() => Array.isArray(filters), R.pick(tagFiltersKey), R.identity);
    const fortified = R.compose(
        R.toPairs,
        filterTags,
        R.groupBy(t => t.$.k),
        R.unnest,
        R.filter(R.identity),
        R.pluck('tag')
    );
    return fortified(entries);
}

export function usersFilter(filters, entries) {
    if (!entries) {
        entries = PageBuilder.getResult();
    }
    return R.toPairs(R.groupBy(R.path(['$', 'user']), entries));
}
export function wayFilter(filters, entries) {
    if (!entries) {
        entries = PageBuilder.getResult();
    }
    const result = R.filter(x => R.path(['$', 'nwr'], x) === 'way', entries);
    window.nd = result.map(R.map(R.path(['$', 'ref'])));
    return result;
}

export function daysFilter(dateFrom, dateTo, entries) {
    if (!entries) {
        entries = PageBuilder.getResult();
    }
    const parseDate = R.compose(s => s.slice(0, 11) + '00:00:00Z', R.path(['$', 'timestamp']))
    return R.toPairs(R.groupBy(parseDate, entries)).sort((a, b) => a[0].localeCompare(b[0]));
}