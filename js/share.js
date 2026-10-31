function shareApp(){
  var url=new URL('./',location.href).href;
  if(navigator.share){navigator.share({title:document.title,url:url}).catch(function(){});}
  else if(navigator.clipboard){navigator.clipboard.writeText(url).then(function(){alert('Link copied!');},function(){prompt('Copy this link:',url);});}
  else{prompt('Copy this link:',url);}
}
