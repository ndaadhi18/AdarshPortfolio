// Smooth scroll behavior for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all cards and sections
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    ".system-card, .philosophy-card, .timeline-item, .constraint-card, .tradeoff-card, .proof-card",
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});

// Add parallax effect to hero background
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const heroBackground = document.querySelector(".hero-background");
  if (heroBackground) {
    heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Add hover effect to flow nodes
document.querySelectorAll(".flow-node").forEach((node) => {
  node.addEventListener("mouseenter", function () {
    this.style.transition = "all 0.3s ease";
  });
});

// Highlight active section in navigation (if you add a nav later)
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      // You can add active class to nav items here if needed
    }
  });
});

// Add copy-to-clipboard functionality for code blocks
document.querySelectorAll("code").forEach((codeBlock) => {
  codeBlock.style.cursor = "pointer";
  codeBlock.title = "Click to copy";

  codeBlock.addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText(this.textContent);

      // Visual feedback
      const originalBg = this.style.background;
      this.style.background = "rgba(16, 185, 129, 0.2)";

      setTimeout(() => {
        this.style.background = originalBg;
      }, 300);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  });
});

// Add stagger animation to control items
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".control-grid").forEach((grid) => {
    const items = grid.querySelectorAll(".control-item");
    items.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateX(-20px)";
      item.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;

      const gridObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              item.style.opacity = "1";
              item.style.transform = "translateX(0)";
            }
          });
        },
        { threshold: 0.1 },
      );

      gridObserver.observe(grid);
    });
  });
});

// Add pulse animation to live indicators
document.querySelectorAll(".live-dot, .badge-dot").forEach((dot) => {
  setInterval(() => {
    dot.style.transform = "scale(1.2)";
    setTimeout(() => {
      dot.style.transform = "scale(1)";
    }, 300);
  }, 2000);
});

// Add gradient animation to gradient text
document.addEventListener("DOMContentLoaded", () => {
  const gradientTexts = document.querySelectorAll(".gradient-text");
  gradientTexts.forEach((text) => {
    text.style.backgroundSize = "200% auto";
    text.style.animation = "gradientShift 3s ease infinite";
  });
});

// Add CSS for gradient animation
const style = document.createElement("style");
style.textContent = `
    @keyframes gradientShift {
        0%, 100% {
            background-position: 0% center;
        }
        50% {
            background-position: 100% center;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll handler
const debouncedScroll = debounce(() => {
  const scrolled = window.pageYOffset;
  const heroBackground = document.querySelector(".hero-background");
  if (heroBackground) {
    heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
}, 10);

window.addEventListener("scroll", debouncedScroll);

// Add loading animation
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});

// Easter egg: Konami code for special effect
let konamiCode = [];
const konamiPattern = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join("") === konamiPattern.join("")) {
    // Add special effect
    document.body.style.animation = "rainbow 2s ease infinite";
    setTimeout(() => {
      document.body.style.animation = "";
    }, 5000);
  }
});

const rainbowStyle = document.createElement("style");
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

console.log(
  "%c🚀 Portfolio Loaded Successfully",
  "color: #6366f1; font-size: 16px; font-weight: bold;",
);
console.log(
  "%cBuilt with evidence-driven agentic AI principles",
  "color: #8b5cf6; font-size: 12px;",
);
