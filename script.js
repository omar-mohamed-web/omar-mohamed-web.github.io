// Put your real email here. The contact form opens the visitor's email app addressed to it.
const CONTACT_EMAIL = "om3530652@gmail.com";

const menuBtn = document.querySelector(".menu-btn");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".navbar a");
const menuIcon = menuBtn.querySelector("i");

// Mobile menu
function setMenu(open) {
    navbar.classList.toggle("active", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuIcon.classList.toggle("fa-bars", !open);
    menuIcon.classList.toggle("fa-xmark", open);
}

menuBtn.addEventListener("click", () => setMenu(!navbar.classList.contains("active")));
navLinks.forEach(link => link.addEventListener("click", () => setMenu(false)));

// Active navigation link
const sections = document.querySelectorAll("main section[id]");

function updateActiveLink() {
    let current = sections[0].id;
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 160) current = section.id;
    });
    // Last section: highlight it when the page bottom is reached
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
        current = sections[sections.length - 1].id;
    }
    navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
}

window.addEventListener("scroll", updateActiveLink, { passive: true });
updateActiveLink();

// Learning progress bars: animate once, when the section scrolls into view
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const learningSection = document.querySelector("#learning");
const bars = document.querySelectorAll(".progress");
const numbers = document.querySelectorAll(".progress-number");

function animateBars() {
    bars.forEach((bar, i) => {
        const target = Number(bar.dataset.progress);

        if (reduceMotion) {
            bar.style.width = target + "%";
            numbers[i].textContent = target + "%";
            return;
        }

        setTimeout(() => { bar.style.width = target + "%"; }, i * 150);

        let value = 0;
        numbers[i].textContent = "0%";
        const timer = setInterval(() => {
            if (value >= target) return clearInterval(timer);
            value++;
            numbers[i].textContent = value + "%";
        }, 1500 / Math.max(target, 1));
    });
}

const observer = new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) {
        animateBars();
        obs.disconnect();
    }
}, { threshold: 0.3 });

observer.observe(learningSection);

// Contact form: opens the visitor's email app with the message filled in
const contactForm = document.querySelector(".contact-form");
const formNote = contactForm.querySelector(".form-note");

contactForm.addEventListener("submit", event => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const subject = encodeURIComponent(data.get("subject"));
    const body = encodeURIComponent(
        data.get("message") + "\n\nFrom: " + data.get("name") + " (" + data.get("email") + ")"
    );

    window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
    formNote.textContent = "Opening your email app...";
    contactForm.reset();
});