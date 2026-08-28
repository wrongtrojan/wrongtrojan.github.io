import type { CollectionEntry } from 'astro:content';

type Entry = CollectionEntry<'note'> | CollectionEntry<'create'>;

export function cleanId(id: string) {
  return id
    .replace(/\\/g, '/')
    .replace(/\.(md|mdx)$/i, '')
    .replace(/(^|\/)index$/i, '$1')
    .replace(/\/$/, '');
}

function fileRelId(entry: Entry) {
  const raw = (entry.filePath || entry.id).replace(/\\/g, '/');
  const stripped = raw.replace(/^.*\/src\/content\/(?:note|create)\//, '').replace(/^src\/content\/(?:note|create)\//, '');
  return cleanId(stripped);
}

export function treeId(entry: Entry) {
  return fileRelId(entry);
}

export function entrySlug(entry: Entry) {
  const idPath = fileRelId(entry);
  let slug: string;
  if (entry.data.slug) {
    if (entry.data.slug.includes('/')) slug = entry.data.slug;
    else {
      const parent = idPath.includes('/') ? idPath.slice(0, idPath.lastIndexOf('/')) : '';
      slug = parent ? `${parent}/${entry.data.slug}` : entry.data.slug;
    }
  } else {
    slug = idPath;
  }
  if (entry.collection === 'note') slug = slug.toLowerCase();
  return slug;
}

export function entryPath(entry: Entry) {
  const base = entry.collection === 'note' ? '/note/' : '/create/';
  const slug = entrySlug(entry);
  return slug ? `${base}${slug}/` : base;
}

export function isIndex(entry: Entry) {
  const file = (entry.filePath || entry.id).replace(/\\/g, '/');
  return !entry.data.date || /(^|\/)index\.(md|mdx)$/i.test(file) || /(^|\/)index$/i.test(cleanId(file));
}

export function sortEntries<T extends Entry>(entries: T[]) {
  return [...entries].sort((a, b) => {
    const byWeight = (a.data.weight || 0) - (b.data.weight || 0);
    if (byWeight) return byWeight;
    return (b.data.date?.valueOf() || 0) - (a.data.date?.valueOf() || 0);
  });
}

export function sortBySeries<T extends Entry>(entries: T[]) {
  return [...entries].sort((a, b) => {
    const byOrder = (a.data.series_order || 0) - (b.data.series_order || 0);
    if (byOrder) return byOrder;
    return (a.data.weight || 0) - (b.data.weight || 0);
  });
}

export function seriesPath(name: string) {
  return `/series/${encodeURIComponent(name)}/`;
}

export function notesInSeries(notes: CollectionEntry<'note'>[], name: string) {
  return sortBySeries(notes.filter((item) => !item.data.draft && !isIndex(item) && item.data.series.includes(name)));
}

export function folderSiblings(entry: Entry, notes: CollectionEntry<'note'>[]) {
  const id = treeId(entry);
  const parent = id.includes('/') ? id.slice(0, id.lastIndexOf('/')) : '';
  return sortEntries(notes.filter((item) => {
    if (item.data.draft || isIndex(item)) return false;
    const itemId = treeId(item);
    const itemParent = itemId.includes('/') ? itemId.slice(0, itemId.lastIndexOf('/')) : '';
    return itemParent === parent;
  }));
}

export function formatDate(date?: Date) {
  return date
    ? new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }).format(date)
    : '';
}

export function plainSummary(body = '', fallback = '') {
  if (fallback) return fallback;
  return body
    .replace(/---[\s\S]*?---/, '')
    .replace(/<[^>]*>|\{\{[^}]*\}\}|[#>*_`[\]()|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 110);
}
