import { getCollection, type CollectionEntry } from 'astro:content';

export type Doc = CollectionEntry<'docs'>;

export interface SidebarItem {
  id: string;
  title: string;
  order: number;
}

export interface SidebarGroup {
  category: string;
  order: number;
  items: SidebarItem[];
}

function titleCase(value: string): string {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function categoryOf(doc: Doc): string {
  if (doc.data.category) return doc.data.category;
  const segments = doc.id.split('/');
  return segments.length > 1 ? titleCase(segments[0]) : 'General';
}

export async function getDocs(): Promise<Doc[]> {
  return await getCollection('docs');
}

export function getIndexDoc(docs: Doc[]): Doc | undefined {
  return docs.find(doc => doc.id === 'index' || doc.id === 'README');
}

// Build the grouped sidebar. Groups sort by categoryOrder (lowest wins), pages
// within a group sort by order, then title. The index/landing page is left out.
export function buildSidebar(docs: Doc[]): SidebarGroup[] {
  const groups = new Map<string, SidebarGroup>();

  for (const doc of docs) {
    if (doc.id === 'index' || doc.id === 'README') continue;

    const category = categoryOf(doc);
    let group = groups.get(category);
    if (!group) {
      group = { category, order: doc.data.categoryOrder ?? 100, items: [] };
      groups.set(category, group);
    }
    if (doc.data.categoryOrder != null) {
      group.order = Math.min(group.order, doc.data.categoryOrder);
    }
    group.items.push({ id: doc.id, title: doc.data.title, order: doc.data.order });
  }

  const result = [...groups.values()];
  result.sort((a, b) => a.order - b.order || a.category.localeCompare(b.category));
  for (const group of result) {
    group.items.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  }
  return result;
}
