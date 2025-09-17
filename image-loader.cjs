function imageLoader({ src, width, quality }) {
  if (!src) return src;
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  const params = new URLSearchParams();
  if (typeof width === 'number') {
    params.set('w', String(width));
  }
  params.set('q', String(quality ?? 80));
  const query = params.toString();
  return query ? `${src}?${query}` : src;
}

module.exports = imageLoader;
module.exports.default = imageLoader;
