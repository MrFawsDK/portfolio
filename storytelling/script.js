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
// Download CV
document.getElementById('cv-btn').onclick = function() {
  const link = document.createElement('a');
  link.href = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  link.download = 'CV.pdf';
  link.click();
};
