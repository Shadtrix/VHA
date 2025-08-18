// server/utils/siteContext.js
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const PAGES = {
  about: { url: 'https://www.vha.sg/about-us', title: 'About VHA' },
  mep:   { url: 'https://www.vha.sg/mep-engineering', title: 'MEP Engineering' }
};

const CACHE_DIR = path.join(__dirname, 'cache');
fs.mkdirSync(CACHE_DIR, { recursive: true });

function cacheFileFor(key) {
  return path.join(CACHE_DIR, `${key}.json`);
}

function cleanText(html) {
  const $ = cheerio.load(html);
  $('script,style,noscript,svg,iframe,form,header,footer,nav').remove();
  const body = $('main').text() || $('body').text() || '';
  return body
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function fetchPageText(url) {
  const { data } = await axios.get(url, {
    timeout: 15000,
    headers: {
      'user-agent':
        'Mozilla/5.0 (compatible; VHA-RAG/1.0; +https://www.vha.sg)'
    }
  });
  return cleanText(data);
}

function loadCache(key) {
  try { return JSON.parse(fs.readFileSync(cacheFileFor(key), 'utf8')); }
  catch { return null; }
}

function saveCache(key, text) {
  fs.writeFileSync(
    cacheFileFor(key),
    JSON.stringify({ text, fetchedAt: new Date().toISOString() }, null, 2)
  );
}

async function getPageContext(pageKey = 'about', forceRefresh = false) {
  const key = (pageKey || 'about').toLowerCase();
  if (!PAGES[key]) throw new Error(`Unknown page key: ${key}`);
  const cached = !forceRefresh && loadCache(key);
  if (cached?.text) return { ...cached, key, ...PAGES[key] };

  const text = await fetchPageText(PAGES[key].url);
  saveCache(key, text);
  return { text, fetchedAt: new Date().toISOString(), key, ...PAGES[key] };
}

function chunk(text, size = 1500) {
  const out = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
  return out;
}
function score(query, snippet) {
  const q = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/).filter(Boolean);
  const hay = snippet.toLowerCase();
  let s = 0; for (const w of q) if (hay.includes(w)) s++;
  return s;
}
function pickRelevantSnippets(text, query, k = 3) {
  const chunks = chunk(text, 1500);
  const scored = chunks.map(s => ({ s, sc: score(query, s) }))
    .filter(o => o.sc > 0)
    .sort((a, b) => b.sc - a.sc);
  const chosen = (scored.length ? scored : chunks.slice(0, 2)).slice(0, k).map(o => o.s);
  return chosen.join('\n---\n');
}

function autoSelectPage(question) {
  const q = (question || '').toLowerCase();
  const mepHints = ['mep', 'mechanical', 'electrical', 'plumbing', 'hvac', 'lighting', 'power', 'bms'];
  if (mepHints.some(w => q.includes(w))) return 'mep';
  return 'about';
}

module.exports = {
  PAGES,
  getPageContext,
  pickRelevantSnippets,
  autoSelectPage
};
