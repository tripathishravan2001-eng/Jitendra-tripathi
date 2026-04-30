// Admin Dashboard Logic

// --- Authentication ---
// Get admins from local storage or set default
function getAdmins() {
    const stored = localStorage.getItem('panditjiAdmins');
    if (stored) return JSON.parse(stored);
    const defaultAdmins = [{ username: 'admin', password: 'admin 2026' }];
    localStorage.setItem('panditjiAdmins', JSON.stringify(defaultAdmins));
    return defaultAdmins;
}

function saveAdmins(admins) {
    localStorage.setItem('panditjiAdmins', JSON.stringify(admins));
}

function checkAuth() {
    if (sessionStorage.getItem('adminAuth') === 'true') {
        if (!sessionStorage.getItem('adminUser')) {
            sessionStorage.setItem('adminUser', 'admin');
        }
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('dashboardContent').style.display = 'block';
        renderAdminsList();
    }
}

function attemptLogin() {
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    const errorEl = document.getElementById('loginError');
    
    const admins = getAdmins();
    const validAdmin = admins.find(a => a.username === user && a.password === pass);
    
    if (validAdmin) {
        sessionStorage.setItem('adminAuth', 'true');
        sessionStorage.setItem('adminUser', user);
        errorEl.textContent = '';
        const overlay = document.getElementById('loginOverlay');
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            document.getElementById('dashboardContent').style.display = 'block';
            renderAdminsList();
        }, 500);
    } else {
        errorEl.textContent = 'Invalid username or password.';
    }
}

function changeAdminPassword() {
    const currentPass = document.getElementById('secCurrentPass').value;
    const newPass = document.getElementById('secNewPass').value;
    const currentUser = sessionStorage.getItem('adminUser');
    
    const admins = getAdmins();
    const adminIndex = admins.findIndex(a => a.username === currentUser);
    
    if (adminIndex === -1) {
        alert('Error: Current user session not found. Please log out and log in again.');
        return;
    }
    
    if (admins[adminIndex].password !== currentPass) {
        alert('Current password is incorrect!');
        return;
    }
    
    if (newPass.length < 4) {
        alert('New password must be at least 4 characters long.');
        return;
    }
    
    admins[adminIndex].password = newPass;
    saveAdmins(admins);
    
    document.getElementById('secCurrentPass').value = '';
    document.getElementById('secNewPass').value = '';
    
    showToast();
    alert('Password updated successfully!');
}

function addNewAdmin() {
    const newUser = document.getElementById('newAdminUser').value.trim();
    const newPass = document.getElementById('newAdminPass').value;
    
    if (!newUser || !newPass) {
        alert('Please fill out both username and password.');
        return;
    }
    
    const admins = getAdmins();
    if (admins.find(a => a.username === newUser)) {
        alert('An admin with this username already exists!');
        return;
    }
    
    admins.push({ username: newUser, password: newPass });
    saveAdmins(admins);
    
    document.getElementById('newAdminUser').value = '';
    document.getElementById('newAdminPass').value = '';
    
    renderAdminsList();
    showToast();
}

function removeAdmin(username) {
    const currentUser = sessionStorage.getItem('adminUser');
    if (username === currentUser) {
        alert('You cannot remove yourself while logged in!');
        return;
    }
    
    if (confirm(`Are you sure you want to remove admin "${username}"?`)) {
        let admins = getAdmins();
        admins = admins.filter(a => a.username !== username);
        saveAdmins(admins);
        renderAdminsList();
        showToast();
    }
}

function renderAdminsList() {
    const admins = getAdmins();
    const listEl = document.getElementById('adminListDisplay');
    if (!listEl) return;
    
    listEl.innerHTML = '';
    const currentUser = sessionStorage.getItem('adminUser');
    
    admins.forEach(admin => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.background = 'var(--bg)';
        li.style.padding = '10px 16px';
        li.style.borderRadius = '8px';
        li.style.border = '1px solid var(--border)';
        
        let label = `<strong>${admin.username}</strong>`;
        if (admin.username === currentUser) {
            label += ' <span style="font-size: 0.8rem; color: var(--primary);">(You)</span>';
        }
        
        let removeBtn = '';
        if (admin.username !== currentUser) {
            removeBtn = `<button onclick="removeAdmin('${admin.username}')" style="background: none; border: none; color: #d32f2f; cursor: pointer; font-weight: bold;">Remove</button>`;
        }
        
        li.innerHTML = `<span>${label}</span> ${removeBtn}`;
        listEl.appendChild(li);
    });
}

function handleLoginKey(e) {
    if (e.key === 'Enter') {
        attemptLogin();
    }
}

function toggleGenericPass(inputId, btnElement) {
    const passInput = document.getElementById(inputId);
    const eyeSpan = btnElement.querySelector('span');
    if (passInput.type === 'password') {
        passInput.type = 'text';
        if(eyeSpan) eyeSpan.textContent = '🙈';
    } else {
        passInput.type = 'password';
        if(eyeSpan) eyeSpan.textContent = '👁️';
    }
}

// Check auth on load
checkAuth();

const defaultSettings = {
    tagline: "Bringing Divine Blessings<br>to Your Life",
    intro: "Experienced Pujari, Kathavachak & Astrologer",
    aboutText: "Pandit Jeetendra Tripathi is a highly experienced spiritual guide specializing in Vedic rituals, Kathas, astrology, and vastu consultation.",
    aboutSubText: "With over 5+ years of devoted practice, Panditji has guided hundreds of families through sacred ceremonies, bringing peace, prosperity, and divine blessings into their lives. Rooted in the rich Vedic tradition, his work bridges ancient scripture with the needs of modern families.",
    expYears: "5",
    familiesServed: "500",
    ritualsPerformed: "150",
    phoneNumber: "+91 XXXXX XXXXX",
    whatsappNumber: "91XXXXXXXXXX",
    locationText: "Available Across India",
    linkFacebook: "#",
    linkInstagram: "https://www.instagram.com/tripathijitendra15?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    linkYoutube: "https://youtube.com/@adhyatmpath01?si=Qi2Q-jA7NlkwaRmE",
    aboutImage: "", // Default is empty, falls back to original image
    galleryImages: [
        "jal 6.jpg", "jal.jpg", "jal1.jpg", "jal2.jpg", 
        "jal3.jpg", "jal4.jpg", "jal5.jpg", "jal8.png"
    ]
};

let currentSettings = {};

function renderGalleryAdmin() {
    const list = document.getElementById('galleryAdminList');
    list.innerHTML = '';
    currentSettings.galleryImages.forEach((src, index) => {
        const div = document.createElement('div');
        div.style.position = 'relative';
        div.style.width = '100px';
        div.style.height = '100px';
        
        const img = document.createElement('img');
        img.src = src;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';
        img.style.border = '1px solid var(--border)';
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✕';
        removeBtn.style.position = 'absolute';
        removeBtn.style.top = '-5px';
        removeBtn.style.right = '-5px';
        removeBtn.style.background = 'red';
        removeBtn.style.color = 'white';
        removeBtn.style.border = 'none';
        removeBtn.style.borderRadius = '50%';
        removeBtn.style.width = '24px';
        removeBtn.style.height = '24px';
        removeBtn.style.cursor = 'pointer';
        
        removeBtn.onclick = function() {
            currentSettings.galleryImages.splice(index, 1);
            renderGalleryAdmin();
            // Automatically save when an image is removed so they don't have to hit save
            saveSettings(false); 
        };
        
        div.appendChild(img);
        div.appendChild(removeBtn);
        list.appendChild(div);
    });
}

// Load settings from localStorage
function loadSettings() {
    const saved = localStorage.getItem('panditjiSettings');
    if (saved) {
        currentSettings = { ...defaultSettings, ...JSON.parse(saved) };
    } else {
        currentSettings = { ...defaultSettings };
    }
    
    // Populate form
    document.getElementById('tagline').value = currentSettings.tagline;
    document.getElementById('intro').value = currentSettings.intro;
    document.getElementById('aboutText').value = currentSettings.aboutText;
    document.getElementById('aboutSubText').value = currentSettings.aboutSubText;
    document.getElementById('expYears').value = currentSettings.expYears;
    document.getElementById('familiesServed').value = currentSettings.familiesServed;
    document.getElementById('ritualsPerformed').value = currentSettings.ritualsPerformed;
    document.getElementById('phoneNumber').value = currentSettings.phoneNumber;
    document.getElementById('whatsappNumber').value = currentSettings.whatsappNumber;
    document.getElementById('locationText').value = currentSettings.locationText;
    document.getElementById('linkFacebook').value = currentSettings.linkFacebook || '';
    document.getElementById('linkInstagram').value = currentSettings.linkInstagram || '';
    document.getElementById('linkYoutube').value = currentSettings.linkYoutube || '';

    // Show image preview if exists
    if (currentSettings.aboutImage) {
        const imgPreview = document.getElementById('aboutImagePreview');
        imgPreview.src = currentSettings.aboutImage;
        imgPreview.style.display = 'block';
    }

    renderGalleryAdmin();
}

// Handle Image Upload
document.getElementById('aboutImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const base64String = event.target.result;
        currentSettings.aboutImage = base64String;
        
        const imgPreview = document.getElementById('aboutImagePreview');
        imgPreview.src = base64String;
        imgPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
});

// Handle Gallery Image Upload
document.getElementById('newGalleryImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const base64String = event.target.result;
        if(!currentSettings.galleryImages) {
            currentSettings.galleryImages = [];
        }
        currentSettings.galleryImages.push(base64String);
        renderGalleryAdmin();
        saveSettings(false); // Auto-save when an image is added
        
        // Reset file input
        document.getElementById('newGalleryImage').value = '';
    };
    reader.readAsDataURL(file);
});

// Save settings to localStorage
function saveSettings(showMsg = true) {
    currentSettings.tagline = document.getElementById('tagline').value;
    currentSettings.intro = document.getElementById('intro').value;
    currentSettings.aboutText = document.getElementById('aboutText').value;
    currentSettings.aboutSubText = document.getElementById('aboutSubText').value;
    currentSettings.expYears = document.getElementById('expYears').value;
    currentSettings.familiesServed = document.getElementById('familiesServed').value;
    currentSettings.ritualsPerformed = document.getElementById('ritualsPerformed').value;
    currentSettings.phoneNumber = document.getElementById('phoneNumber').value;
    currentSettings.whatsappNumber = document.getElementById('whatsappNumber').value;
    currentSettings.locationText = document.getElementById('locationText').value;
    currentSettings.linkFacebook = document.getElementById('linkFacebook').value;
    currentSettings.linkInstagram = document.getElementById('linkInstagram').value;
    currentSettings.linkYoutube = document.getElementById('linkYoutube').value;

    localStorage.setItem('panditjiSettings', JSON.stringify(currentSettings));
    
    if(showMsg !== false) {
        showToast();
    }
}

function resetDefaults() {
    if(confirm("Are you sure you want to reset all content to the original defaults?")) {
        localStorage.removeItem('panditjiSettings');
        currentSettings = { ...defaultSettings };
        currentSettings.galleryImages = [...defaultSettings.galleryImages];
        
        loadSettings();
        const imgPreview = document.getElementById('aboutImagePreview');
        if (imgPreview) {
            imgPreview.src = "";
            imgPreview.style.display = 'none';
        }
        const imgInput = document.getElementById('aboutImage');
        if (imgInput) {
            imgInput.value = "";
        }
        showToast("Reset to defaults!");
    }
}

function showToast(msg = "Changes saved successfully!") {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSettings);
} else {
    loadSettings();
}
