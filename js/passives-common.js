/* Shared helpers for the resistor / inductor / capacitor pages. */
window.PX = {
  act: { on: 'See inside', off: 'Close up', idleText: 'Outside view', onText: 'Opening…', offText: 'Closing…', doneText: 'See-through view' },
  fmt: function (v, u) { var a = Math.abs(v), p = [[1e12, 'T'], [1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p']]; if (!v) return '0 ' + u; for (var i = 0; i < p.length; i++) if (a >= p[i][0] * .9999) { var x = v / p[i][0]; return (Math.round(x * 1000) / 1000) + ' ' + p[i][1] + u; } return v + ' ' + u; },
  num: function (el) { var v = parseFloat(el.value); return isFinite(v) ? v : 0; },
  field: function (id, label, val, unit, step) { return '<label>' + label + '<span class="px-in"><input id="' + id + '" type="number" inputmode="decimal" value="' + val + '" step="' + (step || 'any') + '" min="0"><i>' + unit + '</i></span></label>'; },
  sel: function (id, label, opts, val) { return '<label>' + label + '<select id="' + id + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (String(o[0]) === String(val) ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></label>'; }
};
