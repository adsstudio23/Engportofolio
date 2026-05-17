import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCq0WEAENl8nxhDXNihysZtZprqtc_L82U",
    authDomain: "adsstudio-c7d24.firebaseapp.com",
    projectId: "adsstudio-c7d24",
    storageBucket: "adsstudio-c7d24.firebasestorage.app",
    messagingSenderId: "707529787206",
    appId: "1:707529787206:web:0745367d9d609c48740747",
    measurementId: "G-4LWNZRFY0H"
};

let db;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (e) { console.warn("Firebase init error:", e.message); db = null; }

// Default content (English)
const defaultData = {
    name: "Adrieza Rizky Samudra",
    tagline: "Full-Stack Developer",
    description: "A front-end designer with 10 years of experience. Proficient in JavaScript, HTML/CSS, PHP, Ruby. Building fast, interactive, and dynamic websites.",
    photoURL: "", logoURL: "",
    aboutText: "<p>I'm Adrieza, a full-stack developer with a strong focus on front-end design. I have been designing and developing websites for over a decade.</p><p>I believe a good website is not just about code, but also about a smooth and enjoyable user experience. From HTML/CSS to React, from PHP to Ruby, I'm ready to bring your digital ideas to life.</p>",
    skills: ["HTML/CSS", "JavaScript", "React", "PHP", "Ruby"],
    whatsapp: "6285785202302",
    instagram: "https://www.instagram.com/adsstud1o?igsh=MWNueThpdGQwYmVkbA==",
    email: "adsstudio60@gmail.com",
    experience: [
        { role: "Freelance Designer", company: "Qiara Media", date: "2020-2021", desc: "Created book covers and layouts." },
        { role: "Designer", company: "Makmur Digital Printing", date: "2023-2024", desc: "Designed promotional banners, stickers, logos, and more." },
        { role: "Freelance Designer/Full-Stack Developer", company: "Freelance", date: "2024-present", desc: "Building websites and designs for various clients." }
    ],
    projects: [
        { id: "proj1", name: "Kopi Lereng", desc: "This website integrates Google Maps and WhatsApp so the owner no longer needs a separate cashier app. Comes with a developer mode for uploading images/menus directly from the gallery.", tech: ["HTML/CSS", "JavaScript"], link: "https://adsstudio23.github.io/Portofolio-coffe/", image: "" },
        { id: "proj2", name: "Rent Cost", desc: "Helps cosplay rental business owners display items and serves as an online cashier app.", tech: ["HTML/CSS", "JavaScript", "React"], link: "https://adsstudio23.github.io/Cosplay/", image: "" },
        { id: "proj3", name: "Monster Hunter Ultimate Set", desc: "Makes it easier for Monster Hunter 3rd Portable players to find mix sets and items, with lightweight animations.", tech: ["HTML/CSS", "JavaScript", "React"], link: "https://mh3rdultimate.github.io/Mh3rdmixset/", image: "" }
    ]
};

// Placeholder image SVG
function placeholderImage(text) {
    return "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250"><rect width="400" height="250" fill="#f5efe8"/><text x="200" y="130" text-anchor="middle" fill="#999" font-size="18">${text}</text></svg>`);
}

async function loadData() {
    if (!db) return defaultData;
    let data = { ...defaultData };
    try {
        const docSnap = await getDoc(doc(db, "content", "profile"));
        if (docSnap.exists()) {
            const fb = docSnap.data();
            data = { ...data, ...fb };
            if (typeof data.skills === 'string') data.skills = data.skills.split(',').map(s => s.trim());
        }
        const projSnap = await getDocs(collection(db, "content", "profile", "projects"));
        if (!projSnap.empty) {
            data.projects = [];
            projSnap.forEach(doc => data.projects.push({ id: doc.id, ...doc.data() }));
        }
    } catch (e) { console.warn("Failed to fetch data:", e.message); }
    return data;
}

function renderPage(data) {
    document.getElementById("nameDisplay").textContent = data.name;
    document.getElementById("taglineDisplay").textContent = data.tagline;
    document.getElementById("descriptionDisplay").textContent = data.description;
    document.getElementById("profilePhotoDisplay").src = data.photoURL || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f0e6d3'/%3E%3Ctext x='100' y='110' text-anchor='middle' fill='%23999'%3EPhoto%3C/text%3E%3C/svg%3E";
    document.getElementById("logoDisplay").src = data.logoURL || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23e0b1b1' rx='5'/%3E%3C/svg%3E";
    document.getElementById("aboutText").innerHTML = data.aboutText;
    document.getElementById("skillsContainer").innerHTML = data.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
    document.getElementById("projectsGrid").innerHTML = data.projects.map(p => `
        <div class="project-card reveal">
            <img src="${p.image || placeholderImage(p.name)}" alt="${p.name}">
            <div class="project-card-content">
                <h3>${p.name}</h3><p>${p.desc}</p>
                <div class="tech-tags">${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
                <a href="${p.link}" target="_blank" class="project-link">View Project →</a>
            </div>
        </div>
    `).join('');
    document.getElementById("timelineContainer").innerHTML = data.experience.map(e => `
        <div class="timeline-item reveal">
            <h4>${e.role} – ${e.company}</h4>
            <div class="date">${e.date}</div>
            <p>${e.desc}</p>
        </div>
    `).join('');
    document.getElementById("whatsappLink").href = `https://wa.me/${data.whatsapp}`;
    document.getElementById("instagramLink").href = data.instagram;
    document.getElementById("emailLink").href = `mailto:${data.email}`;

    // Why Me (static)
    document.getElementById("whyMeGrid").innerHTML = [
        { icon: "🎨", title: "Designer & Developer", desc: "10 years of design experience combined with solid programming logic." },
        { icon: "⚡", title: "Fast, Light, Interactive", desc: "Websites are not only responsive but lightweight with smooth animations." },
        { icon: "🔧", title: "Full-Stack, Front-End Specialist", desc: "Mastering HTML/CSS, JS, React, PHP, Ruby." },
        { icon: "📱", title: "Mobile-First, Every Device", desc: "Optimal display from phone to desktop." },
        { icon: "🤝", title: "Communicative & Target-Oriented", desc: "I listen to your needs and provide suitable solutions." }
    ].map(c => `<div class="why-card reveal"><div class="why-icon">${c.icon}</div><h3>${c.title}</h3><p>${c.desc}</p></div>`).join('');
}

function hidePreloader() {
    document.querySelector('.preloader')?.classList.add('hidden');
}

function typeEffect(element, text, speed = 80) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 8 + 4;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (Math.random() * 6 + 6) + 's';
        p.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(p);
    }
}

// Parallax mouse on hero image
document.addEventListener('mousemove', (e) => {
    const img = document.querySelector('.hero-image');
    if (!img) return;
    const x = (window.innerWidth / 2 - e.clientX) / 30;
    const y = (window.innerHeight / 2 - e.clientY) / 30;
    img.style.transform = `translate(${x}px, ${y}px)`;
});

// Navbar scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    document.querySelectorAll('.reveal').forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) el.classList.add('active');
    });

    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    let current = '';
    sections.forEach(sec => {
        if (scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
    });
    navItems.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
    });
});

// Mobile nav
document.querySelector('.nav-toggle')?.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.toggle('active');
});

// Theme toggle
document.querySelector('.theme-toggle')?.addEventListener('click', () => {
    const body = document.body;
    body.setAttribute('data-theme', body.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
});

// Ripple effect
document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Init
(async () => {
    createParticles();
    const data = await loadData();
    renderPage(data);
    const taglineEl = document.getElementById('taglineDisplay');
    if (taglineEl && data.tagline) typeEffect(taglineEl, data.tagline);
    hidePreloader();
    window.dispatchEvent(new Event('scroll'));
})();