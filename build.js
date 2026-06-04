const fs   = require('fs');
const path = require('path');

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: '' };
  const data = {};
  match[1].split('\n').forEach(line => {
    const colon = line.indexOf(':');
    if (colon > 0) {
      const key = line.slice(0, colon).trim();
      const val = line.slice(colon + 1).trim().replace(/^['"]|['"]$/g, '');
      data[key] = val;
    }
  });
  return { data, body: match[2].trim() };
}

function readCollection(folder) {
  if (!fs.existsSync(folder)) return [];
  return fs.readdirSync(folder)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse()
    .map(file => {
      const { data, body } = parseFrontmatter(
        fs.readFileSync(path.join(folder, file), 'utf8')
      );
      return { ...data, body, slug: file.replace('.md', '') };
    });
}

// ── cms-news.js ──────────────────────────────────────────────────
const news = readCollection('_news').map(e => ({
  date:     (e.date || '').split('T')[0],
  category: e.category || 'info',
  title:    e.title    || '',
  text:     e.body     || '',
}));
fs.writeFileSync('cms-news.js', `const CMS_NEWS = ${JSON.stringify(news, null, 2)};\n`);
console.log(`cms-news.js  → ${news.length} Einträge`);

// ── cms-blog.js ──────────────────────────────────────────────────
const blog = readCollection('_blog').map(e => {
  const excerpt = (e.body || '').split('\n\n')[0].replace(/[#*`]/g, '').trim();
  return {
    date:    (e.date || '').split('T')[0],
    title:   e.title  || '',
    excerpt: excerpt.length > 150 ? excerpt.slice(0, 147) + '…' : excerpt,
    slug:    e.slug,
  };
});
fs.writeFileSync('cms-blog.js', `const CMS_BLOG = ${JSON.stringify(blog, null, 2)};\n`);
console.log(`cms-blog.js  → ${blog.length} Einträge`);
