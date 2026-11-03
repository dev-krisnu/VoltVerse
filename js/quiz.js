/* Diploma EE quiz: 10-question rounds from a 50-question bank. No repeats inside a round, and none across rounds until the whole bank has been seen. */
(function () {
  'use strict';
  var BANK = window.QUIZ_BANK || [], ROUND = 10, KEY = 'voltverse_quiz_seen_v1';
  var $ = function (id) { return document.getElementById(id); };
  var round = [], idx = 0, score = 0, answered = false, missed = [], seen = loadSeen();

  function loadSeen() {
    try { var v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.filter(function (id) { return BANK.some(function (q) { return q.id === id; }); }) : []; }
    catch (e) { return []; }
  }
  function saveSeen() { try { localStorage.setItem(KEY, JSON.stringify(seen)); } catch (e) { /* private mode: fine */ } }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function pickRound() {
    var unseen = BANK.filter(function (q) { return seen.indexOf(q.id) < 0; });
    if (unseen.length >= ROUND) return shuffle(unseen).slice(0, ROUND);
    // not enough fresh questions: use what is left, then start a new cycle with the rest
    var fillFrom = shuffle(BANK.filter(function (q) { return seen.indexOf(q.id) >= 0; })).slice(0, ROUND - unseen.length);
    seen = fillFrom.map(function (q) { return q.id; }); saveSeen();
    return shuffle(unseen.concat(fillFrom));
  }

  function updateBankInfo() {
    var n = seen.length;
    $('bank-progress').textContent = n === 0 ? 'Every round gives you 10 new questions from the bank of ' + BANK.length + '.' : 'You have answered ' + n + ' of ' + BANK.length + ' questions in this cycle. Questions only repeat after you have seen them all.';
    $('btn-reset-bank').classList.toggle('hidden', n === 0);
  }

  function start() {
    round = pickRound(); idx = 0; score = 0; missed = [];
    $('intro-stage').classList.add('hidden'); $('result-stage').classList.add('hidden'); $('quiz-stage').classList.remove('hidden'); $('header-bot-container').classList.remove('hidden');
    updateScore(); render(); window.scrollTo(0, 0);
  }

  function updateScore() { $('live-score-text').textContent = score + ' / ' + ROUND; }

  function render() {
    var q = round[idx]; answered = false;
    var order = shuffle([0, 1, 2, 3]); q._order = order; // shuffled option order for this showing
    var next = $('btn-next-question'); next.disabled = true;
    next.className = 'glass-btn px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-800 border border-slate-700 opacity-50 cursor-not-allowed flex items-center gap-2';
    next.innerHTML = '<span>' + (idx === ROUND - 1 ? 'Finish Quiz' : 'Next Question') + '</span><i class="fa-solid fa-arrow-right"></i>';
    $('bot-hint-text').textContent = 'Pick an answer to continue!'; $('explanation-box').classList.add('hidden');
    $('topic-badge').textContent = q.topic; $('question-progress-num').textContent = 'Q ' + (idx + 1) + ' of ' + ROUND;
    $('progress-bar-fill').style.width = ((idx + 1) / ROUND * 100) + '%';
    $('question-text').textContent = (idx + 1) + '. ' + q.q;
    var box = $('options-container'); box.innerHTML = '';
    order.forEach(function (orig, pos) {
      var b = document.createElement('button'); b.type = 'button';
      b.className = 'option-btn glass-btn p-3.5 rounded-2xl text-xs sm:text-sm font-medium text-left text-slate-200 border border-slate-700/80 hover:border-sky-500 flex items-center gap-3 touch-target';
      b.innerHTML = '<span class="w-7 h-7 rounded-xl bg-slate-800 text-sky-400 font-bold code-font text-xs flex items-center justify-center border border-slate-700 shrink-0">' + 'ABCD'[pos] + '</span><span class="flex-1"></span><span class="opt-icon w-4 h-4 rounded-full border-2 border-slate-500 shrink-0"></span>';
      b.children[1].textContent = q.options[orig];
      b.addEventListener('click', function () { choose(pos); });
      box.appendChild(b);
    });
  }

  function choose(pos) {
    if (answered) return; answered = true;
    var q = round[idx], ok = q._order[pos] === q.correct, right = q._order.indexOf(q.correct);
    if (ok) { score++; updateScore(); } else missed.push(q);
    if (seen.indexOf(q.id) < 0) { seen.push(q.id); saveSeen(); }
    document.querySelectorAll('.option-btn').forEach(function (b, i) {
      b.disabled = true; var ic = b.querySelector('.opt-icon');
      if (i === right) { b.className = 'option-btn p-3.5 rounded-2xl text-xs sm:text-sm font-semibold text-left text-white bg-emerald-950/80 border-2 border-emerald-500 shadow-lg flex items-center gap-3 touch-target'; ic.className = 'opt-icon fa-solid fa-circle-check text-emerald-400 text-base shrink-0'; }
      else if (i === pos) { b.className = 'option-btn p-3.5 rounded-2xl text-xs sm:text-sm font-medium text-left text-rose-200 bg-rose-950/80 border-2 border-rose-500 flex items-center gap-3 touch-target'; ic.className = 'opt-icon fa-solid fa-circle-xmark text-rose-400 text-base shrink-0'; }
      else b.className = 'option-btn p-3.5 rounded-2xl text-xs sm:text-sm font-medium text-left text-slate-500 bg-slate-900/40 border border-slate-800 opacity-50 flex items-center gap-3 touch-target';
    });
    $('explanation-text').textContent = q.exp; $('explanation-box').classList.remove('hidden');
    var next = $('btn-next-question'); next.disabled = false;
    next.className = 'glass-btn px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 border border-sky-400/50 shadow-lg shadow-sky-500/20 flex items-center gap-2';
    $('bot-hint-text').textContent = ok ? 'Correct! Well done!' : 'Not quite. Read the explanation below.';
  }

  function nextQ() { if (idx < ROUND - 1) { idx++; render(); } else results(); }

  var SVG = {
    base: function (col, stroke, ant, face, body, ball) {
      return '<line x1="100" y1="50" x2="100" y2="20" stroke="' + col + '" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="16" r="8" fill="' + col + '"' + (ball || '') + '/>' +
        '<rect x="50" y="50" width="100" height="85" rx="20" fill="#0284c7" stroke="' + stroke + '" stroke-width="5"/><rect x="62" y="62" width="76" height="52" rx="12" fill="#0f172a"/>' + face +
        '<path d="M 65 135 Q 100 148 135 135 L 145 170 Q 100 185 55 170 Z" fill="#0369a1" stroke="' + stroke + '" stroke-width="4"/>';
    },
    sad: '<circle cx="82" cy="88" r="8" fill="#f8fafc"/><circle cx="118" cy="88" r="8" fill="#f8fafc"/><circle cx="82" cy="86" r="4" fill="#0f172a"/><circle cx="118" cy="86" r="4" fill="#0f172a"/><path d="M 82 110 Q 100 95 118 110" fill="none" stroke="#f8fafc" stroke-width="4.5" stroke-linecap="round"/><path d="M 70 95 Q 67 105 70 110 Q 73 105 70 95" fill="#38bdf8"/>',
    happy: '<path d="M 74 85 Q 82 76 90 85" fill="none" stroke="#f8fafc" stroke-width="4" stroke-linecap="round"/><path d="M 110 85 Q 118 76 126 85" fill="none" stroke="#f8fafc" stroke-width="4" stroke-linecap="round"/><circle cx="70" cy="95" r="5" fill="#f43f5e" opacity="0.6"/><circle cx="130" cy="95" r="5" fill="#f43f5e" opacity="0.6"/><path d="M 82 100 Q 100 115 118 100" fill="none" stroke="#f8fafc" stroke-width="4.5" stroke-linecap="round"/>',
    star: '<path d="M 82 76 L 85 83 L 92 84 L 87 89 L 88 96 L 82 92 L 76 96 L 77 89 L 72 84 L 79 83 Z" fill="#f59e0b"/><path d="M 118 76 L 121 83 L 128 84 L 123 89 L 124 96 L 118 92 L 112 96 L 113 89 L 108 84 L 115 83 Z" fill="#f59e0b"/><path d="M 80 98 Q 100 120 120 98 Z" fill="#f43f5e"/>'
  };

  function results() {
    $('quiz-stage').classList.add('hidden'); $('result-stage').classList.remove('hidden');
    var pct = Math.round(score / ROUND * 100);
    $('res-score-num').textContent = score + ' / ' + ROUND; $('res-score-pct').textContent = pct + '%';
    var grade = $('res-score-grade'), title = $('result-eval-title'), speech = $('result-eval-speech'), box = $('result-speech-box'), wrap = $('result-bot-wrapper'), svg = $('mascot-svg-result');
    wrap.className = 'relative w-32 h-32 mx-auto';
    if (pct < 50) {
      grade.textContent = 'Needs Review'; grade.className = 'code-font text-xs font-bold text-rose-400 mt-1 block';
      title.textContent = 'Keep going, future engineer!'; title.className = 'text-base font-bold text-rose-400 mb-1';
      speech.textContent = 'Do not worry. Read the explanations below, revise those topics and try the next round.';
      box.className = 'relative bg-slate-900/90 border border-rose-500/40 p-4 rounded-2xl max-w-md mx-auto shadow-lg';
      svg.innerHTML = SVG.base('#f43f5e', '#38bdf8', 0, SVG.sad);
    } else if (pct < 80) {
      grade.textContent = 'Good Job!'; grade.className = 'code-font text-xs font-bold text-sky-400 mt-1 block';
      title.textContent = 'Great job! Solid foundation!'; title.className = 'text-base font-bold text-sky-400 mb-1';
      speech.textContent = 'You know your basics well. Check the missed questions below and the next round could be perfect.';
      box.className = 'relative bg-slate-900/90 border border-sky-500/40 p-4 rounded-2xl max-w-md mx-auto shadow-lg';
      svg.innerHTML = SVG.base('#38bdf8', '#38bdf8', 0, SVG.happy, 0, ' class="animate-pulse"');
    } else {
      grade.textContent = 'Electrical Master!'; grade.className = 'code-font text-xs font-bold text-amber-400 mt-1 block';
      title.textContent = 'Outstanding score!'; title.className = 'text-base font-bold text-amber-400 mb-1';
      speech.textContent = 'Excellent work! You are ready for the exam. Try another round to cover the rest of the bank.';
      box.className = 'relative bg-slate-900/90 border border-amber-500/50 p-4 rounded-2xl max-w-md mx-auto shadow-lg shadow-amber-500/10';
      wrap.className = 'relative w-32 h-32 mx-auto animate-bot-run';
      svg.innerHTML = SVG.base('#f59e0b', '#f59e0b', 0, SVG.star);
      if (typeof confetti === 'function') { try { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch (e) { /* ignore */ } }
    }
    var rv = $('review-box'); rv.innerHTML = '';
    if (missed.length) {
      var h = document.createElement('h3'); h.className = 'text-xs font-bold uppercase tracking-wider text-slate-400 text-left'; h.textContent = 'Questions to review (' + missed.length + ')'; rv.appendChild(h);
      missed.forEach(function (q) {
        var d = document.createElement('div'); d.className = 'bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-left space-y-1';
        var a = document.createElement('p'); a.className = 'text-xs font-semibold text-slate-200'; a.textContent = q.q;
        var b = document.createElement('p'); b.className = 'text-xs text-emerald-400'; b.textContent = 'Answer: ' + q.options[q.correct];
        var c = document.createElement('p'); c.className = 'text-[11px] text-slate-400'; c.textContent = q.exp;
        d.appendChild(a); d.appendChild(b); d.appendChild(c); rv.appendChild(d);
      });
      rv.classList.remove('hidden');
    } else { rv.classList.add('hidden'); }
    var left = BANK.length - seen.length;
    $('btn-restart-game').lastChild.textContent = left >= ROUND ? ' Next Round (10 New Questions)' : ' Next Round (New Cycle)';
    updateBankInfo(); window.scrollTo(0, 0);
  }

  window.addEventListener('DOMContentLoaded', function () {
    if (!BANK.length) { $('bank-progress').textContent = 'The question bank could not be loaded.'; $('btn-start-game').disabled = true; return; }
    $('btn-start-game').addEventListener('click', start);
    $('btn-next-question').addEventListener('click', nextQ);
    $('btn-restart-game').addEventListener('click', start);
    $('btn-reset-bank').addEventListener('click', function () { seen = []; saveSeen(); updateBankInfo(); });
    updateBankInfo();
  });
})();
