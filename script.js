let uploadedImagesArray = [];
let uploadedAudioData = "";

// 📸 Photo Compressor & Loader
document.getElementById('user-images').addEventListener('change', function(e) {
    uploadedImagesArray = []; 
    const files = e.target.files;
    
    if (files.length > 5) {
        alert("Bhai, max 5 photos hi select karo! 🙏");
        e.target.value = "";
        return;
    }

    for(let i=0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxSize = 200; // Super optimized compression
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxSize) { height *= maxSize / width; width = maxSize; }
                } else {
                    if (height > maxSize) { width *= maxSize / height; height = maxSize; }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.4); 
                uploadedImagesArray.push(compressedBase64);
            };
        };
        reader.readAsDataURL(files[i]);
    }
});

// 🎵 Audio Upload Handler
document.getElementById('user-audio-file').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) { 
            alert("Bhai, audio file 2MB se choti rakhein.");
            e.target.value = "";
            return;
        }
        const reader = new FileReader();
        reader.onload = function(event) {
            uploadedAudioData = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// 🚀 Magic Link Generator Engine (Strictly Offline & Clean)
document.getElementById('generate-btn').addEventListener('click', () => {
    const text = document.getElementById('user-text').value || "Happy Birthday!";
    const anim = document.getElementById('user-animation').value;
    const pass = document.getElementById('user-pass').value.trim();
    const music = uploadedAudioData !== "" ? uploadedAudioData : "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme.mp3";

    if (uploadedImagesArray.length === 0) {
        alert("Pehle kam se kam ek photo select karo bhai! 📸");
        return;
    }

    try {
        const bundleData = { t: text, a: anim, p: pass, m: music, imgs: uploadedImagesArray };
        const stringified = JSON.stringify(bundleData);
        const encoded = btoa(unescape(encodeURIComponent(stringified)));

        // Clean link construction without extra garbage characters
        const finalShareUrl = window.location.origin + window.location.pathname + "?by=A.S&surprise=" + encoded;
        
        document.getElementById('share-url').value = finalShareUrl;
        
        const linkArea = document.getElementById('generated-link-area');
        linkArea.classList.remove('hidden');
        
        // Manual Shortener Guide Box Injector
        let helperDiv = document.getElementById('helper-shortener');
        if(!helperDiv) {
            helperDiv = document.createElement('div');
            helperDiv.id = 'helper-shortener';
            helperDiv.style.marginTop = "15px";
            helperDiv.style.padding = "12px";
            helperDiv.style.background = "rgba(255,255,255,0.08)";
            helperDiv.style.borderRadius = "10px";
            linkArea.appendChild(helperDiv);
        }
        helperDiv.innerHTML = `
            <p style="font-size:0.85rem; color:#f43f5e; font-weight:bold; margin-bottom:8px;">🎯 LINK READY (INSTAGRAM & WHATSAPP SAFE):</p>
            <a href="https://tinyurl.com/" target="_blank" style="display:inline-block; text-decoration:none; background:#10b981; font-size:0.85rem; padding:10px 15px; font-weight:bold; border-radius:5px; color:#fff; border:none; cursor:pointer;">Open Free Shortener Website 🌐</a>
            <p style="font-size:0.75rem; color:#cbd5e1; line-height:1.4; margin-top:8px;">
                1. Pehle upar wala <b>"Copy Magic Link"</b> button dabao.<br>
                2. Phir is hare button par click karke khule page par link paste karo aur <b>Make TinyURL!</b> par click kar do.<br>
                3. Wahan se mili choti link ko WhatsApp par bhejo, ek dum makkhan chalega!
            </p>
        `;
        
        linkArea.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        alert("Data processing mein dikkat aayi, please firse photo select karein.");
        console.error(error);
    }
});

// 📋 Copy Button Box
document.getElementById('copy-btn').addEventListener('click', () => {
    const shareInput = document.getElementById('share-url');
    shareInput.select();
    shareInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(shareInput.value);
    alert("Bada Link Copy Ho Gaya! Ab niche hare button par click karke ise chota kar lijiye. 📲");
});

// 🔍 SMART DECODER: Removes any bad whitespace added by social media platforms
let globalCardData = null;
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    let surpriseParam = urlParams.get('surprise');

    if (!surpriseParam || surpriseParam.trim() === "") {
        document.getElementById('setup-form').classList.remove('hidden');
        return;
    }

    document.getElementById('setup-form').classList.add('hidden');
    try {
        let cleanBase64 = surpriseParam.replace(/[\s\n\r]/g, '').trim();
        const decoded = decodeURIComponent(escape(atob(cleanBase64)));
        globalCardData = JSON.parse(decoded);

        if (globalCardData.p && globalCardData.p !== "") {
            document.getElementById('lock-screen').classList.remove('hidden');
            document.getElementById('unlock-btn').onclick = () => {
                if (document.getElementById('unlock-input').value.trim() === globalCardData.p) {
                    document.getElementById('lock-screen').classList.add('hidden');
                    startInteractiveStory();
                } else { alert("Wrong Passcode! ❌"); }
            };
        } else { startInteractiveStory(); }
    } catch(e) {
        console.log("Silent fallback active.");
        document.getElementById('setup-form').classList.remove('hidden');
    }
});

function startInteractiveStory() {
    document.getElementById('stage-welcome').classList.remove('hidden');
    document.getElementById('start-journey-btn').onclick = () => {
        document.getElementById('stage-welcome').classList.add('hidden');
        triggerCakeCuttingStage();
    };
}

function triggerCakeCuttingStage() {
    const stageCake = document.getElementById('stage-cake');
    stageCake.classList.remove('hidden');

    const cakeWrapper = document.querySelector('.cake-wrapper');
    cakeWrapper.onclick = () => {
        document.getElementById('cake-whole').classList.add('cake-cut');
        document.getElementById('cake-knife').style.transform = "translate(-30px, 45px) rotate(-90deg)";
        document.getElementById('cake-whole').innerText = "🍰";
        
        document.getElementById('birthdayMusic').src = globalCardData.m;
        document.getElementById('birthdayMusic').play().catch(e => console.log(e));

        setTimeout(() => { document.getElementById('cake-next-btn').classList.remove('hidden'); }, 800);
    };

    document.getElementById('cake-next-btn').onclick = () => {
        stageCake.classList.add('hidden');
        triggerBalloonPopGameStage();
    };
}

let currentScore = 0;
let gameInterval = null;
function triggerBalloonPopGameStage() {
    document.getElementById('stage-balloons').classList.remove('hidden');
    const gameArea = document.getElementById('game-area');

    gameInterval = setInterval(() => {
        if (currentScore >= 5) {
            clearInterval(gameInterval);
            document.getElementById('stage-balloons').classList.add('hidden');
            renderFinalShowcaseCard();
            return;
        }

        const balloon = document.createElement('div');
        balloon.className = 'game-balloon';
        balloon.innerText = '🎈';
        balloon.style.left = Math.random() * 85 + 'vw';
        
        balloon.onclick = () => {
            currentScore++;
            document.getElementById('pop-score').innerText = currentScore;
            balloon.innerText = '💥';
            setTimeout(() => balloon.remove(), 150);
        };

        gameArea.appendChild(balloon);
        setTimeout(() => balloon.remove(), 4000);
    }, 900);
}

function renderFinalShowcaseCard() {
    const finalCard = document.getElementById('birthday-card');
    finalCard.classList.remove('hidden');

    const gallery = document.getElementById('photo-gallery');
    gallery.innerHTML = "";
    globalCardData.imgs.forEach(base64Source => {
        const imageDOM = document.createElement('img');
        imageDOM.src = base64Source;
        gallery.appendChild(imageDOM);
    });

    document.getElementById('display-msg').innerText = globalCardData.t;
    setInterval(() => { startCustomAnimation(globalCardData.a); }, 1000);
}

function startCustomAnimation(type) {
    const container = document.getElementById('animation-container');
    let symbols = [];
    if (type === 'balloons') symbols = ['🎈', '🎈'];
    if (type === 'confetti') symbols = ['🎉', '✨', '🟡', '🟩', '🟥'];
    if (type === 'stars') symbols = ['⭐', '🌟', '✨'];
    if (type === 'hearts') symbols = ['❤️', '💖', '💝'];
    if (type === 'flowers') symbols = ['🌸', '🌹', '🌺'];
    if (type === 'butterflies') symbols = ['🦋', '✨'];

    const element = document.createElement('div');
    element.classList.add('element');
    element.innerText = symbols[Math.floor(Math.random() * symbols.length)];
    element.style.left = Math.random() * 100 + 'vw';
    element.style.fontSize = (Math.random() * 25 + 24) + 'px';
    element.style.animationDuration = (4 + Math.random() * 3) + 's';
    container.appendChild(element);
    setTimeout(() => { element.remove(); }, 6500);
                        }
                                           
