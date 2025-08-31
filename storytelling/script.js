window.addEventListener('scroll', function() {
  document.querySelectorAll('.chapter').forEach(function(ch) {
    const rect = ch.getBoundingClientRect();
    if (rect.top < window.innerHeight/2 && rect.bottom > window.innerHeight/2) {
      ch.classList.add('active');
    } else {
      ch.classList.remove('active');
    }
  });
});
