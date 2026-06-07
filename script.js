document.getElementById('wishBtn').addEventListener('click', () => {
    // 🎵 Music play karne ke liye logic
    const music = document.getElementById('birthdayMusic');
    music.play().catch(error => { console.log("Audio error:", error); });

    // 🎈 Balloons udane ka logic
    const container = document.getElementById('balloon-container');
    const colors = ['#ff477e', '#ff7096', '#ff85a1', '#70e000', '#00b4d8', '#ffb703', '#fb8500'];

    for (let i = 0; i < 30; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomLeft = Math.random() * 100;
        const randomDelay = Math.random() * 1.5;
        const randomDuration = 3 + Math.random() * 3;

        balloon.style.backgroundColor = randomColor;
        balloon.style.left = randomLeft + 'vw';
        balloon.style.animationDelay = randomDelay + 's';
        balloon.style.animationDuration = randomDuration + 's';
        container.appendChild(balloon);

        setTimeout(() => { balloon.remove(); }, (randomDelay + randomDuration) * 1000);
    }
});

