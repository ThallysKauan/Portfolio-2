

/* GSAP ANIMATION */
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
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

gsap.to(".navbar a", {
    scrollTrigger: {
        trigger: ".paper-bg",
        endTrigger: ".paper-bg",
        start: "bottom bottom-=60",
        end: "bottom-=500 top",
        scrub: 1,
        markers: false,
    },

    color: "white",
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

// --- TECH CLUSTER PARALLAX DEPTH ---
const projectsSection = document.querySelector('#projetos');
const nodesList = document.querySelectorAll('.tech-node');

if (projectsSection) {
    let isPinned = false;

    // Create a helper ScrollTrigger to detect when pinning is active
    ScrollTrigger.create({
        trigger: "#projetos",
        start: "top top",
        end: "+=2000",
        onToggle: self => isPinned = self.isActive
    });

    projectsSection.addEventListener('mousemove', (e) => {
        if (isPinned) return; // Disable parallax during pinning to boost performance

        const { clientX, clientY } = e;
        const { left, top, width, height } = projectsSection.getBoundingClientRect();

        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;

        nodesList.forEach(node => {
            const depth = parseFloat(node.getAttribute('data-depth')) || 1;
            gsap.to(node, {
                x: x * 30 * depth,
                y: y * 30 * depth,
                rotateZ: x * 5 * depth,
                duration: 1,
                ease: "power2.out",
                overwrite: "auto"
            });
        });
    });

    projectsSection.addEventListener('mouseleave', () => {
        nodesList.forEach(node => {
            gsap.to(node, { x: 0, y: 0, rotateZ: 0, duration: 1.2, ease: "power2.out" });
        });
    });
}

// --- SECURE EXIT TRANSITION (Restore Light Theme) ---
// Transition from BLACK state (rgba(0,0,0,1)) to LIGHT state (rgb(245,245,247)) 
// when the cinematic Projects section pinning finishes.
// gsap.fromTo('body',
//     {
//         backgroundColor: "rgba(0, 0, 0, 1)",
//         '--background-opacity-before-active': 0,
//         '--background-opacity-after-active': 1
//     },
//     {
//         scrollTrigger: {
//             trigger: "#projetos",
//             start: "bottom-=100 center", // Start when section bottom reaches center (pinning finished)
//             end: "bottom-=100 center",
//             scrub: 1
//         },
//         backgroundColor: "rgb(245, 245, 247)",
//         '--background-opacity-before-active': 1,
//         '--background-opacity-after-active': 0,
//         immediateRender: false
//     }
// );

gsap.fromTo('.navbar a',
    { color: "white" },
    {
        scrollTrigger: {
            trigger: "#projetos",
            start: "bottom center",
            end: "bottom top",
            scrub: 1,
            markers: false,
        },
        color: "#1a1a1a",
        immediateRender: false
    }
);

// --- CAMERA CRASH ZOOM EFFECT ---
const title = document.querySelector(".outline-title");

// Managed by GSAP for stability
gsap.set(title, {
    scaleX: 1.7,
    scaleY: 0.8,
    z: 0,
    opacity: 1
});

const crashTL = gsap.timeline({
    scrollTrigger: {
        trigger: "#projetos",
        start: "top top",
        end: "+=400",
        scrub: 1,
        pin: true,
        anticipatePin: 1
    }
});

crashTL
    .to(title, {
        scale: 20,
        x: 600,
        z: 1500,
        opacity: 1,
        ease: "power1.in"
    }, 0)
    .to(nodesList, {
        scale: 3,
        z: 1000,
        x: (i) => (i % 2 === 0 ? -800 : 800),
        opacity: 0,
        stagger: 0.02,
        ease: "power1.in"
    }, 0)
    .to(".radiant-glow-bg", {
        scale: 2,
        opacity: 0,
        ease: "power1.in"
    }, 0)
    .to('.navbar a', {
        color: "#333",
        ease: "none"
    }, 0);


// --- BODY COLOR TRANSITION FOR PROJECTS ---


const sections = gsap.utils.toArray(".panel");

const horizontalTL = gsap.timeline({
    scrollTrigger: {
        trigger: ".horizontal-section",
        start: "top top",
        end: () => "+=" + (window.innerWidth * 3), // Full duration for all phases
        pin: true,
        scrub: 1, // Tighter scrub for better control
        anticipatePin: 1,
        invalidateOnRefresh: true,
        pinSpacing: true,
        markers: false
    }
});

// PHASE 1: FULL INTRO (Title & Depth & Buttons)
// Ensure they show up immediately but animate to final position
horizontalTL.fromTo(".project-name",
    { scale: 0.5, z: -500, opacity: 0 },
    { scale: 1, z: 50, opacity: 1, duration: 1, ease: "power2.out" },
    0);

horizontalTL.fromTo(".project-details",
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
    0.3);

// Stagger individual children for a more dynamic feel
horizontalTL.fromTo(".project-details > *",
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
    0.5);

// PHASE 2: HOLD / INTERACT (A moment where nothing moves sideways)
// We add an empty space in the timeline to let the user "see" the finished result
horizontalTL.to({}, { duration: 1.5 }); // Increased hold for better interaction time

// PHASE 3: LATERAL SCROLL
// This only begins after the previous phases are complete
horizontalTL.to(".horizontal-wrapper", {
    x: () => -(document.querySelector(".horizontal-wrapper").scrollWidth - window.innerWidth),
    ease: "none",
    duration: 5
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
            end: () => "+=" + (window.innerWidth * 3), // Sync with horizontalTL
            scrub: 1,
            onEnter: () => gsap.to(progressBarContainer, { opacity: 1, duration: 0.3 }),
            onLeave: () => gsap.to(progressBarContainer, { opacity: 0, duration: 0.3 }),
            onEnterBack: () => gsap.to(progressBarContainer, { opacity: 1, duration: 0.3 }),
            onLeaveBack: () => gsap.to(progressBarContainer, { opacity: 0, duration: 0.3 }),
        }
    });
}
