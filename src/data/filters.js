import R from 'ramda';
import PageBuilder from './PageBuilder';
export function tagsFilter(filters, entries) {
    if (!entries) {
        entries = PageBuilder.getResult();
    }
    const tagFiltersKey = Array.isArray(filters) && filters.map(x => x.split('=')[0]);
    const filterTags = entry => {
        if (Array.isArray(filters)) return R.pick(tagFiltersKey, entry);
        else return entry;
    };

    const addParent = R.curry((parent, tag) => R.assoc('parent', { $: parent.$, nd: parent.nd, tag: [tag] }, tag));
    const addParentCopyToEachTag = R.compose(
        R.map(([tag, parent]) => R.map(addParent(parent), tag)),
        R.filter(R.head),
        entries => R.zip(R.pluck('tag', entries), entries)
    );
    const fortified = R.compose(
        R.toPairs,
        filterTags,
        R.groupBy(t => t.$.k),
        R.unnest,
        addParentCopyToEachTag
    );
    return fortified(entries);
}