document.getElementById('toggle-mode').onclick = function() {
  document.body.classList.toggle('light');
};
// Download CV
document.getElementById('cv-btn').onclick = function() {
  const link = document.createElement('a');
  link.href = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  link.download = 'CV.pdf';
  link.click();
};

// Three.js 3D logo demo
if (document.getElementById('logo-3d')) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 300/200, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(300, 200);
  document.getElementById('logo-3d').appendChild(renderer.domElement);
  const geometry = new THREE.TorusKnotGeometry(50, 15, 100, 16);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
  const knot = new THREE.Mesh(geometry, material);
  scene.add(knot);
  camera.position.z = 200;
  function animate() {
    requestAnimationFrame(animate);
    knot.rotation.x += 0.01;
    knot.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
}
