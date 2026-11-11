/* Home library: seven categories. Tap a category to see its tools, tap a tool to read about it, tap Open to go inside. */
(function () {
  var lib = window.VOLTVERSE_LIBRARY || [], root = document.getElementById('library-root'); if (!root) return;
  var html = '<div class="lib-grid">', tools = 0, n = 0;
  function e(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  lib.forEach(function (f) {
    if (f.soon) return; n++; tools += f.tools.length;
    html += '<article class="cat vk-rv" id="cat-' + n + '" style="--c:' + f.color + '" data-id="' + f.id + '">' +
      '<button class="cat-head" type="button" aria-expanded="false" aria-controls="cb-' + n + '" id="ch-' + n + '"><span class="cat-no">' + (n < 10 ? '0' : '') + n + '</span><span class="cat-ic"><i class="fa-solid ' + f.icon + '"></i></span>' +
      '<span class="cat-tx"><b>' + e(f.title) + '</b><small>' + e(f.key) + '</small></span><span class="cat-ct">' + f.tools.length + '</span><i class="fa-solid fa-chevron-down cat-chev"></i></button>' +
      '<div class="cat-body" id="cb-' + n + '" role="region" aria-labelledby="ch-' + n + '"><div class="cat-in"><p class="cat-bl">' + e(f.blurb) + '</p><div class="cat-list">' +
      f.tools.map(function (t, i) {
        return '<div class="tool" style="--i:' + i + '"><button class="tool-head" type="button" aria-expanded="false"><span class="tool-ic"><i class="fa-solid ' + t.icon + '"></i></span><span class="tool-t">' + e(t.title) + '</span><span class="tool-tag">' + e(t.tag) + '</span><i class="fa-solid fa-chevron-down"></i></button>' +
          '<div class="tool-body"><div class="tool-in"><p>' + e(t.desc) + '</p><a class="tool-go" href="' + t.href + '">Open <i class="fa-solid fa-arrow-right"></i></a></div></div></div>';
      }).join('') + '</div></div></div></article>';
  });
  html += '</div>';
  var soon = lib.filter(function (f) { return f.soon; })[0];
  if (soon) html += '<div style="margin-top:26px"><h3 style="font-size:15px;font-weight:700;color:#9fb0c5">' + e(soon.title) + '</h3><p style="font-size:13px;color:#6b7e96;margin-top:2px">' + e(soon.blurb) + '</p><div class="soon-row">' + soon.items.map(function (i) { return '<span class="px-3 py-1.5 rounded-full border border-dashed border-gray-700 text-xs text-gray-400">' + e(i) + '</span>'; }).join('') + '</div></div>';
  root.innerHTML = html;
  var st = document.getElementById('lib-stats'); if (st) st.textContent = tools + ' interactive tools in ' + n + ' categories, and growing';

  function openCat(c, scroll) {
    root.querySelectorAll('.cat.open').forEach(function (o) { if (o !== c) setCat(o, false); });
    setCat(c, !c.classList.contains('open'));
    if (scroll && c.classList.contains('open')) setTimeout(function () { var y = c.getBoundingClientRect().top + scrollY - 76; scrollTo({ top: y, behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' }); }, 120);
  }
  function setCat(c, on) { c.classList.toggle('open', on); c.querySelector('.cat-head').setAttribute('aria-expanded', on); if (!on) c.querySelectorAll('.tool.open').forEach(function (t) { setTool(t, false); }); }
  function setTool(t, on) { t.classList.toggle('open', on); t.querySelector('.tool-head').setAttribute('aria-expanded', on); }
  root.addEventListener('click', function (ev) {
    var th = ev.target.closest('.tool-head'), ch = ev.target.closest('.cat-head');
    if (th) { var t = th.parentNode, on = !t.classList.contains('open'); t.parentNode.querySelectorAll('.tool.open').forEach(function (o) { setTool(o, false); }); setTool(t, on); }
    else if (ch) openCat(ch.parentNode, true);
  });
  window.vnodeOpenCategory = function (i) { var c = document.getElementById('cat-' + i); if (c) openCat(c, true); };
  var m = /^#cat-(\d+)/.exec(location.hash); if (m) setTimeout(function () { window.vnodeOpenCategory(+m[1]); }, 600);
  if (window.vkReveal) window.vkReveal();
})();
