let winCount = 0;
function openWindow(type) {
  const windows = document.getElementById('windows');
  let content = '';
  if (type === 'projects') content = '<h2>Projekter</h2><p>Portfolio, Blog, Spil...</p>';
  if (type === 'about') content = '<h2>Om mig</h2><p>Passioneret udvikler med fokus på web.</p>';
  if (type === 'contact') content = '<h2>Kontakt</h2><p>Email: email@eksempel.dk</p>';
  if (type === 'cv') content = '<h2>Download CV</h2><button onclick="downloadCV()">Download PDF</button>';
  winCount++;
  const winId = 'window-' + winCount;
  const winDiv = document.createElement('div');
  winDiv.className = 'window';
  winDiv.id = winId;
  winDiv.style.top = (100 + winCount*30) + 'px';
  winDiv.style.left = (100 + winCount*30) + 'px';
  winDiv.innerHTML = `<span class='close-btn' onclick='closeWindow("${winId}")'>X</span>${content}`;
  winDiv.onmousedown = dragMouseDown;
  windows.appendChild(winDiv);
}
function closeWindow(id) {
  const win = document.getElementById(id);
  if (win) win.remove();
}
function downloadCV() {
  const link = document.createElement('a');
  link.href = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  link.download = 'CV.pdf';
  link.click();
}

// Drag & drop vinduer
let dragWin = null, offsetX = 0, offsetY = 0;
function dragMouseDown(e) {
  dragWin = this;
  offsetX = e.clientX - dragWin.offsetLeft;
  offsetY = e.clientY - dragWin.offsetTop;
  document.onmousemove = elementDrag;
  document.onmouseup = closeDrag;
}
function elementDrag(e) {
  if (!dragWin) return;
  dragWin.style.left = (e.clientX - offsetX) + 'px';
  dragWin.style.top = (e.clientY - offsetY) + 'px';
}
function closeDrag() {
  dragWin = null;
  document.onmousemove = null;
  document.onmouseup = null;
}
