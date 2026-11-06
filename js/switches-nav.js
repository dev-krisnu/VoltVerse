/* Slide-over directory for the switch lab pages. Real links to every switch page, search, Esc to close. */
(function () {
  'use strict';
  var LIST = window.VV_SWITCHES || [];
  window.SWMenu = {
    init: function (currentId) {
      var drawer = document.getElementById('drawer-menu'), backdrop = document.getElementById('menu-backdrop'),
          list = document.getElementById('drawer-switch-list'), search = document.getElementById('menu-search'),
          openBtn = document.getElementById('menu-btn');
      if (!drawer || !list) return;
      list.innerHTML = '';
      var all = document.createElement('a'); all.href = 'switches.html';
      all.className = 'w-full p-2.5 rounded-xl flex items-center justify-between border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-semibold';
      all.innerHTML = '<span><i class="fa-solid fa-layer-group mr-2"></i>All switches overview</span><i class="fa-solid fa-arrow-right text-[10px]"></i>';
      list.appendChild(all);
      LIST.forEach(function (sw) {
        var a = document.createElement('a'), here = sw.id === currentId; a.href = sw.file; a.dataset.q = (sw.name + ' ' + sw.n + ' ' + sw.tag).toLowerCase();
        if (here) a.setAttribute('aria-current', 'page');
        a.className = 'sw-item w-full text-left p-2.5 rounded-xl transition flex items-center justify-between border ' + (here ? 'bg-electric-500/10 border-electric-500/40 text-electric-400 font-semibold' : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200');
        var l = document.createElement('div'); l.className = 'flex items-center gap-2';
        var n = document.createElement('span'); n.className = 'text-[10px] font-mono px-1.5 py-0.5 rounded ' + (here ? 'bg-electric-500/20 text-electric-400' : 'bg-slate-800 text-slate-500'); n.textContent = '#' + sw.n;
        var t = document.createElement('span'); t.className = 'text-xs'; t.textContent = sw.name;
        l.appendChild(n); l.appendChild(t); a.appendChild(l);
        a.insertAdjacentHTML('beforeend', '<i class="fa-solid fa-chevron-right text-[10px] opacity-40"></i>');
        list.appendChild(a);
      });
      function open() { drawer.classList.remove('translate-x-full'); backdrop.classList.remove('opacity-0', 'pointer-events-none'); }
      function close() { drawer.classList.add('translate-x-full'); backdrop.classList.add('opacity-0', 'pointer-events-none'); }
      openBtn.addEventListener('click', open);
      document.getElementById('close-menu-btn').addEventListener('click', close);
      backdrop.addEventListener('click', close);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
      search.addEventListener('input', function () {
        var q = search.value.trim().toLowerCase();
        list.querySelectorAll('.sw-item').forEach(function (a) { a.style.display = !q || a.dataset.q.indexOf(q) >= 0 ? '' : 'none'; });
      });
    }
  };
})();
