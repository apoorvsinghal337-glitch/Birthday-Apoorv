
let uploadedImagesArray = [];

document.getElementById('user-images').addEventListener('change', function(e) {
    uploadedImagesArray = []; 
    const files = e.target.files;
    for(let i=0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = function(event) { uploadedImagesArray.push(event.target.result); };
        reader.readAsDataURL(files[i]);
    }
});

document.getElementById('generate-btn').addEventListener('click', () => {
    const text = document.getElementById('user-text').value || "Happy Birthday!";
    const anim = document.getElementById('user-animation').value;
    const pass = document.getElementById('user-pass').value.trim();
    const customMusic = document.getElementById('user-music-url').value.trim();
    const music = customMusic !== "" ? customMusic : "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme.mp3";

    if (uploadedImagesArray.length === 0) {
        alert("Please upload at least 2 to 5 birthday photos! 📸");
        return;
    }

    const bundleData = { t: text, a: anim, p: pass, m: music, imgs: uploadedImagesArray };
    const stringified = JSON.stringify(bundleData);
    const encoded = btoa(unescape(encodeURIComponent(stringified)));

    const finalShareUrl = window.location.origin + window.location.pathname + "?surprise=" + encoded;
    document.getElementById('share-url').value = finalShareUrl;
    document.getElementById('generated-link-area').classList.remove('hidden');
});

document.getElementById('copy-btn').addEventListener('click', () => {
    const shareInput = document.getElementById('share-url');
    shareInput.select();
    navigator.clipboard.writeText(shareInput.value);
    alert("Interactive Blockbuster Link copied! Share via WhatsApp now 📲");
});

let globalCardData = null;
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const surpriseParam = urlParams.get('surprise');

    if (surpriseParam) {
        document.getElementById('setup-form').classList.add('hidden');
        try {
            const decoded = decodeURIComponent(escape(atob(surpriseParam)));
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
            alert("Corrupt or invalid custom surprise link!");
            document.getElementById('setup-form').classList.remove('hidden');
        }
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
