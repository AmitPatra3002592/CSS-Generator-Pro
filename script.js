//  FIREBASE CONFIGURATION & IMPORTS
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, deleteDoc }
    from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyApQ9al9OGiFUTrD26XLKT6Nav0Jr7lwjA",
    authDomain: "css-generator-pro.firebaseapp.com",
    projectId: "css-generator-pro",
    storageBucket: "css-generator-pro.firebasestorage.app",
    messagingSenderId: "543151556319",
    appId: "1:543151556319:web:e37e7fee2c7f5392dc8b6a",
    measurementId: "G-1NF39XDSBQ"
};

// Initialize Firebase & Database
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();


//  AUTHENTICATION
// ==========================================
async function loginWithGoogle() {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed: " + error.message);
    }
}

function logout() {
    signOut(auth).then(() => {
        alert("Logged out!");
    }).catch((error) => {
        console.error("Logout error", error);
    });
}

onAuthStateChanged(auth, (user) => {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const userPic = document.getElementById('user-pic');

    if (user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userInfo) userInfo.style.display = 'flex';
        if (userPic) userPic.src = user.photoURL;
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
    }
});

//  LIBRARY FUNCTIONS
// ==========================================

// Save Current Design
async function saveSnippet() {
    const user = auth.currentUser;
    if (!user) { alert("Please Sign In to save!"); return; }

    // Smart Detector: Find the active generator
    const generatorTypes = ['gradient', 'shadow', 'border', 'flexbox', 'transform', 'text', 'animation', 'filter', 'glass'];
    let activeType = null;

    for (const type of generatorTypes) {
        const el = document.getElementById(type + '-generator');
        if (el && !el.classList.contains('hidden')) {
            activeType = type;
            break;
        }
    }

    if (!activeType) { alert("No active generator found."); return; }

    const outputElement = document.getElementById(activeType + '-output');
    if (!outputElement) return;

    try {
        await addDoc(collection(db, "snippets"), {
            userId: user.uid,
            type: activeType,
            code: outputElement.textContent,
            timestamp: new Date()
        });
        alert(`✅ ${activeType.toUpperCase()} saved to Library!`);
    } catch (e) {
        alert("Error saving: " + e.message);
    }
}

// Open Library Modal
async function openLibrary() {
    const user = auth.currentUser;
    if (!user) return;

    document.getElementById('library-modal').classList.remove('hidden');
    const list = document.getElementById('snippets-list');
    list.innerHTML = '<p style="text-align:center;">Loading your designs...</p>';

    try {
        const q = query(collection(db, "snippets"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        list.innerHTML = '';

        if (querySnapshot.empty) {
            list.innerHTML = '<p style="text-align:center;">No saved designs yet.</p>';
            return;
        }

        querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            const id = docSnapshot.id;

            const card = document.createElement('div');
            card.className = 'snippet-card';
            card.innerHTML = `
                <div class="snippet-info">
                    <h3 style="margin:0; text-transform:capitalize;">${data.type}</h3>
                    <pre style="font-size:0.8rem; color:#888;">${data.code.substring(0, 30)}...</pre>
                </div>
                <div>
                    <button onclick="copySnippet('${id}')" class="action-btn" style="font-size:0.8rem; padding:5px 10px;">Copy</button>
                    <button onclick="deleteSnippet('${id}')" class="delete-btn">🗑️</button>
                </div>
                <textarea id="hidden-${id}" style="display:none">${data.code}</textarea>
            `;
            list.appendChild(card);
        });

    } catch (e) {
        console.error(e);
        list.innerHTML = '<p style="color:red">Error loading library.</p>';
    }
}

function closeLibrary() {
    document.getElementById('library-modal').classList.add('hidden');
}

function copySnippet(id) {
    const code = document.getElementById('hidden-' + id).value;
    navigator.clipboard.writeText(code).then(() => { alert("Code copied!"); });
}

async function deleteSnippet(id) {
    if (!confirm("Delete this design?")) return;
    try {
        await deleteDoc(doc(db, "snippets", id));
        openLibrary();
    } catch (e) { alert("Error: " + e.message); }
}

//  DARK MODE
// ==========================================

function toggleTheme() {
    const body = document.body;
    const button = document.getElementById('theme-toggle');
    body.classList.toggle('dark-mode');

    const isDark = body.classList.contains('dark-mode');
    button.textContent = isDark ? '☀︎' : '⏾';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('theme');
    const button = document.getElementById('theme-toggle');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (button) button.textContent = '☀︎';
    }
    // Also init the generator
    showGenerator('gradient');
    const firstBtn = document.querySelector('.nav-button');
    if (firstBtn && !document.querySelector('.nav-button.active')) {
        firstBtn.classList.add('active');
    }
});

//  GENERATOR LOGIC
// ==========================================

function showGenerator(type) {
    const generators = ['gradient', 'shadow', 'border', 'flexbox', 'transform', 'text', 'animation', 'filter', 'glass'];
    const buttons = document.querySelectorAll('.nav-button');

    generators.forEach(gen => {
        const element = document.getElementById(gen + '-generator');
        if (gen === type) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });

    buttons.forEach(btn => btn.classList.remove('active'));
    // Safe event handling
    if (typeof event !== 'undefined' && event.target) {
        event.target.classList.add('active');
    }

    switch (type) {
        case 'gradient': updateGradient(); break;
        case 'shadow': updateShadow(); break;
        case 'border': updateBorder(); break;
        case 'flexbox': updateFlexbox(); break;
        case 'transform': updateTransform(); break;
        case 'text': updateTextShadow(); break;
        case 'animation': updateAnimation(); break;
        case 'filter': updateFilter(); break;
        case 'glass': updateGlass(); break;
    }
}

// Gradient Generator
function updateGradient() {
    const direction = document.getElementById('gradient-direction').value;
    const color1 = document.getElementById('gradient-color1').value;
    const color2 = document.getElementById('gradient-color2').value;
    const color3 = document.getElementById('gradient-color3').value;
    const useColor3 = document.getElementById('gradient-use-color3').checked;

    let gradient;
    if (useColor3) {
        gradient = `linear-gradient(${direction}, ${color1}, ${color2}, ${color3})`;
    } else {
        gradient = `linear-gradient(${direction}, ${color1}, ${color2})`;
    }

    const css = `background: ${gradient};`;
    document.getElementById('gradient-preview').style.background = gradient;
    document.getElementById('gradient-output').textContent = css;
}

// Shadow Generator
function updateShadow() {
    const x = document.getElementById('shadow-x').value;
    const y = document.getElementById('shadow-y').value;
    const blur = document.getElementById('shadow-blur').value;
    const spread = document.getElementById('shadow-spread').value;
    const color = document.getElementById('shadow-color').value;
    const opacity = document.getElementById('shadow-opacity').value / 100;
    const inset = document.getElementById('shadow-inset').checked;

    document.getElementById('shadow-x-value').textContent = x + 'px';
    document.getElementById('shadow-y-value').textContent = y + 'px';
    document.getElementById('shadow-blur-value').textContent = blur + 'px';
    document.getElementById('shadow-spread-value').textContent = spread + 'px';
    document.getElementById('shadow-opacity-value').textContent = document.getElementById('shadow-opacity').value + '%';

    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
    const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;

    const insetText = inset ? 'inset ' : '';
    const shadow = `${insetText}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;
    const css = `box-shadow: ${shadow};`;

    document.getElementById('shadow-preview').style.boxShadow = shadow;
    document.getElementById('shadow-output').textContent = css;
}

// Border Radius Generator
function updateBorder() {
    const tl = document.getElementById('border-tl').value;
    const tr = document.getElementById('border-tr').value;
    const br = document.getElementById('border-br').value;
    const bl = document.getElementById('border-bl').value;

    document.getElementById('border-tl-value').textContent = tl + 'px';
    document.getElementById('border-tr-value').textContent = tr + 'px';
    document.getElementById('border-br-value').textContent = br + 'px';
    document.getElementById('border-bl-value').textContent = bl + 'px';

    const borderRadius = `${tl}px ${tr}px ${br}px ${bl}px`;
    const css = `border-radius: ${borderRadius};`;

    document.getElementById('border-preview').style.borderRadius = borderRadius;
    document.getElementById('border-output').textContent = css;
}

function syncBorderRadius() {
    const tl = document.getElementById('border-tl').value;
    document.getElementById('border-tr').value = tl;
    document.getElementById('border-br').value = tl;
    document.getElementById('border-bl').value = tl;
    updateBorder();
}

function resetBorderRadius() {
    document.getElementById('border-tl').value = 0;
    document.getElementById('border-tr').value = 0;
    document.getElementById('border-br').value = 0;
    document.getElementById('border-bl').value = 0;
    updateBorder();
}

// Flexbox Generator
function updateFlexbox() {
    const direction = document.getElementById('flex-direction').value;
    const justify = document.getElementById('justify-content').value;
    const align = document.getElementById('align-items').value;
    const wrap = document.getElementById('flex-wrap').value;
    const gap = document.getElementById('flex-gap').value;

    document.getElementById('flex-gap-value').textContent = gap + 'px';

    const css = `display: flex;
    flex-direction: ${direction};
    justify-content: ${justify};
    align-items: ${align};
    flex-wrap: ${wrap};
    gap: ${gap}px;`;
    const preview = document.getElementById('flexbox-preview');
    preview.style.display = 'flex';
    preview.style.flexDirection = direction;
    preview.style.justifyContent = justify;
    preview.style.alignItems = align;
    preview.style.flexWrap = wrap;
    preview.style.gap = gap + 'px';

    document.getElementById('flexbox-output').textContent = css;
}

// Transform Generator
function updateTransform() {
    const rotate = document.getElementById('transform-rotate').value;
    const scaleX = document.getElementById('transform-scaleX').value;
    const scaleY = document.getElementById('transform-scaleY').value;
    const translateX = document.getElementById('transform-translateX').value;
    const translateY = document.getElementById('transform-translateY').value;
    const skewX = document.getElementById('transform-skewX').value;

    document.getElementById('transform-rotate-value').textContent = rotate + '°';
    document.getElementById('transform-scaleX-value').textContent = scaleX;
    document.getElementById('transform-scaleY-value').textContent = scaleY;
    document.getElementById('transform-translateX-value').textContent = translateX + 'px';
    document.getElementById('transform-translateY-value').textContent = translateY + 'px';
    document.getElementById('transform-skewX-value').textContent = skewX + '°';

    const transform = `rotate(${rotate}deg) scaleX(${scaleX}) scaleY(${scaleY}) translateX(${translateX}px) translateY(${translateY}px) skewX(${skewX}deg)`;
    const css = `transform: ${transform};`;

    document.getElementById('transform-preview').style.transform = transform;
    document.getElementById('transform-output').textContent = css;
}

function resetTransform() {
    document.getElementById('transform-rotate').value = 0;
    document.getElementById('transform-scaleX').value = 1;
    document.getElementById('transform-scaleY').value = 1;
    document.getElementById('transform-translateX').value = 0;
    document.getElementById('transform-translateY').value = 0;
    document.getElementById('transform-skewX').value = 0;
    updateTransform();
}

// Text Shadow Generator
function updateTextShadow() {
    const x = document.getElementById('text-x').value;
    const y = document.getElementById('text-y').value;
    const blur = document.getElementById('text-blur').value;
    const color = document.getElementById('text-color').value;
    const opacity = document.getElementById('text-opacity').value / 100;
    const sampleText = document.getElementById('text-sample').value;

    document.getElementById('text-x-value').textContent = x + 'px';
    document.getElementById('text-y-value').textContent = y + 'px';
    document.getElementById('text-blur-value').textContent = blur + 'px';
    document.getElementById('text-opacity-value').textContent = document.getElementById('text-opacity').value + '%';

    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
    const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;

    const textShadow = `${x}px ${y}px ${blur}px ${rgba}`;
    const css = `text-shadow: ${textShadow};`;

    const preview = document.getElementById('text-preview');
    preview.style.textShadow = textShadow;
    preview.textContent = sampleText;

    document.getElementById('text-output').textContent = css;
}

// Animation Generator
function updateAnimation() {
    const type = document.getElementById('animation-type').value;
    const duration = document.getElementById('animation-duration').value;
    const timing = document.getElementById('animation-timing').value;
    const iteration = document.getElementById('animation-iteration').value;
    const direction = document.getElementById('animation-direction').value;

    document.getElementById('animation-duration-value').textContent = duration + 's';

    const animations = {
        bounce: `@keyframes bounce {
    0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
    40%, 43% { transform: translate3d(0,-30px,0); }
    70% { transform: translate3d(0,-15px,0); }
    90% { transform: translate3d(0,-4px,0); }
}`,
        pulse: `@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}`,
        shake: `@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
}`,
        rotate: `@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}`,
        fadeIn: `@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}`,
        slideIn: `@keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
}`
    };

    const css = `/* Keyframes */
${animations[type]}

/* Usage */
.element {
    animation: ${type} ${duration}s ${timing} ${iteration} ${direction};
}`;

    const preview = document.getElementById('animation-preview');
    preview.style.animation = 'none';
    void preview.offsetWidth;
    preview.style.animation = `${type} ${duration}s ${timing} ${iteration} ${direction}`;
    document.getElementById('animation-output').textContent = css;
}

// Filter Generator
function updateFilter() {
    const blur = document.getElementById('filter-blur').value;
    const brightness = document.getElementById('filter-brightness').value;
    const contrast = document.getElementById('filter-contrast').value;
    const saturate = document.getElementById('filter-saturate').value;
    const hue = document.getElementById('filter-hue').value;
    const grayscale = document.getElementById('filter-grayscale').value;

    document.getElementById('filter-blur-value').textContent = blur + 'px';
    document.getElementById('filter-brightness-value').textContent = brightness + '%';
    document.getElementById('filter-contrast-value').textContent = contrast + '%';
    document.getElementById('filter-saturate-value').textContent = saturate + '%';
    document.getElementById('filter-hue-value').textContent = hue + '°';
    document.getElementById('filter-grayscale-value').textContent = grayscale + '%';

    const filter = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) hue-rotate(${hue}deg) grayscale(${grayscale}%)`;
    const css = `filter: ${filter};`;

    document.getElementById('filter-preview').style.filter = filter;
    document.getElementById('filter-output').textContent = css;
}

function resetFilter() {
    document.getElementById('filter-blur').value = 0;
    document.getElementById('filter-brightness').value = 100;
    document.getElementById('filter-contrast').value = 100;
    document.getElementById('filter-saturate').value = 100;
    document.getElementById('filter-hue').value = 0;
    document.getElementById('filter-grayscale').value = 0;
    updateFilter();
}

// Glassmorphism Generator
function updateGlass() {
    const color = document.getElementById('glass-color').value;
    const opacity = document.getElementById('glass-opacity').value / 100;
    const blur = document.getElementById('glass-blur').value;
    const borderColor = document.getElementById('glass-border-color').value;
    const borderOpacity = document.getElementById('glass-border-opacity').value / 100;

    document.getElementById('glass-opacity-value').textContent = opacity;
    document.getElementById('glass-blur-value').textContent = blur + 'px';
    document.getElementById('glass-border-opacity-value').textContent = borderOpacity;

    const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const bgRgba = hexToRgba(color, opacity);
    const borderRgba = hexToRgba(borderColor, borderOpacity);

    const css = `/* Glassmorphism Effect */
background: ${bgRgba};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid ${borderRgba};`;

    const preview = document.getElementById('glass-preview');
    preview.style.background = bgRgba;
    preview.style.backdropFilter = `blur(${blur}px)`;
    preview.style.webkitBackdropFilter = `blur(${blur}px)`;
    preview.style.border = `1px solid ${borderRgba}`;

    document.getElementById('glass-output').textContent = css;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✓</span> ${message}`;
    document.body.appendChild(toast);
    void toast.offsetWidth;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    const button = event.target;
    const originalText = button.textContent;
    const originalClass = button.className;

    navigator.clipboard.writeText(text).then(() => {
        showToast('CSS Code copied to clipboard!');
        button.textContent = '✓ Copied!';
        if (!originalClass.includes('btn-')) {
            button.className = originalClass.replace(/btn-\w+/, 'btn-green');
        }
        setTimeout(() => {
            button.textContent = originalText;
            button.className = originalClass;
        }, 2000);
    }).catch(err => {
        console.error('Copy failed:', err);
        showToast('Failed to copy');
    });
}

//  CONNECTING JS TO HTML
// ==========================================
window.loginWithGoogle = loginWithGoogle;
window.logout = logout;
window.saveSnippet = saveSnippet;
window.deleteSnippet = deleteSnippet;
window.openLibrary = openLibrary;
window.closeLibrary = closeLibrary;
window.showGenerator = showGenerator;
window.updateGradient = updateGradient;
window.updateShadow = updateShadow;
window.updateBorder = updateBorder;
window.syncBorderRadius = syncBorderRadius;
window.resetBorderRadius = resetBorderRadius;
window.updateFlexbox = updateFlexbox;
window.updateTransform = updateTransform;
window.resetTransform = resetTransform;
window.updateTextShadow = updateTextShadow;
window.updateAnimation = updateAnimation;
window.updateFilter = updateFilter;
window.resetFilter = resetFilter;
window.updateGlass = updateGlass;
window.copyToClipboard = copyToClipboard;
window.toggleTheme = toggleTheme;