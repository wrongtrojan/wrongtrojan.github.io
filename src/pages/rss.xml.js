import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { entryPath, isIndex, plainSummary } from '../utils/content';

export async function GET(context) {
  const entries = [...await getCollection('note'), ...await getCollection('create')]
    .filter((entry) => !entry.data.draft && !isIndex(entry) && entry.data.date)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: '木马',
    description: '个人博客',
    site: context.site,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: plainSummary(entry.body, entry.data.description),
      pubDate: entry.data.date,
      link: entryPath(entry),
    })),
  });
}
