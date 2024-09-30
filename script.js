// Initialize LocomotiveScroll and ScrollTrigger
function locomotive() {
    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("#main"),
        smooth: true,
    });

    // Update ScrollTrigger on scroll
    locoScroll.on("scroll", ScrollTrigger.update);

    // Set up ScrollTrigger proxy for LocomotiveScroll
    ScrollTrigger.scrollerProxy("#main", {
        scrollTop(value) {
            return arguments.length
                ? locoScroll.scrollTo(value, 0, 0)
                : locoScroll.scroll.instance.scroll.y;
        },

        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            };
        },

        pinType: document.querySelector("#main").style.transform
            ? "transform"
            : "fixed",
    });

    // Refresh ScrollTrigger and LocomotiveScroll on update
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();
}

// Initialize locomotive scroll
locomotive();

// Get canvas and context
const canvas = document.querySelector('canvas');
const contest = canvas.getContext('2d');

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Flame object to keep track of current frame index
const flame = {
    currentIndex: 0,
    maxIndex: 300
}

let imagesLoaded = 0;
const images = [];

// Preload images
function preloadImages() {
    for (let i = 1; i <= flame.maxIndex; i++) {
        const imgUrl = `./img/male${i.toString().padStart(4, '0')}.png`;
        const img = new Image();
        img.src = imgUrl;
        img.onload = () => {
            imagesLoaded++
            if (imagesLoaded === flame.maxIndex) {
                loadImages(flame.currentIndex);
                nextFrame();
            }
        }
        images.push(img);
    }
}

// Load images onto the canvas
function loadImages(index) {
    const img = images[index];
    // console.log(index);
    var canvas = contest.canvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var hRatio = canvas.width / img.width;
    var vRatio = canvas.height / img.height;
    var ratio = Math.max(hRatio, vRatio);
    var centerShift_x = (canvas.width - img.width * ratio) / 2;
    var centerShift_y = (canvas.height - img.height * ratio) / 2;
    contest.clearRect(0, 0, canvas.width, canvas.height);
    contest.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio
    );
}

// Animate frames using GSAP and ScrollTrigger
function nextFrame() {
    gsap.to(flame, {
        currentIndex: flame.maxIndex - 1,
        snap: "currentIndex",
        ease: `none`,
        scrollTrigger: {
            scrub: 0.15,
            trigger: `#page>canvas`,
            start: `top top`,
            end: `600% top`,
            // markers: true,
            scroller: `#main`,
        },
        onUpdate: () => loadImages(Math.floor(flame.currentIndex))
    });

    // Pin the canvas during scroll
    ScrollTrigger.create({
        trigger: "#page>canvas",
        pin: true,
        scroller: `#main`,
        start: `top top`,
        end: `600% top`,
    });


    gsap.to("#page1", {
        scrollTrigger: {
            trigger: `#page1`,
            start: `top top`,
            end: `bottom top`,
            pin: true,
            scroller: `#main`
        }
    })
    gsap.to("#page2", {
        scrollTrigger: {
            trigger: `#page2`,
            start: `top top`,
            end: `bottom top`,
            pin: true,
            scroller: `#main`
        }
    })
    gsap.to("#page3", {
        scrollTrigger: {
            trigger: `#page3`,
            start: `top top`,
            end: `bottom top`,
            pin: true,
            scroller: `#main`
        }
    })
}

// Reload images on window resize
window.addEventListener('resize', () => {
    loadImages(flame.currentIndex);
})

// Start preloading images
preloadImages();
