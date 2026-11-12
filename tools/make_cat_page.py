#!/usr/bin/env python3
"""Generate a V-NODE catalogue page: make_cat_page.py <file.html> "<Title>" "<description>" "<subtitle>" "<act label or ''>" "<data js>" "<models js>" "<nav spec>"
nav spec: comma list of href|icon|label ; current page is detected from file name."""
import sys
f,title,desc,sub,act,data,models,nav=sys.argv[1:9]
items=[]
for n in nav.split(','):
    h,i,l=n.split('|')
    cur=' aria-current="page"' if h==f else ''
    if i=='mark': ic='<svg class="vn-mark" aria-hidden="true"><use href="#vn-mark"/></svg>'
    else: ic=f'<i class="fa-solid {i}"></i>'
    items.append(f'<a href="{h}" class="nav-tab"{cur}>{ic}<span>{l}</span></a>')
actbtn=f'<button class="vk-pill" id="b-act" type="button" style="height:42px;padding:0 20px;font-size:13.5px;background:rgba(8,145,178,.55);border-color:#22d3ee"><i class="fa-solid fa-play"></i><span>{act}</span></button>' if act else '<button id="b-act" hidden></button>'
status='<span class="vk-pill" id="status" role="status"><span class="sd" style="width:8px;height:8px;border-radius:50%;background:#22c55e"></span><span id="st-t">Ready</span></span>'
datatags=''.join('<script src="js/%s"></script>'%d for d in data.split(','))
html=f'''<!DOCTYPE html>
<html lang="en" class="dark">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="stylesheet" href="css/vnode.css"><script src="js/vnode.js"></script>
<title>{title} | V-NODE</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#080c14"><link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preload" href="vendor/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/tailwind.css"><link rel="stylesheet" href="css/app.css"><link rel="stylesheet" href="css/fa/fa.css"><link rel="stylesheet" href="css/mobile.css"><link rel="stylesheet" href="css/vk.css">
<script src="vendor/three.min.js"></script><script src="vendor/OrbitControls.js"></script><script src="js/mobile.js"></script>
<link rel="stylesheet" href="css/fx.css"><script src="js/sky.js" defer></script><script src="js/fx.js" defer></script>
</head>
<body class="vk">
<header class="vk-head">
  <a class="back" href="index.html#library" aria-label="Back to library"><i class="fa-solid fa-arrow-left"></i></a>
  <div class="ttl"><h1>{title}</h1><p id="sub">{sub}</p></div>
  <button class="vk-ibtn" id="b-labels" type="button" aria-pressed="false" aria-label="Show part names"><i class="fa-solid fa-tags"></i></button>
</header>
<div class="vk-wrap">
  <section class="vk-stage" id="stage" aria-label="3D viewer">
    <div class="cv" id="cv" role="img" aria-label="Interactive 3D model"></div>
    <div class="vk-ov tl">{status}
      <span style="display:flex;gap:6px"><button class="vk-pill" data-v="iso" aria-pressed="true" type="button" style="height:32px;padding:0 11px">3D</button><button class="vk-pill" data-v="top" aria-pressed="false" type="button" style="height:32px;padding:0 11px">Top</button><button class="vk-pill" data-v="front" aria-pressed="false" type="button" style="height:32px;padding:0 11px">Front</button></span></div>
    <div class="vk-ov tr"><button class="vk-ibtn" id="b-reset" type="button" aria-label="Reset view"><i class="fa-solid fa-rotate-left"></i></button><button class="vk-ibtn" id="b-spin" type="button" aria-label="Auto rotate" aria-pressed="false"><i class="fa-solid fa-arrows-spin"></i></button></div>
    <div class="vk-ov" style="left:10px;right:10px;bottom:10px;justify-content:center;gap:8px">{actbtn}</div>
    <div class="vk-load" aria-hidden="true"><div class="bolt"><svg viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg></div><div class="bar"><i></i></div><small>Building model…</small></div>
  </section>
  <main class="vk-body">
    <div class="vk-cat" id="cats" role="tablist" aria-label="Type"></div>
    <article class="vk-card vk-fade" id="info"></article>
  </main>
</div>
<nav class="app-nav app-nav-sticky" aria-label="Main">{''.join(items)}</nav>
<script src="js/vk-engine.js"></script>{datatags}<script src="js/{models}"></script><script src="js/cat-app.js"></script>
</body></html>
'''
open(f,'w').write(html); print('wrote',f)
