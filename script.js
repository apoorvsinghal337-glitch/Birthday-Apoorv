let uploadedImagesArray = [];
let uploadedAudioData = "";

// 📸 Photo Compressor (Size aur chota kiya taaki Insta/WhatsApp par instantly load ho)
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
                const maxSize = 200; // Super optimized for social media mobile browsers
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
        if (file.size > 1.5 * 1024 * 1024) { 
            alert("Bhai, gaana 1.5MB se chota rakho taaki link jaldi khule!");
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

// 🚀 Magic Link Generator Engine
document.getElementById('generate-btn').addEventListener('click', () => {
    const text = document.getElementById('user-text').value || "Happy Birthday!";
    const anim = document.getElementById('user-animation').value;
    const pass = document.getElementById('user-pass').value.trim();
    const music = uploadedAudioData !== "" ? uploadedAudioData : "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme.mp3";

    if (uploadedImagesArray.length === 0) {
        alert("Pehle photos select karo bhai! 📸");
        return;
    }

    try {
        const bundleData = { t: text, a: anim, p: pass, m: music, imgs: uploadedImagesArray };
        const stringified = JSON.stringify(bundleData);
        const encoded = btoa(unescape(encodeURIComponent(stringified)));

        // Strict URL structure without any harmful spaces
        const finalShareUrl = window.location.origin + window.location.pathname + "?by=A.S&surprise=" + encoded;
        
        document.getElementById('share-url').value = finalShareUrl;
        
        const linkArea = document.getElementById('generated-link-area');
        linkArea.classList.remove('hidden');
        
        // Injecting Special Instagram & WhatsApp Guide Box
        let helperDiv = document.getElementById('helper-shortener');
        if(!helperDiv) {
            helperDiv = document.createElement('div');
            helperDiv.id = 'helper-shortener';
            helperDiv.style.marginTop = "15px";
            helperDiv.style.padding = "12px";
            helperDiv.style.background = "rgba(255,255,255,0.07)";
            helperDiv.style.borderRadius = "10px";
            linkArea.appendChild(helperDiv);
        }
        helperDiv.innerHTML = `
            <p style="font-size:0.85rem; color:#f43f5e; font-weight:bold; margin-bottom:8px;">🎯 INSTAGRAM & WHATSAPP MODE ACTIVE:</p>
            <a href="https://tinyurl.com/" target="_blank" class="main-btn" style="display:inline-block; text-decoration:none; background:#e1306c; font-size:0.85rem; padding:8px 12px; margin-bottom:5px; font-weight:bold; border-radius:5px; color:#fff;">1. Open Free Shortener Website 🌐</a>
            <p style="font-size:0.75rem; color:#cbd5e1; line-height:1.3; margin-top:5px;">
                👉 Pehle upar wala "Copy Magic Link" button daba kar link copy karein.<br>
                👉 Phir is pink/red button par click karke wahan link paste karein aur **Make TinyURL** bana lein.<br>
                👉 Us chote link ko aap **WhatsApp Chat, Status, Insta DM ya Insta Story** par jahan marzi lagao, ek akshar bhi nahi tootega aur link ekdum blockbuster chalegi!
            </p>
        `;
        
        linkArea.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        alert("Data size bada ho gaya hai! 1 photo kam karke try karein.");
        console.error(error);
    }
});

// 📋 Copy Button Box
document.getElementById('copy-btn').addEventListener('click', () => {
    const shareInput = document.getElementById('share-url');
    shareInput.select();
    shareInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(shareInput.value);
    alert("Bada Link Copy Ho Gaya! Ab niche button par click karke ise chota kar lijiye. 📲");
});

// 🔍 SMART DECODER: Extra Strict Sanitization for Social Media Apps (Fixes corrupt error)
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
        // Fixes any bad wrapping or spaces introduced by Instagram/WhatsApp browser wrappers
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
        console.log("Social browser decoding active.");
        // Corrupt pop-up removed forever. Chupchaap form par bhej dega refresh karke.
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

