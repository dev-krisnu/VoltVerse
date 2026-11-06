/* Electrical Switches menu: category sections, search and filter, built from js/switches-data.js */
(function () {
  'use strict';
  var LIST = window.VV_SWITCHES || [], CATS = window.VV_SWITCH_CATS || [], SOON = window.VV_SWITCHES_SOON || [];
  var $ = function (id) { return document.getElementById(id); };
  var state = { q: '', cat: 'all' };

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function card(sw) {
    return '<a href="' + sw.file + '" class="group relative flex flex-col rounded-2xl p-4 bg-slate-900/70 border border-slate-800 hover:border-cyan-400/60 hover:-translate-y-0.5 transition">' +
      '<div class="flex items-start gap-3">' +
        '<div class="w-20 h-16 shrink-0 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2 overflow-hidden">' + sw.sym + '</div>' +
        '<div class="min-w-0 flex-1">' +
          '<div class="flex items-center gap-2"><span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-400/10 text-cyan-300">#' + sw.n + '</span><span class="text-[10px] text-slate-500 truncate">' + esc(sw.tag) + '</span></div>' +
          '<h3 class="mt-1 font-bold text-white leading-tight">' + esc(sw.name) + '</h3>' +
        '</div>' +
        '<i class="fa-solid fa-arrow-right text-slate-600 group-hover:text-cyan-300 transition text-xs mt-1"></i>' +
      '</div>' +
      '<p class="mt-3 text-xs text-slate-400 leading-relaxed">' + esc(sw.sub) + '</p>' +
      '<div class="mt-3 flex flex-wrap gap-1.5">' + sw.chips.map(function (c) { return '<span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">' + esc(c) + '</span>'; }).join('') + '</div>' +
    '</a>';
  }

  function render() {
    var q = state.q.trim().toLowerCase(), html = '', shown = 0;
    CATS.forEach(function (c) {
      if (state.cat !== 'all' && state.cat !== c.id) return;
      var items = LIST.filter(function (s) { return s.cat === c.id && (!q || (s.name + ' ' + s.tag + ' ' + s.sub + ' ' + s.chips.join(' ')).toLowerCase().indexOf(q) >= 0); });
      if (!items.length) return;
      shown += items.length;
      html += '<section class="mt-8" aria-labelledby="c-' + c.id + '"><div class="flex items-end justify-between gap-3"><div><h2 id="c-' + c.id + '" class="text-lg font-bold text-white">' + esc(c.title) + '</h2><p class="text-xs text-slate-400 mt-0.5">' + esc(c.blurb) + '</p></div><span class="text-[11px] font-mono text-slate-500">' + items.length + '</span></div>' +
        '<div class="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">' + items.map(card).join('') + '</div></section>';
    });
    if (!shown) html = '<p class="mt-10 text-center text-sm text-slate-400">No switch matches your search.</p>';
    $('hub-root').innerHTML = html;
    $('hub-count').textContent = shown + ' of ' + LIST.length + ' switches';
    var soon = $('soon-box');
    soon.classList.toggle('hidden', !!q || state.cat !== 'all');
  }

  function chips() {
    var box = $('cat-chips'), all = [{ id: 'all', title: 'All' }].concat(CATS);
    box.innerHTML = '';
    all.forEach(function (c) {
      var b = document.createElement('button'); b.type = 'button'; b.dataset.cat = c.id; b.textContent = c.title;
      b.className = 'chip px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition ' + (c.id === state.cat ? 'bg-cyan-400 text-slate-950 border-cyan-400' : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-cyan-400/60');
      b.addEventListener('click', function () { state.cat = c.id; chips(); render(); });
      box.appendChild(b);
    });
  }

  window.addEventListener('DOMContentLoaded', function () {
    $('soon-root').innerHTML = SOON.map(function (s) {
      return '<div class="rounded-2xl p-4 border border-dashed border-slate-700 bg-slate-900/40"><div class="flex items-center gap-2"><span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Coming soon</span><span class="text-[10px] text-slate-500">' + esc(s.tag) + '</span></div><h3 class="mt-1 font-bold text-slate-300">' + esc(s.name) + '</h3><p class="mt-2 text-xs text-slate-500 leading-relaxed">' + esc(s.sub) + '</p></div>';
    }).join('');
    $('hub-search').addEventListener('input', function (e) { state.q = e.target.value; render(); });
    chips(); render();
  });
})();
