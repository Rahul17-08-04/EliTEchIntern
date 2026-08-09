document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // -----------------------------
  // Loading screen
  // -----------------------------
  const loader = document.querySelector("#loader");
  const loaderNumber = document.querySelector(".loader-number");
  const counter = { value: 0 };

  gsap.to(counter, {
    value: 100,
    duration: 1.6,
    ease: "power2.out",
    onUpdate: () => {
      loaderNumber.textContent = String(Math.round(counter.value)).padStart(2, "0");
    },
    onComplete: () => {
      gsap.to(loader, {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut",
        delay: .2
      });
      animateHero();
    }
  });

  // -----------------------------
  // Three.js animated particle field
  // -----------------------------
  const canvas = document.querySelector("#space");
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const particleCount = window.innerWidth < 700 ? 700 : 1500;
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const radius = 2 + Math.random() * 7;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    sizes[i] = Math.random() * 2 + .4;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    color: 0xc7ff39,
    size: 0.018,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const mouse = { x: 0, y: 0 };

  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth - .5) * 2;
    mouse.y = (e.clientY / window.innerHeight - .5) * 2;
  });

  function render() {
    particles.rotation.y += .00045;
    particles.rotation.x += .00018;

    particles.rotation.y += (mouse.x * .0008 - particles.rotation.y % .001) * .02;
    camera.position.x += (mouse.x * .15 - camera.position.x) * .02;
    camera.position.y += (-mouse.y * .15 - camera.position.y) * .02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // -----------------------------
  // Hero animation
  // -----------------------------
  function animateHero() {
    const tl = gsap.timeline();

    tl.from(".nav", {
      y: -40,
      opacity: 0,
      duration: .8,
      ease: "power3.out"
    })
    .from(".hero-title .line > span", {
      yPercent: 120,
      duration: 1.1,
      stagger: .12,
      ease: "power4.out"
    }, "-=.4")
    .from(".eyebrow, .hero-copy, .hero-actions, .hero-meta", {
      y: 25,
      opacity: 0,
      duration: .8,
      stagger: .12,
      ease: "power3.out"
    }, "-=.55");
  }

  // -----------------------------
  // Scroll-triggered reveals
  // -----------------------------
  gsap.utils.toArray(".reveal").forEach((element) => {
    if (element.closest(".hero")) return;

    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: .9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 88%",
        once: true
      }
    });
  });

  // Section heading parallax
  gsap.utils.toArray(".section-heading h2, .statement h2").forEach((element) => {
    gsap.from(element, {
      y: 70,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 88%",
        once: true
      }
    });
  });

  // Project visual floating effect
  gsap.utils.toArray(".project-visual").forEach((visual) => {
    gsap.to(visual, {
      y: -20,
      ease: "none",
      scrollTrigger: {
        trigger: visual,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
  });

  // -----------------------------
  // Magnetic buttons
  // -----------------------------
  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(element, {
        x: x * .18,
        y: y * .18,
        duration: .3,
        ease: "power2.out"
      });
    });

    element.addEventListener("mouseleave", () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: .5,
        ease: "elastic.out(1, .4)"
      });
    });
  });

  // -----------------------------
  // Custom cursor
  // -----------------------------
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");

  window.addEventListener("mousemove", (e) => {
    gsap.to(dot, {
      x: e.clientX,
      y: e.clientY,
      duration: .05
    });

    gsap.to(ring, {
      x: e.clientX,
      y: e.clientY,
      duration: .25,
      ease: "power2.out"
    });
  });

  document.querySelectorAll("a, button").forEach((element) => {
    element.addEventListener("mouseenter", () => ring.classList.add("active"));
    element.addEventListener("mouseleave", () => ring.classList.remove("active"));
  });

  // -----------------------------
  // Mobile menu
  // -----------------------------
  const menuButton = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");

  menuButton.addEventListener("click", () => {
    nav.classList.toggle("menu-active");
    document.body.classList.toggle("menu-open");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("menu-active");
      document.body.classList.remove("menu-open");
    });
  });

  // -----------------------------
  // Project hover animation
  // -----------------------------
  document.querySelectorAll(".project").forEach((project) => {
    const visual = project.querySelector(".project-visual");

    project.addEventListener("mouseenter", () => {
      gsap.to(visual, {
        scale: 1.025,
        duration: .6,
        ease: "power3.out"
      });
    });

    project.addEventListener("mouseleave", () => {
      gsap.to(visual, {
        scale: 1,
        duration: .6,
        ease: "power3.out"
      });
    });
  });
});
