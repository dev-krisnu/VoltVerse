(function () {
  var A = {
    cyan:  { bd: 'border-cyan-500/30 hover:border-cyan-300', tx: 'text-cyan-300', chip: 'bg-cyan-400/10 text-cyan-300', ic: 'bg-cyan-400/10 text-cyan-300' },
    amber: { bd: 'border-amber-500/30 hover:border-amber-300', tx: 'text-amber-300', chip: 'bg-amber-400/10 text-amber-300', ic: 'bg-amber-400/10 text-amber-300' }
  };
  var lib = window.VOLTVERSE_LIBRARY || [], html = '', tools = 0, fams = 0;
  lib.forEach(function (f) {
    if (f.soon) {
      html += '<section class="mt-12" aria-labelledby="h-' + f.id + '"><h3 id="h-' + f.id + '" class="text-lg font-bold text-gray-300">' + f.title + '</h3><p class="text-sm text-gray-500 mt-1">' + f.blurb + '</p><div class="mt-3 flex flex-wrap gap-2">' +
        f.items.map(function (i) { return '<span class="px-3 py-1.5 rounded-full border border-dashed border-gray-700 text-xs text-gray-400">' + i + '</span>'; }).join('') + '</div></section>';
      return;
    }
    fams++; tools += f.tools.length;
    var a = A[f.accent] || A.cyan;
    html += '<section class="mt-12" aria-labelledby="h-' + f.id + '"><div class="flex items-center gap-3"><span class="w-9 h-9 rounded-lg flex items-center justify-center ' + a.ic + '"><i class="fa-solid ' + f.icon + '"></i></span><div><h3 id="h-' + f.id + '" class="text-xl font-bold ' + a.tx + '">' + f.title + '</h3><p class="text-sm text-gray-400">' + f.blurb + '</p></div></div><div class="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">' +
      f.tools.map(function (t) {
        return '<a href="' + t.href + '" class="group block rounded-2xl p-5 bg-slate-900/70 border ' + a.bd + ' transition"><div class="flex items-center justify-between"><span class="px-2 py-0.5 rounded-md text-[11px] font-semibold ' + a.chip + '">' + t.tag + '</span><i class="fa-solid ' + t.icon + ' text-gray-500 group-hover:text-white transition"></i></div><h4 class="mt-3 font-bold text-white">' + t.title + '</h4><p class="mt-1.5 text-sm text-gray-400 leading-relaxed">' + t.desc + '</p></a>';
      }).join('') + '</div></section>';
  });
  var root = document.getElementById('library-root'); if (root) root.innerHTML = html;
  var st = document.getElementById('lib-stats'); if (st) st.textContent = tools + ' interactive tools across ' + fams + ' component families, and growing';
})();
