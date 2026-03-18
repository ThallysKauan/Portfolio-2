

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

// Removido o controle manual de cor da navbar (CSS mix-blend-mode assume o controle)

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

// Removida transição de volta para o escuro



// --- BODY COLOR TRANSITION FOR PROJECTS ---


const sections = gsap.utils.toArray(".panel");

const horizontalTL = gsap.timeline({
    scrollTrigger: {
        trigger: ".horizontal-section",
        start: "top top",
        end: () => "+=" + (document.querySelector(".horizontal-wrapper").scrollWidth),
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
});

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
            end: () => "+=" + (document.querySelector(".horizontal-wrapper").scrollWidth), // Sync with horizontalTL
            scrub: 1,
            onEnter: () => gsap.to(progressBarContainer, { opacity: 1, duration: 0.3 }),
            onLeave: () => gsap.to(progressBarContainer, { opacity: 0, duration: 0.3 }),
            onEnterBack: () => gsap.to(progressBarContainer, { opacity: 1, duration: 0.3 }),
            onLeaveBack: () => gsap.to(progressBarContainer, { opacity: 0, duration: 0.3 }),
        }
    });
}
