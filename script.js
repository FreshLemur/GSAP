gsap.registerPlugin(ScrollTrigger);

let panels = gsap.utils.toArray(".panel");

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#main",
    start: "top top",
    // Keep the "end" value to define how much the user has to scroll
    end: () => "+=" + (panels.length - 1) * 100 + "%",
    scrub: 1,
    pin: true,
    snap: 1 / (panels.length - 1),
  },
});

// Loop through panels and move them to the LEFT
panels.forEach((panel, i) => {
  if (i === panels.length - 1) return; // Don't animate the last page

  tl.to(panel, {
    xPercent: -100, // Move the current page to the left to reveal the next
    ease: "none",
  });
});

ScrollTrigger.create({
  trigger: "#main",
  start: "top top",
  end: () => "+=" + (panels.length - 1) * 100 + "%",
  onUpdate: (self) => {
    // Calculate current page based on scroll progress
    const progress = self.progress;
    const totalPages = panels.length;
    const currentIndex = Math.round(progress * (totalPages - 1)) + 1;

    // Update your counter text (assuming you have this class)
    const counterSpan = document.querySelector(".carousel-nav__counter-text");
    if (counterSpan) counterSpan.innerText = currentIndex;
  },
});

const heroTitleTextChanging = () => {
  const heroTitle = document.querySelector(".hero__title");
  const phrases = ["Find your dream job", "Move easily", "Live globally"];
  const animationClass = "hero__title--animate";
  let index = 0;

  // Set the initial default value
  heroTitle.textContent = phrases[0];

  setInterval(() => {
    // 1. Remove the class to "reset" the animation
    heroTitle.classList.remove(animationClass);

    // Trigger a "reflow" to make the browser notice the class was removed
    // This is a trick to ensure the animation restarts
    void heroTitle.offsetWidth;

    // 2. Update the index and change the text
    index = (index + 1) % phrases.length;
    heroTitle.textContent = phrases[index];

    // 3. Add the class back to trigger the animation
    heroTitle.classList.add(animationClass);
  }, 4000);
};

heroTitleTextChanging();

var container;
var camera, scene, renderer;
var framesCount = 0;

var localGroup;
var particles = [],
  particlesSlice = [],
  particle,
  geometry,
  material;

// Math variables
const deg = Math.PI / 180; // one degree

init();
sceneAnimation();

// Initiating Scene
function init() {
  // INIT Scene
  // --------------------------------------

  scene = new THREE.Scene();

  // INIT Camera
  // --------------------------------------

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(-1.2, 0, 2);

  // INIT Renderer
  // --------------------------------------

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container = document.getElementById("canvas-container");
  container.appendChild(renderer.domElement);

  // INIT Options
  // --------------------------------------

  // Create particles
  sceneParticles(0.005, 64);

  // Create slices of particles
  groupSlices(64);

  // Create fog
  scene.fog = new THREE.FogExp2(0x0f0f1f, 0.065);

  // Create group
  sceneGroup(localGroup, particlesSlice);

  // Update renderer and camera when resizing
  window.addEventListener("resize", onWindowResize, false);
}

// Rendering the scene
function sceneAnimation() {
  requestAnimationFrame(sceneAnimation);

  framesCount++;

  // Slice Animation
  for (let i = 0; i < particlesSlice.length; ++i) {
    particlesSlice[i].rotation.x += 0.001 + 0.0002 * i; // each slice animation
    particlesSlice[i].rotation.y += 0.0015 + 0.0001 * i; // each slice animation
    particlesSlice[i].rotation.z += 0.002 + 0.0002 * i; // each slice animation
  }

  // Single Particles Animation
  for (let i = 0; i < particles.length; ++i) {
    // Scaling
    particles[i].scale.set(
      Math.sin(framesCount * 0.00001 * i),
      Math.sin(framesCount * 0.00001 * i),
      Math.sin(framesCount * 0.00001 * i)
    );

    // Color
    // Each dot will have the same color as they use the same material in the creation process!
    // particles[i].material.color.setHSL(
    //   Math.sin(framesCount * 0.0075 + i * 0.001) * 0.5 + 0.5,
    //   0.75,
    //   0.75
    // );
  }

  // Sphere Animation
  localGroup.rotation.y = Math.cos(framesCount * 0.01);
  localGroup.rotation.z = Math.sin(framesCount * 0.01);

  renderer.render(scene, camera);
}

function sceneParticles(size, length) {
  geometry = new THREE.SphereBufferGeometry(size, 16, 16);
  material = new THREE.MeshBasicMaterial({
    color: "#F67F1B",
    blending: THREE.AdditiveBlending,
  });

  let i = 0,
    ix,
    iy;

  // Two Dimensions (x & y)
  for (let ix = 0; ix < length; ++ix) {
    // Third Dimension (z)
    for (let iy = 0; iy < length; ++iy) {
      particle = particles[i++] = new THREE.Mesh(geometry, material);

      particle.position.x = Math.sin(iy * (2 / length) * Math.PI);
      particle.position.y = Math.cos(iy * (2 / length) * Math.PI);

      scene.add(particle);
    }
  }
}

function groupSlices(length) {
  let i = 0,
    ix,
    iy;

  // Two Dimensions (x & y)
  for (let ix = 0; ix < length; ++ix) {
    particlesSlice[ix] = new THREE.Group();

    // Third Dimension (z)
    for (let iy = 0; iy < length; ++iy) {
      i++;
      particlesSlice[ix].add(particles[i - 1]);
    }

    scene.add(particlesSlice[ix]);

    // Initial positioning
    particlesSlice[ix].rotation.x = deg * ((ix / length) * 180);
    particlesSlice[ix].rotation.y = deg * ((ix / length) * 180) * 3;
    particlesSlice[ix].rotation.z = deg * ((ix / length) * 180) * 6;
  }
}

function sceneGroup(group, objs) {
  group = localGroup = new THREE.Group();

  objs.forEach(function (obj) {
    group.add(obj);
  });

  scene.add(group);
}

// Resizing
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
