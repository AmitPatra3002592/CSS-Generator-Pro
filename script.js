//  FIREBASE CONFIGURATION & IMPORTS
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyApQ9al9OGiFUTrD26XLKT6Nav0Jr7lwjA",
    authDomain: "css-generator-pro.firebaseapp.com",
    projectId: "css-generator-pro",
    storageBucket: "css-generator-pro.firebasestorage.app",
    messagingSenderId: "543151556319",
    appId: "1:543151556319:web:e37e7fee2c7f5392dc8b6a",
    measurementId: "G-1NF39XDSBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// --- Login Function ---
async function loginWithGoogle() {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed: " + error.message);
    }
}

// --- Logout Function ---
function logout() {
    signOut(auth).then(() => {
        alert("Logged out!");
    }).catch((error) => {
        console.error("Logout error", error);
    });
}

// --- Check Login State ---
onAuthStateChanged(auth, (user) => {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const userPic = document.getElementById('user-pic');

    if (user) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = 'none';
        if (userInfo) userInfo.style.display = 'flex';
        if (userPic) userPic.src = user.photoURL;
    } else {
        // User is logged out
        if (loginBtn) loginBtn.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
    }
});

// GENERATOR CODE
// ==========================================

// Show/Hide generators and update active button
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

    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Initialize the selected generator
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

    // Update value displays
    document.getElementById('shadow-x-value').textContent = x + 'px';
    document.getElementById('shadow-y-value').textContent = y + 'px';
    document.getElementById('shadow-blur-value').textContent = blur + 'px';
    document.getElementById('shadow-spread-value').textContent = spread + 'px';
    document.getElementById('shadow-opacity-value').textContent = document.getElementById('shadow-opacity').value + '%';

    // Convert hex to rgba
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

    // Update value displays
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

    // Update value displays
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

    // Update value displays
    document.getElementById('text-x-value').textContent = x + 'px';
    document.getElementById('text-y-value').textContent = y + 'px';
    document.getElementById('text-blur-value').textContent = blur + 'px';
    document.getElementById('text-opacity-value').textContent = document.getElementById('text-opacity').value + '%';

    // Convert hex to rgba
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

    // Update value displays
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

    // Update displays
    document.getElementById('glass-opacity-value').textContent = opacity;
    document.getElementById('glass-blur-value').textContent = blur + 'px';
    document.getElementById('glass-border-opacity-value').textContent = borderOpacity;

    // Helper to hex to rgba
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

// Toast Notification Function
function showToast(message) {
    // Create the toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✓</span> ${message}`;
    document.body.appendChild(toast);

    // Trigger reflow to enable transition
    void toast.offsetWidth;
    toast.classList.add('show');

    // Hide and remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300); // Fade out transition
    }, 3000);
}

// Copy to Clipboard Function
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    const button = event.target;
    const originalText = button.textContent;
    const originalClass = button.className;

    // Try the modern Clipboard API first
    navigator.clipboard.writeText(text).then(() => {
        showToast('CSS Code copied to clipboard!');

        // Update button text using the captured 'button' variable
        button.textContent = '✓ Copied!';

        // Only change color if it's not already a specific style
        if (!originalClass.includes('btn-')) {
            button.className = originalClass.replace(/btn-\w+/, 'btn-green');
        }

        // Reset button after 2 seconds
        setTimeout(() => {
            button.textContent = originalText;
            button.className = originalClass;
        }, 2000);

    }).catch(err => {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('CSS Code copied to clipboard!');

            button.textContent = '✓ Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        } catch (fallbackErr) {
            console.error('Copy failed:', fallbackErr);
            showToast('Failed to copy. Please copy manually.');
        }
    });
}

// Initialize with gradient generator
document.addEventListener('DOMContentLoaded', function () {
    showGenerator('gradient');
    // Ensure the first button marks as active if not already
    const firstBtn = document.querySelector('.nav-button');
    if (firstBtn && !document.querySelector('.nav-button.active')) {
        firstBtn.classList.add('active');
    }
});

// --- DARK MODE ---

function toggleTheme() {
    const body = document.body;
    const button = document.getElementById('theme-toggle');
    body.classList.toggle('dark-mode');

    // Check if dark mode is now ON or OFF
    const isDark = body.classList.contains('dark-mode');

    // Update Button Icon
    button.textContent = isDark ? '☀️' : '🌙';

    // Save preference to Local Storage so it remembers on refresh
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Check Local Storage on page load
document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('theme');
    const button = document.getElementById('theme-toggle');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (button) button.textContent = '☀️';
    }
});

// CONNECTING JS TO HTML
// ==========================================
window.loginWithGoogle = loginWithGoogle;
window.logout = logout;
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