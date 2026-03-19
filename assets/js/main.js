
window.addEventListener('load', () => {
    /* GSAP ANIMATION */
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const smoother = ScrollSmoother.create({
        smooth: 3,
        effects: true,
        smoothTouch: 0
    });

    gsap.to(".bottom-headline", {
        scrollTrigger: {
            trigger: ".paper-bg",
            start: "bottom-=150 bottom",
            endTrigger: ".paper-bg",
            end: "bottom-=550 top",
            scrub: 1,
            markers: false,
        },

        fontSize: "2vw",
    });

    gsap.to("body", {
        scrollTrigger: {
            trigger: ".paper-bg",
            endTrigger: ".paper-bg",
            start: "bottom bottom-=60",
            end: "bottom-=500 top",
            scrub: 1,
            markers: false,
        },

        backgroundColor: "rgba(0, 0, 0, 1)",
        '--background-opacity-before-active': 0,
        '--background-opacity-after-active': 1,
    });

    gsap.to(".div1", {
        duration: 0.6,
        ease: "power1.inOut",
        scrollTrigger: {
            toggleActions: "play none none reverse",
            trigger: ".part2",
            endTrigger: ".part2",
            start: "top+=250 bottom-=300",
            end: "bottom top",
            markers: false,

        },

        gap: "800px",
    });

    gsap.to(".text-left", {
        scrollTrigger: {
            trigger: ".part2",
            endTrigger: ".part2",
            start: "top+=350 bottom-=300",
            end: "top top",
            scrub: 1,
            markers: false,

        },
        color: "#1a1a1a",
    });
    gsap.to(".text-right", {
        scrollTrigger: {
            trigger: ".part2",
            endTrigger: ".part2",
            start: "top+=350 bottom-=300",
            end: "top top",
            scrub: 1,
            markers: false,

        },
        color: "#1a1a1a",
    });

    gsap.timeline({
        scrollTrigger: {
            trigger: ".part2",
            start: "top+=250 bottom-=300",
            end: "top+=200 top",
            scrub: 1,
            markers: false,
        }
    })
        .fromTo(
            [".tagline", ".section-title", ".current-role"],
            { color: "#1a1a1a" },
            { color: "#fff" },
            0
        )
        .to(
            [".tagline", ".section-title", ".current-role"],
            { color: "#1a1a1a" },
            0.6
        );


    gsap.timeline({
        scrollTrigger: {
            trigger: ".part2",
            start: "top+=250 bottom-=300",
            end: "top+=200 top",
            scrub: 1,
            markers: false,
        }
    })
        .fromTo(
            [".role-date", ".skill-item"],
            { color: "#1a1a1a" },
            { color: "#c4b595" },
            0
        )
        .to(
            [".role-date", ".skill-item"],
            { color: "#1a1a1a" },
            0.6
        );



    gsap.timeline({
        scrollTrigger: {
            trigger: ".part2",
            start: "center+=250 bottom-=150",
            end: "center+=250 top",
            scrub: 1,
            markers: false,
        }
    })
        .fromTo(
            [".detailed-bio p", ".subsection-title"],
            { color: "#1a1a1a" },
            { color: "#c4b595" },
            0
        )
        .to(
            [".detailed-bio p", ".subsection-title"],
            { color: "#1a1a1a" },
            0.6
        );


    const sections = gsap.utils.toArray(".panel");

    const horizontalTL = gsap.timeline({
        scrollTrigger: {
            trigger: ".horizontal-section",
            start: "top top",
            end: () => "+=" + (document.querySelector(".horizontal-wrapper").scrollWidth * 0.22), 
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            pinSpacing: true,
            markers: false
        }
    });

    horizontalTL.to(".horizontal-wrapper", {
        x: () => -(document.querySelector(".horizontal-wrapper").scrollWidth - window.innerWidth),
        ease: "none",
        duration: 10 
    })
    .to(".horizontal-section", {
        backgroundColor: "#050505",
        duration: 1.5,
        ease: "none"
    }, "-=1.5")
    .to(".fundador-content", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.5")
    .to(".fundador-photo", {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    }, "<")
    .from(".stat-item", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.8")
    .to(".cta-inner", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.4");


    // Parallax suave nas imagens dos projetos durante o scroll
    gsap.utils.toArray(".project-image-side img").forEach(img => {
        gsap.to(img, {
            x: -40,
            ease: "none",
            scrollTrigger: {
                trigger: img,
                containerAnimation: horizontalTL,
                start: "left right",
                end: "right left",
                scrub: true
            }
        });
    });

    // --- PROGRESS BAR SYNC ---
    const progressBar = document.querySelector('.progress-bar-fill');
    const progressBarContainer = document.querySelector('.progress-bar-container');

    if (progressBar && progressBarContainer) {
        gsap.to(progressBar, {
            width: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: ".horizontal-section",
                start: "top top",
                end: () => "+=" + (document.querySelector(".horizontal-wrapper").scrollWidth * 0.45), 
                scrub: 1,
                onEnter: () => gsap.to(progressBarContainer, { opacity: 1, duration: 0.3 }),
                onLeave: () => gsap.to(progressBarContainer, { opacity: 0, duration: 0.3 }),
                onEnterBack: () => gsap.to(progressBarContainer, { opacity: 1, duration: 0.3 }),
                onLeaveBack: () => gsap.to(progressBarContainer, { opacity: 0, duration: 0.3 }),
            }
        });
    }

    // --- BACK TO TOP LOGIC ---
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        ScrollTrigger.create({
            trigger: "body",
            start: "100vh top",
            onEnter: () => backToTop.classList.add('visible'),
            onLeaveBack: () => backToTop.classList.remove('visible'),
        });

        backToTop.addEventListener('click', () => {
            smoother.scrollTo(0, true);
        });
    }

    // --- HERO TAGLINE FADE ---
    gsap.to(".hero-tagline-container", {
        opacity: 0,
        y: -50,
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "300px top",
            scrub: true,
        }
    });

    // --- action-hub ANIMATIONS (fixed) ---
    gsap.set(".cta-inner", { opacity: 0, y: 60 });
    gsap.set(".hub-btn", { opacity: 0, y: 20 });

    const footerTL = gsap.timeline({
        scrollTrigger: {
            trigger: "#cta-footer",
            start: "top 75%",
            toggleActions: "play none none reverse",
        }
    });

    footerTL.to(".cta-inner", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power4.out"
    })
    .to(".hub-btn", {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.7)"
    }, "-=0.8");

    // --- FOOTER THREE.JS SCENE (Improved Visuals) ---
    const footerCanvas = document.getElementById('footer-canvas');
    if (footerCanvas) {
        const fScene = new THREE.Scene();
        const fCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        fCamera.position.z = 10;

        const fRenderer = new THREE.WebGLRenderer({ canvas: footerCanvas, alpha: true, antialias: true });
        fRenderer.setSize(window.innerWidth, window.innerHeight);
        fRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 30;
            positions[i+1] = (Math.random() - 0.5) * 30;
            positions[i+2] = (Math.random() - 0.5) * 30;
            
            colors[i] = 0.77;   // #c4b595 in R
            colors[i+1] = 0.71; // G
            colors[i+2] = 0.58; // B
        }

        const particleGeom = new THREE.BufferGeometry();
        particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMat = new THREE.PointsMaterial({
            size: 0.04,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeom, particleMat);
        fScene.add(particles);

        // Interaction
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
        });

        window.addEventListener('resize', () => {
            fCamera.aspect = window.innerWidth / window.innerHeight;
            fCamera.updateProjectionMatrix();
            fRenderer.setSize(window.innerWidth, window.innerHeight);
        });

        function animateFooter() {
            requestAnimationFrame(animateFooter);
            particles.rotation.y += 0.0005;
            fCamera.position.x += (mouseX - fCamera.position.x) * 0.1;
            fCamera.position.y += (-mouseY - fCamera.position.y) * 0.1;
            fCamera.lookAt(fScene.position);
            fRenderer.render(fScene, fCamera);
        }
        animateFooter();
    }

    // Garante que tudo seja recalculado após ScrollSmoother ser criado
    ScrollTrigger.refresh();
});
