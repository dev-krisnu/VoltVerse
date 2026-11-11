/* V-NODE global mobile helpers: DPR cap, scroll reveal, viewport units. Safe on every page. */
(function () {
  'use strict';
  var coarse = matchMedia('(pointer:coarse)').matches;
  /* cap pixel ratio for every three.js page on touch devices: big speed-up on 3x phones, still sharp */
  if (coarse) {
    var real = window.devicePixelRatio || 1;
    try { Object.defineProperty(window, 'devicePixelRatio', { get: function () { return Math.min(real, 1.6); } }); } catch (e) {}
  }
  var root = document.documentElement;
  function vh() { root.style.setProperty('--vh', innerHeight * .01 + 'px'); }
  vh(); addEventListener('resize', vh);

  /* stacked layout helper: mark the 3D stage section of grid pages and publish the header height */
  function stackFix() {
    var hd = document.querySelector('header'); if (hd) root.style.setProperty('--mh', hd.offsetHeight + 'px');
    var mn = document.querySelector('main'); if (!mn || document.body.classList.contains('m-stack')) return;
    var cv = mn.querySelector('canvas'); if (!cv || getComputedStyle(mn).display !== 'grid') return;
    var sec = cv; while (sec.parentElement && sec.parentElement !== mn) sec = sec.parentElement; if (sec === cv) return;
    document.body.classList.add('m-stack'); sec.classList.add('m-stage'); if (hd) root.style.setProperty('--mh', hd.offsetHeight + 'px');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', stackFix); else stackFix();
  addEventListener('resize', function () { var hd = document.querySelector('header'); if (hd) root.style.setProperty('--mh', hd.offsetHeight + 'px'); });

  /* scroll reveal for anything marked .vk-rv (staggered by sibling index) */
  function reveal() {
    var els = document.querySelectorAll('.vk-rv:not(.in)'); if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -6% 0px', threshold: .08 });
    els.forEach(function (e, i) { e.style.setProperty('--d', (i % 4) * 60 + 'ms'); io.observe(e); });
  }
  window.vkReveal = reveal;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', reveal); else reveal();
})();
