function openCard(name) {
  let details = '';
  if (name === 'Portfolio') details = 'Mit portfolio-projekt med HTML, CSS, JS og PHP.';
  if (name === 'Blog') details = 'Min blog-platform med dynamisk indhold.';
  if (name === 'Spil') details = 'Spil udviklet i JavaScript.';
  if (name === 'Web') details = 'Webprojekter og webapps.';
  document.getElementById('popup').innerHTML = `<span class='close-btn' onclick='closeCard()'>X</span><h2>${name}</h2><p>${details}</p>`;
  document.getElementById('popup').style.display = 'block';
}
function closeCard() {
  document.getElementById('popup').style.display = 'none';
}
// Download CV
document.getElementById('cv-btn').onclick = function() {
  const link = document.createElement('a');
  link.href = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  link.download = 'CV.pdf';
  link.click();
};
// Konami code easter egg
let konami = [];
const secret = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
window.addEventListener('keydown', function(e) {
  konami.push(e.key);
  if (konami.length > secret.length) konami.shift();
  if (konami.join('').toLowerCase() === secret.join('').toLowerCase()) {
    alert('🎉 Du fandt et easter egg!');
    konami = [];
  }
});
