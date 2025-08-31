const input = document.getElementById('terminal-input');
const output = document.getElementById('output');

const commands = {
  about: 'Jeg er en passioneret udvikler med fokus på web og software.',
  projects: 'Mine projekter: Portfolio, Blog, Spil, m.m.',
  contact: 'Kontakt: email@eksempel.dk',
};

input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const cmd = input.value.trim().toLowerCase();
    if (commands[cmd]) {
      output.innerHTML += `<br>&gt; ${cmd}<br>${commands[cmd]}`;
    } else {
      output.innerHTML += `<br>&gt; ${cmd}<br>Ukendt kommando.`;
    }
    input.value = '';
    output.scrollTop = output.scrollHeight;
  }
});

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
