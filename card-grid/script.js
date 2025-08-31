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
