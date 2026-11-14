/* FAQ page: search, category chips and an accessible accordion. */
(function () {
  'use strict';
  var D = window.FAQ || [], $ = function (id) { return document.getElementById(id); }, cat = 'All', term = '';
  var cats = ['All'].concat(D.reduce(function (a, x) { if (a.indexOf(x.c) < 0) a.push(x.c); return a; }, []));
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function hi(s) { var e = esc(s); if (!term) return e; var t = esc(term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); return e.replace(new RegExp('(' + t + ')', 'ig'), '<mark>$1</mark>'); }
  function chips() { $('faq-chips').innerHTML = cats.map(function (c) { var n = c === 'All' ? D.length : D.filter(function (x) { return x.c === c; }).length; return '<button type="button" data-c="' + esc(c) + '" aria-pressed="' + (c === cat) + '">' + esc(c) + ' <small>' + n + '</small></button>'; }).join(''); }
  function list() {
    var t = term.toLowerCase(), items = D.map(function (x, i) { x.i = i; return x; }).filter(function (x) { return (cat === 'All' || x.c === cat) && (!t || (x.q + ' ' + x.a).toLowerCase().indexOf(t) >= 0); });
    $('faq-list').innerHTML = items.map(function (x) { return '<details class="faq-item" id="q' + x.i + '"' + (t && items.length <= 3 ? ' open' : '') + '><summary><span class="faq-cat">' + esc(x.c) + '</span><span class="faq-q">' + hi(x.q) + '</span><i class="fa-solid fa-chevron-down" aria-hidden="true"></i></summary><div class="faq-a"><p>' + hi(x.a) + '</p></div></details>'; }).join('');
    $('faq-empty').hidden = items.length > 0; $('faq-count').textContent = items.length + (items.length === 1 ? ' question' : ' questions') + (cat === 'All' ? '' : ' in ' + cat);
  }
  $('faq-chips').addEventListener('click', function (e) { var b = e.target.closest('button[data-c]'); if (!b) return; cat = b.dataset.c; chips(); list(); });
  $('faq-q').addEventListener('input', function (e) { term = e.target.value.trim(); list(); });
  chips(); list();
  if (location.hash && /^#q\d+$/.test(location.hash)) { var el = $(location.hash.slice(1)); if (el) { el.open = true; el.scrollIntoView({ block: 'center' }); } }
})();
