function openWindow(type) {
  const windows = document.getElementById('windows');
  let content = '';
  if (type === 'projects') content = '<h2>Projekter</h2><p>Portfolio, Blog, Spil...</p>';
  if (type === 'about') content = '<h2>Om mig</h2><p>Passioneret udvikler med fokus på web.</p>';
  if (type === 'contact') content = '<h2>Kontakt</h2><p>Email: email@eksempel.dk</p>';
  windows.innerHTML = `<div class='window'><span class='close-btn' onclick='closeWindow()'>X</span>${content}</div>`;
}
function closeWindow() {
  document.getElementById('windows').innerHTML = '';
}
