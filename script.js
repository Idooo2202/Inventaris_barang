document.addEventListener("DOMContentLoaded", () => {
    
    // Elements
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const blobs = document.querySelectorAll('.aurora-blob');
    const brutalLayers = document.querySelectorAll('.brutal-layer');
    const scrollElements = document.querySelectorAll('.scroll-trigger');

    // State
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let blobX = mouseX;
    let blobY = mouseY;

    // 1. GLOBAL MOUSE TRACKER
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant dot movement
        if(cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    // 2. ANIMATION LOOP (Runs every frame ~60fps)
    function animate() {
        // A. Smooth Cursor
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        if(cursorRing) {
            cursorRing.style.left = `${cursorX}px`;
            cursorRing.style.top = `${cursorY}px`;
        }

        // B. Liquid Aurora Follower
        blobX += (mouseX - blobX) * 0.05; // Lebih lambat biar kerasa "cair"
        blobY += (mouseY - blobY) * 0.05;

        blobs.forEach((blob, i) => {
            const offset = (i + 1) * 50;
            // Gunakan transform3d untuk GPU acceleration
            blob.style.transform = `translate3d(${blobX - window.innerWidth/2 + offset}px, ${blobY - window.innerHeight/2 + offset}px, 0)`;
        });

        // C. Brutal 3D Parallax (Desktop Only)
        if (window.innerWidth > 768) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            // Kalkulasi jarak dari tengah (-1 sampai 1)
            const distX = (cursorX - centerX) / centerX;
            const distY = (cursorY - centerY) / centerY;

            brutalLayers.forEach(layer => {
                const depth = parseFloat(layer.getAttribute('data-depth')) || 0.2;
                
                const moveX = distX * depth * 80; // Translate amount
                const moveY = distY * depth * 80;
                const rotateY = distX * depth * 20; // Rotation amount
                const rotateX = -distY * depth * 20;
                
                layer.style.transform = `
                    translate3d(${moveX}px, ${moveY}px, 0)
                    rotateY(${rotateY}deg)
                    rotateX(${rotateX}deg)
                `;
            });
        }

        requestAnimationFrame(animate);
    }
    animate(); // Start loop

    // 3. MAGNETIC BUTTONS
    const magnets = document.querySelectorAll('.magnetic-btn, .magnetic-item');
    magnets.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0,0)';
        });
    });

    // 4. HOVER STATES
    const hoverables = document.querySelectorAll('a, button, input');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // 5. SCROLL PARALLAX (Simple Vertical)
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        scrollElements.forEach(el => {
            // Animasi scroll simple agar tidak bentrok dengan 3D mouse
            el.style.transform = `translateY(${scrolled * 0.05}px)`;
        });
    });
});