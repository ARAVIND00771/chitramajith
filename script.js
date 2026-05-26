const revealElements = document.querySelectorAll(".reveal");
const tiltElements = document.querySelectorAll("[data-tilt]");
const cursorGlow = document.querySelector(".cursor-glow");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const typeTarget = document.querySelector(".typing-text");
const magneticButtons = document.querySelectorAll(".magnetic-btn");

const revealIfVisible = (el) => {
  const rect = el.getBoundingClientRect();
  const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
  if (inView) {
    el.classList.add("revealed");
    return true;
  }
  return false;
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
);

revealElements.forEach((el) => {
  revealIfVisible(el);
  if (!el.classList.contains("revealed")) {
    observer.observe(el);
  }
});

window.addEventListener("load", () => {
  revealElements.forEach((el) => revealIfVisible(el));
});

document.addEventListener("mousemove", (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

document.addEventListener("mouseleave", () => {
  if (!cursorGlow) return;
  cursorGlow.style.opacity = "0";
});

document.addEventListener("mouseenter", () => {
  if (!cursorGlow) return;
  cursorGlow.style.opacity = "1";
});

tiltElements.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(850px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

magneticButtons.forEach((button) => {
  button.addEventListener("mousemove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const moveX = (x - rect.width / 2) * 0.13;
    const moveY = (y - rect.height / 2) * 0.2;
    button.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});

if (typeTarget) {
  const fullText = typeTarget.textContent.trim();
  typeTarget.textContent = "";
  let index = 0;

  const typeWriter = () => {
    if (index < fullText.length) {
      typeTarget.textContent += fullText.charAt(index);
      index += 1;
      setTimeout(typeWriter, 26);
    }
  };

  setTimeout(typeWriter, 500);
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });
}

const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameInput = contactForm.querySelector("#name");
    const emailInput = contactForm.querySelector("#email");
    const messageInput = contactForm.querySelector("#message");
    const button = contactForm.querySelector("button");
    if (!button || !nameInput || !emailInput || !messageInput) return;

    const name = nameInput.value.trim();
    const senderEmail = emailInput.value.trim();
    const message = messageInput.value.trim();
    const recipient = "chitramajith@gmail.com";
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Hello Chitram Ajith,\n\nName: ${name}\nEmail: ${senderEmail}\n\nMessage:\n${message}\n`
    );
    const mailtoURL = `mailto:${recipient}?subject=${subject}&body=${body}`;

    const originalText = button.textContent;
    button.textContent = "Opening Mail...";
    button.disabled = true;
    window.location.href = mailtoURL;

    setTimeout(() => {
      contactForm.reset();
      button.textContent = originalText;
      button.disabled = false;
    }, 1300);
  });
}
