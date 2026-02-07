// Asteroid Canvas Animation with Enhanced Speed Effect
class AsteroidField {
  constructor() {
    this.canvas = document.getElementById("asteroidCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.asteroids = [];
    this.numAsteroids = 80;
    this.mouse = { x: 0, y: 0 };
    this.baseSpeed = 8;
    this.speedMultiplier = 1;

    this.init();
  }

  init() {
    this.resize();
    this.createAsteroids();
    this.animate();

    window.addEventListener("resize", () => this.resize());
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener("scroll", () => {
      const scrollPercent =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      this.speedMultiplier = 8 - scrollPercent * 7.7;
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createAsteroids() {
    for (let i = 0; i < this.numAsteroids; i++) {
      this.asteroids.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 2000 + 100,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 3 + 2,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        trail: [],
      });
    }
  }

  drawAsteroid(asteroid) {
    const scale = 2000 / (2000 - asteroid.z);
    const x = asteroid.x * scale + this.canvas.width / 2;
    const y = asteroid.y * scale + this.canvas.height / 2;
    const size = asteroid.size * scale;

    if (
      x < -100 ||
      x > this.canvas.width + 100 ||
      y < -100 ||
      y > this.canvas.height + 100
    ) {
      return;
    }

    const parallaxX = (this.mouse.x - this.canvas.width / 2) * 0.02 * scale;
    const parallaxY = (this.mouse.y - this.canvas.height / 2) * 0.02 * scale;

    this.ctx.save();
    if (asteroid.trail.length > 0) {
      this.ctx.beginPath();
      asteroid.trail.forEach((point, i) => {
        const trailScale = 2000 / (2000 - point.z);
        const tx = point.x * trailScale + this.canvas.width / 2 + parallaxX;
        const ty = point.y * trailScale + this.canvas.height / 2 + parallaxY;
        const opacity = (i / asteroid.trail.length) * 0.3;

        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = `rgba(88, 166, 255, ${opacity})`;
        this.ctx.fillRect(tx, ty, size * 0.5, size * 0.5);
      });
    }
    this.ctx.restore();

    this.ctx.save();
    this.ctx.translate(x + parallaxX, y + parallaxY);
    this.ctx.rotate(asteroid.angle);

    this.ctx.beginPath();
    const points = 8;
    for (let i = 0; i < points; i++) {
      const angle = (Math.PI * 2 * i) / points;
      const radius = size * (0.7 + Math.random() * 0.6);
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;

      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }
    this.ctx.closePath();

    const opacity = Math.min(1, scale * 0.6);
    const speedGlow = this.speedMultiplier / 8;
    const hue = 200 + asteroid.z / 20;

    this.ctx.shadowBlur = 20 * speedGlow;
    this.ctx.shadowColor = `hsla(${hue}, 80%, 70%, ${opacity})`;

    this.ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${opacity * 0.4})`;
    this.ctx.fill();

    this.ctx.strokeStyle = `hsla(${hue}, 90%, 80%, ${opacity * 0.8})`;
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();

    this.ctx.restore();
  }

  updateAsteroid(asteroid) {
    asteroid.trail.push({ x: asteroid.x, y: asteroid.y, z: asteroid.z });
    if (asteroid.trail.length > 5) {
      asteroid.trail.shift();
    }

    const totalSpeed = asteroid.speed * this.baseSpeed * this.speedMultiplier;
    asteroid.z -= totalSpeed;
    asteroid.angle += asteroid.rotationSpeed * this.speedMultiplier;

    if (asteroid.z < 1) {
      asteroid.z = 2000;
      asteroid.x = (Math.random() - 0.5) * 2000;
      asteroid.y = (Math.random() - 0.5) * 2000;
      asteroid.trail = [];
    }
  }

  animate() {
    this.ctx.fillStyle = "rgba(1, 4, 9, 0.15)"; // Darker background to match theme
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.asteroids.sort((a, b) => b.z - a.z);

    this.asteroids.forEach((asteroid) => {
      this.updateAsteroid(asteroid);
      this.drawAsteroid(asteroid);
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupSmoothScroll();
    this.animateOnScroll();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("aos-animate");
        }
      });
    }, this.observerOptions);

    document.querySelectorAll("[data-aos]").forEach((el) => {
      observer.observe(el);
    });

    // Section header animation
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 },
    );

    document.querySelectorAll(".section-header").forEach((el) => {
      sectionObserver.observe(el);
    });
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  animateOnScroll() {
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  handleScroll() {
    const scrolled = window.scrollY;
    const hero = document.querySelector(".hero-section");

    if (hero) {
      const heroHeight = hero.offsetHeight;
      const opacity = 1 - scrolled / heroHeight;
      const scale = 1 - (scrolled / heroHeight) * 0.2;

      hero.style.opacity = Math.max(0, opacity);
      hero.style.transform = `scale(${Math.max(0.8, scale)})`;
    }
  }
}

// Project Card Hover Effects
class ProjectCardEffects {
  constructor() {
    this.init();
  }

  init() {
    const cards = document.querySelectorAll(".project-card");

    cards.forEach((card) => {
      card.addEventListener("mouseenter", (e) => {
        this.createParticles(e.currentTarget);
      });

      card.addEventListener("mousemove", (e) => {
        this.handleMouseMove(e);
      });

      card.addEventListener("mouseleave", (e) => {
        this.resetCard(e.currentTarget);
      });
    });
  }

  createParticles(card) {
    const rect = card.getBoundingClientRect();
    const particles = 5;

    for (let i = 0; i < particles; i++) {
      const particle = document.createElement("div");
      particle.style.position = "absolute";
      particle.style.width = "2px";
      particle.style.height = "2px";
      particle.style.background = "#58a6ff";
      particle.style.borderRadius = "50%";
      particle.style.pointerEvents = "none";
      particle.style.left = Math.random() * rect.width + "px";
      particle.style.top = Math.random() * rect.height + "px";
      particle.style.opacity = "0";
      particle.style.transition = "all 0.5s ease-out";

      card.appendChild(particle);

      setTimeout(() => {
        particle.style.opacity = "1";
        particle.style.transform = `translate(${(Math.random() - 0.5) * 50}px, ${(Math.random() - 0.5) * 50}px)`;
      }, 10);

      setTimeout(() => {
        particle.remove();
      }, 500);
    }
  }

  handleMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  }

  resetCard(card) {
    card.style.transform = "";
  }
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new AsteroidField();
  new ScrollAnimations();
  new ProjectCardEffects();

  // Add stagger delay to project cards
  const cards = document.querySelectorAll(".project-card");
  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
  });
});

// Performance optimization
if ("requestIdleCallback" in window) {
  requestIdleCallback(() => {
    console.log("Portfolio loaded successfully");
  });
}
