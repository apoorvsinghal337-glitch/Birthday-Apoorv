let uploadedImgData = "";
let secretPasscode = "";
let savedText = "";
let savedMusic = "";
let savedAnim = "";
let savedSigData = "";

// 🎨 Canvas Setup (Signature tracking)
const canvas = document.getElementById('sig-canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

function getMousePos(canvasDom, touchOrMouseEvent) {
    const rect = canvasDom.getBoundingClientRect();
    const clientX = touchOrMouseEvent.touches ? touchOrMouseEvent.touches[0].clientX : touchOrMouseEvent.clientX;
    const clientY = touchOrMouseEvent.touches ? touchOrMouseEvent.touches[0].clientY : touchOrMouseEvent.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
}

function startDrawing(e) {
    drawing = true;
    const pos = getMousePos(canvas, e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    e.preventDefault();
}

function draw(e) {
    if (!drawing) return;
    const pos = getMousePos(canvas, e);
    ctx.lineTo(pos.x, pos.y);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ff477e";
    ctx.stroke();
    e.preventDefault();
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', () => drawing = false);

document.getElementById('clear-sig-btn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// 📸 Photo Selector Logic
document.getElementById('user-image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) { uploadedImgData = event.target.result; };
        reader.readAsDataURL(file);
    }
});

// 🚀 Magic Link Logic Trigger
document.getElementById('generate-btn').addEventListener('click', () => {
    savedText = document.getElementById('user-text').value || "Happy Birthday!";
    savedMusic = document.getElementById('user-music').value;
    savedAnim = document.getElementById('user-animation').value;
    secretPasscode = document.getElementById('user-pass').value.trim();
    
    const blank = document.createElement('canvas');
    blank.width = canvas.width; blank.height = canvas.height;
    if (canvas.toDataURL() !== blank.toDataURL()) {
        savedSigData = canvas.toDataURL();
    }

    if (!uploadedImgData) {
        alert("Please upload an image first!");
        return;
    }

    document.getElementById('setup-form').classList.add('hidden');

    // Custom Optional Password check
    if (secretPasscode !== "") {
        document.getElementById('lock-screen').classList.remove('hidden');
    } else {
        showFinalCard();
    }
});

// 🔓 Password Screen Trigger
document.getElementById('unlock-btn').addEventListener('click', () => {
    const inputVal = document.getElementById('unlock-input').value.trim();
    if (inputVal === secretPasscode) {
        document.getElementById('lock-screen').classList.add('hidden');
        showFinalCard();
    } else {
        alert("Wrong passcode! Try again ❌");
    }
});

function showFinalCard() {
    const bdayCard = document.getElementById('birthday-card');
    bdayCard.classList.remove('hidden');

    document.getElementById('display-pic').src = uploadedImgData;
    document.getElementById('display-msg').innerText = savedText;
    document.getElementById('birthdayMusic').src = savedMusic;

    if (savedSigData) {
        const sigImg = document.getElementById('display-sig');
        sigImg.src = savedSigData;
        sigImg.style.display = "inline-block";
    }

    document.getElementById('wishBtn').addEventListener('click', () => {
        document.getElementById('birthdayMusic').play().catch(e => console.log(e));
        startCustomAnimation(savedAnim);
    });
}

// 🎈 Multi Animation Selector (7 Options)
function startCustomAnimation(type) {
    const container = document.getElementById('animation-container');
    container.innerHTML = ""; 
    
    let symbols = [];
    if (type === 'balloons') symbols = ['🎈', '🎈'];
    if (type === 'confetti') symbols = ['🎉', '✨', '🟡', '🟩'];
    if (type === 'stars') symbols = ['⭐', '🌟', '✨'];
    if (type === 'hearts') symbols = ['❤️', '💖', '💝'];
    if (type === 'flowers') symbols = ['🌸', '🌹', '🌺'];
    if (type === 'butterflies') symbols = ['🦋', '✨'];
    if (type === 'cupcakes') symbols = ['🧁', '🎂'];

    for (let i = 0; i < 45; i++) {
        const element = document.createElement('div');
        element.classList.add('element');
        element.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        element.style.left = Math.random() * 100 + 'vw';
        element.style.fontSize = (Math.random() * 25 + 20) + 'px';
        element.style.animationDelay = Math.random() * 2.5 + 's';
        element.style.animationDuration = (3.5 + Math.random() * 3) + 's';
        container.appendChild(element);
        setTimeout(() => { element.remove(); }, 6500);
    }
}

