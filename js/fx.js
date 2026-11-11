/* V-NODE interaction helpers: pointer spotlight, tap ripple, unified header tile. Safe on every page. */
(function () {
  'use strict';
  var D = document;
  function spot(e) { var t = e.target.closest && e.target.closest('.cat,.fx-spot'); if (!t) return; var r = t.getBoundingClientRect(); t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px'); }
  D.addEventListener('pointermove', spot, { passive: true });
  D.addEventListener('pointerdown', function (e) {
    var t = e.target.closest && e.target.closest('.fx-ripple,.tool-go,.cat-head,.tool-head,.pill-link,.cta,.vk-pill,.vk-cat button,.vk-sub button'); if (!t) return;
    var r = t.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2, d = D.createElement('span'); d.className = 'fx-rip';
    d.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px';
    if (getComputedStyle(t).position === 'static') t.style.position = 'relative'; t.style.overflow = t.style.overflow || 'hidden'; t.appendChild(d); setTimeout(function () { d.remove(); }, 650);
  }, { passive: true });
  function tile() {
    var h = D.querySelector('header'); if (!h || h.closest('.vk-head') || h.classList.contains('home-bar')) return;
    var ic = h.querySelector('i.fa-solid,[data-lucide],svg'); if (!ic) return; var t = ic.parentElement;
    if (!t || t === h || t.tagName === 'A' && t.children.length > 1 || t.tagName === 'BUTTON') return;
    if (t.children.length === 1 && t.getBoundingClientRect().width < 64) t.classList.add('vn-tile');
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', tile); else tile();
  addEventListener('load', tile);
})();
