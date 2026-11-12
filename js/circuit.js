/* Wiring diagram renderer: parts with named pins, orthogonal wires, animated dashes that show conventional current direction. window.Circuit.svg(spec) -> html */
(function () {
  'use strict';
  var T = {
    uno: { w: 84, t: 'Arduino UNO', R: ['5V', '3V3', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'A0', 'A1', 'A4', 'A5', 'GND'], c: '#0e6f8f' },
    nano: { w: 84, t: 'Arduino Nano', R: ['5V', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'A0', 'A1', 'GND'], c: '#0b6a8c' },
    esp32: { w: 84, t: 'ESP32 DevKit', R: ['3V3', 'VIN', 'GPIO4', 'GPIO5', 'GPIO13', 'GPIO14', 'GPIO16', 'GPIO17', 'GPIO18', 'GPIO19', 'GPIO21', 'GPIO22', 'GPIO23', 'GPIO25', 'GPIO26', 'GPIO27', 'GPIO34', 'GND'], c: '#2a2f38' },
    led: { w: 56, t: 'LED', L: ['A'], R: ['K'], sym: 'led', h: 38 },
    res: { w: 56, t: 'Resistor', L: ['1'], R: ['2'], sym: 'res', h: 38 },
    btn: { w: 56, t: 'Push button', L: ['1'], R: ['2'], sym: 'btn', h: 38 },
    pot: { w: 64, t: 'Potentiometer', L: ['VCC', 'WIPER', 'GND'], sym: 'pot' },
    ldr: { w: 56, t: 'LDR', L: ['1'], R: ['2'], sym: 'ldr', h: 38 },
    buzzer: { w: 64, t: 'Buzzer', L: ['+', '-'] },
    lamp: { w: 64, t: 'Lamp / load', L: ['+', '-'] },
    fan: { w: 64, t: 'DC fan', L: ['+', '-'] },
    battery: { w: 64, t: 'Battery', L: ['+', '-'] },
    servo: { w: 70, t: 'Servo', L: ['GND', 'VCC', 'SIGNAL'] },
    hcsr04: { w: 70, t: 'HC-SR04', L: ['VCC', 'TRIG', 'ECHO', 'GND'] },
    dht11: { w: 70, t: 'DHT11', L: ['VCC', 'DATA', 'GND'] },
    pir: { w: 70, t: 'PIR HC-SR501', L: ['VCC', 'OUT', 'GND'] },
    soil: { w: 70, t: 'Soil sensor', L: ['VCC', 'GND', 'AO'] },
    mq2: { w: 70, t: 'MQ-2 gas', L: ['VCC', 'GND', 'AO', 'DO'] },
    lcd: { w: 70, t: 'LCD 1602 I2C', L: ['GND', 'VCC', 'SDA', 'SCL'] },
    oled: { w: 70, t: 'OLED I2C', L: ['GND', 'VCC', 'SDA', 'SCL'] },
    mpu: { w: 70, t: 'MPU6050', L: ['VCC', 'GND', 'SDA', 'SCL'] },
    hc05: { w: 70, t: 'HC-05', L: ['VCC', 'GND', 'TXD', 'RXD'] },
    relay: { w: 74, t: 'Relay module', L: ['VCC', 'GND', 'IN'], R: ['COM', 'NO'] },
    l298n: { w: 76, t: 'L298N driver', L: ['ENA', 'IN1', 'IN2', '12V', 'GND'], R: ['OUT1', 'OUT2'] },
    uln: { w: 76, t: 'ULN2003 driver', L: ['IN1', 'IN2', 'IN3', 'IN4', '5V', 'GND'], R: ['MOTOR'] },
    stepper: { w: 64, t: '28BYJ-48', L: ['COIL'], h: 34 },
    motor: { w: 64, t: 'DC motor', L: ['+', '-'] },
    psu: { w: 70, t: '5-12 V supply', R: ['+', '-'], h: 40 }
  };
  var SIG = ['#22d3ee', '#fbbf24', '#a3e635', '#c084fc', '#fb923c', '#f472b6'];
  var isPwr = function (n) { return /^(5V|3V3|VIN|VCC|\+|12V|\+5V)$/.test(n); }, isGnd = function (n) { return /^(GND|-)$/.test(n); };
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function build(spec) {
    var P = {}, out = [], svg = '', lane = 0, pinPos = {};
    spec.parts.forEach(function (p) {
      var t = T[p.k]; if (!t) throw new Error('part ' + p.k); var n = Math.max((t.L || []).length, (t.R || []).length, 1), isB = !!(t.R && !t.L), h = t.h || (isB ? 34 + n * 13 : 22 + n * 14), w = t.w, x = p.x, y = p.y;
      var o = { x: x, y: y, w: w, h: h, t: t, pins: {} };
      (t.L || []).forEach(function (nm, i) { o.pins[nm] = { x: x, y: y + (t.sym === 'pot' ? 22 + i * 14 : (t.L.length === 1 && !isB ? h / 2 : 26 + i * (isB ? 13 : 14))), s: -1, n: nm }; });
      (t.R || []).forEach(function (nm, i) { o.pins[nm] = { x: x + w, y: y + (isB ? 32 + i * 13 : (t.R.length === 1 ? (t.L ? 26 : h / 2) : 26 + i * 14)), s: 1, n: nm }; });
      if (t.L && t.R && t.L.length === 1 && t.R.length === 1 && t.sym) { o.pins[t.L[0]].y = y + h / 2 + 5; o.pins[t.R[0]].y = y + h / 2 + 5; }
      P[p.id] = o; o.label = p.label;
    });
    var W = spec.w || 320, H = spec.h || 260; Object.keys(P).forEach(function (id) { H = Math.max(H, P[id].y + P[id].h + 16); });
    svg += '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wiring diagram" class="cx-svg">';
    spec.parts.forEach(function (p) {
      var o = P[p.id], t = o.t, fill = t.c || '#131c2b', isB = !!(t.R && !t.L);
      svg += '<g><rect x="' + o.x + '" y="' + o.y + '" width="' + o.w + '" height="' + o.h + '" rx="7" fill="' + fill + '" stroke="' + (t.c ? '#67e8f9' : '#2f4160') + '" stroke-width="1.2"/>';
      svg += '<text x="' + (o.x + o.w / 2) + '" y="' + (o.y + 12) + '" text-anchor="middle" class="cx-t">' + esc(o.label || t.t) + '</text>';
      var cy = o.y + o.h / 2 + 5, cx = o.x + o.w / 2;
      if (t.sym === 'led') svg += '<path d="M' + (cx - 8) + ' ' + (cy - 6) + 'L' + (cx - 8) + ' ' + (cy + 8) + 'L' + (cx + 5) + ' ' + (cy + 1) + 'Z M' + (cx + 6) + ' ' + (cy - 6) + 'V' + (cy + 8) + '" fill="none" stroke="#fde68a" stroke-width="1.4"/>';
      if (t.sym === 'res') svg += '<path d="M' + (cx - 16) + ' ' + (cy + 4) + 'l4 -6 l4 12 l4 -12 l4 12 l4 -12 l4 6" fill="none" stroke="#fdba74" stroke-width="1.4" transform="translate(0,-2)"/>';
      if (t.sym === 'btn') svg += '<path d="M' + (cx - 12) + ' ' + (cy + 5) + 'H' + (cx - 5) + 'M' + (cx + 5) + ' ' + (cy + 5) + 'H' + (cx + 12) + 'M' + (cx - 6) + ' ' + (cy - 2) + 'H' + (cx + 6) + 'M' + cx + ' ' + (cy - 2) + 'V' + (cy - 8) + '" stroke="#a7f3d0" stroke-width="1.4" fill="none" transform="translate(0,2)"/>';
      if (t.sym === 'ldr') svg += '<circle cx="' + cx + '" cy="' + (cy + 4) + '" r="7" fill="none" stroke="#fde68a" stroke-width="1.3"/><path d="M' + (cx - 12) + ' ' + (cy - 8) + 'l5 5M' + (cx - 6) + ' ' + (cy - 10) + 'l5 5" stroke="#fde68a" stroke-width="1.2"/>';
      Object.keys(o.pins).forEach(function (k) { var q = o.pins[k]; var tx = q.s < 0 ? q.x + 5 : q.x - 5; svg += '<circle cx="' + q.x + '" cy="' + q.y + '" r="2.6" fill="#e2e8f0"/><text x="' + tx + '" y="' + (q.y + 2.6) + '" text-anchor="' + (q.s < 0 ? 'start' : 'end') + '" class="cx-p">' + esc(k) + '</text>'; });
      svg += '</g>';
    });
    function pin(r) { var a = r.split('.'), p = P[a[0]]; if (!p || !p.pins[a[1]]) throw new Error('pin ' + r); return p.pins[a[1]]; }
    var paths = '', k = 0, items = spec.wires.map(function (w) { return { w: w, a: pin(w[0]), b: pin(w[1]) }; });
    var fwd = items.filter(function (it) { return it.a.s > 0 && it.b.s < 0 && it.a.x + 20 <= it.b.x; }), downs = fwd.filter(function (it) { return it.b.y >= it.a.y; }).sort(function (p, q) { return p.a.y - q.a.y; }), ups = fwd.filter(function (it) { return it.b.y < it.a.y; }).sort(function (p, q) { return p.a.y - q.a.y; });
    var nl = fwd.length; downs.forEach(function (it, i) { it.lane = downs.length - 1 - i; }); ups.forEach(function (it, i) { it.lane = downs.length + i; });
    var other = 0;
    items.forEach(function (it) {
      var w = it.w, a = it.a, b = it.b, col = w[2] || (isPwr(a.n) || isPwr(b.n) ? '#f87171' : isGnd(a.n) || isGnd(b.n) ? '#94a3b8' : SIG[k++ % SIG.length]);
      var da = a.s, db = b.s, e1 = a.x + da * 10, e2 = b.x + db * 10, xm;
      if (it.lane != null) { var gap = Math.max(2.2, Math.min(5.5, (b.x - a.x - 24) / Math.max(1, nl))); xm = a.x + 12 + it.lane * gap; }
      else { other++; if (da > 0 && db > 0) xm = Math.max(e1, e2) + 6 + other * 3.2; else if (da < 0 && db < 0) xm = Math.min(e1, e2) - 6 - other * 3.2; else xm = (e1 + e2) / 2 + ((other % 5) - 2) * 4; }
      var d = 'M' + a.x + ' ' + a.y + 'H' + xm + 'V' + b.y + 'H' + b.x;
      paths += '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="1.7" stroke-linejoin="round" opacity=".35"/><path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="1.9" stroke-linejoin="round" class="cx-flow"/>';
    });
    svg = svg.replace(/(<svg[^>]*>)/, '$1' + paths);
    /* draw wires under parts: move paths before parts by inserting at start (done above) */
    svg += (spec.notes || []).map(function (n) { return '<text x="' + n[0] + '" y="' + n[1] + '" class="cx-n">' + esc(n[2]) + '</text>'; }).join('') + '</svg>';
    return svg;
  }
  window.Circuit = { svg: build, templates: T };
})();
