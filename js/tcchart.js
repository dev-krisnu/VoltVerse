/* Shared time-current (log-log) chart for breakers and fuses */
(function () {
  var TT = ['1 ms', '10 ms', '100 ms', '1 s', '10 s', '100 s', '1000 s', '10⁴ s'];
  function ev(pts, x) { var lx = Math.log(x); for (var i = 1; i < pts.length; i++) { if (x <= pts[i][0] || i === pts.length - 1) { var a = pts[i - 1], b = pts[i], u = (lx - Math.log(a[0])) / (Math.log(b[0]) - Math.log(a[0])); u = Math.max(0, Math.min(1, u)); return Math.exp(Math.log(a[1]) + u * (Math.log(b[1]) - Math.log(a[1]))); } } return pts[0][1]; }
  /* time-current chart: cfg = { hi, lo?, x:[min,max], ol, sc, name } */
  function tc(cfg) {
    var X = cfg.x || [1, 100], Y = cfg.y || [.001, 1e4], lx0 = Math.log10(X[0]), lx1 = Math.log10(X[1]), ly0 = Math.log10(Y[0]), ly1 = Math.log10(Y[1]);
    return { title: 'Time-current curve', h: 210, note: cfg.note, draw: function (x, w, h, t, tT, mode) {
      var CH = window.CATCHART, nx = Math.round(lx1 - lx0), ny = Math.round(ly1 - ly0);
      var g = CH.grid(x, w, h, { l: 50, b: 28, ny: ny, nx: nx, yl: function (f) { var d = Math.round(f * ny + ly0 - (-3)); return TT[Math.max(0, Math.min(7, d))] || ''; }, xl: function (f) { return Math.round(Math.pow(10, lx0 + f * (lx1 - lx0))) * 1 + '×'; }, xt: cfg.xt || 'current ÷ rated' });
      function px(v) { return g.l + (Math.log10(v) - lx0) / (lx1 - lx0) * g.w; } function py(v) { return g.b - (Math.log10(Math.max(Y[0], Math.min(Y[1], v))) - ly0) / (ly1 - ly0) * g.h; }
      function pts(a) { return a.filter(function (p) { return p[0] >= X[0] && p[0] <= X[1]; }).map(function (p) { return [px(p[0]), py(p[1])]; }); }
      if (cfg.lo) { x.save(); x.fillStyle = 'rgba(34,211,238,.13)'; x.beginPath(); var hp = pts(cfg.hi), lp = pts(cfg.lo); hp.forEach(function (p, i) { i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); }); lp.slice().reverse().forEach(function (p) { x.lineTo(p[0], p[1]); }); x.closePath(); x.fill(); x.restore(); CH.line(x, lp, '#22d3ee', 1.4, [5, 4]); }
      if (cfg.nt) { x.save(); x.fillStyle = 'rgba(34,197,94,.10)'; x.fillRect(g.l, g.t, px(cfg.nt) - g.l, g.h); x.fillStyle = '#86efac'; x.font = '10px Inter,Arial'; x.textAlign = 'left'; x.fillText('no trip', g.l + 5, g.t + 12); x.restore(); }
      CH.line(x, pts(cfg.hi), '#67e8f9', 2.2);
      var I = mode === 'ol' ? cfg.ol : mode === 'sc' ? cfg.sc : mode === 'earth' ? cfg.earth : mode === 'press' ? cfg.press : null;
      if (I) { var xi = X[0] * Math.pow(I / X[0], Math.min(1, t * 1.0)), yi = ev(cfg.hi, xi), cc = (mode === 'sc') ? '#ef4444' : '#f59e0b'; x.save(); x.setLineDash([3, 4]); x.strokeStyle = 'rgba(250,204,21,.5)'; x.beginPath(); x.moveTo(px(xi), g.b); x.lineTo(px(xi), py(yi)); x.moveTo(g.l, py(yi)); x.lineTo(px(xi), py(yi)); x.stroke(); x.restore(); CH.dot(x, px(xi), py(yi), cc); x.fillStyle = '#e2e8f0'; x.font = '600 11px Inter,Arial'; x.textAlign = px(xi) > w * .6 ? 'right' : 'left'; x.textBaseline = 'bottom'; var tx = yi < 1 ? Math.round(yi * 1000) + ' ms' : yi < 120 ? Math.round(yi) + ' s' : Math.round(yi / 60) + ' min'; x.fillText(xi.toFixed(1) + '× → trips in ≈ ' + tx, px(xi) + (px(xi) > w * .6 ? -8 : 8), py(yi) - 8); }
      else if (cfg.none) { x.fillStyle = '#fbbf24'; x.font = '600 11.5px Inter,Arial'; x.textAlign = 'center'; x.fillText(cfg.none, g.l + g.w / 2, g.t + g.h / 2); } } };
  }
  window.TCCHART = { tc: tc, ev: ev };
})();
