class ScrollAnimation {
    constructor(canvasdom, maxIndex) {
        // Initialize properties
        this.locoScroll = null;
        this.canvas = document.querySelector(canvasdom);
        this.context = this.canvas.getContext('2d');
        this.flame = {
            currentIndex: 0,
            maxIndex: maxIndex
        };
        this.imagesLoaded = 0;
        this.images = [];
        this.init();
    }

    init() {
        // Initialize Locomotive Scroll and preload images
        this.initializeLocomotiveScroll();
        this.preloadImages();
        // Add resize event listener to reload images on window resize
        window.addEventListener('resize', () => this.loadImages(this.flame.currentIndex));
    }

    initializeLocomotiveScroll() {
        // Initialize Locomotive Scroll with smooth scrolling
        this.locoScroll = new LocomotiveScroll({
            el: document.querySelector("#main"),
            smooth: true,
        });

        // Update ScrollTrigger on scroll
        this.locoScroll.on("scroll", ScrollTrigger.update);

        // Set up ScrollTrigger scroller proxy
        ScrollTrigger.scrollerProxy("#main", {
            scrollTop: (value) => {
                return arguments.length
                    ? this.locoScroll.scrollTo(value, 0, 0)
                    : this.locoScroll.scroll.instance.scroll.y;
            },
            getBoundingClientRect: () => {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
            pinType: document.querySelector("#main").style.transform ? "transform" : "fixed",
        });

        // Refresh ScrollTrigger on update
        ScrollTrigger.addEventListener("refresh", () => this.locoScroll.update());
        ScrollTrigger.refresh();
    }

    preloadImages() {
        // Preload images and store them in the images array
        for (let i = 1; i <= this.flame.maxIndex; i++) {
            const imgUrl = `./img/male${i.toString().padStart(4, '0')}.png`;
            const img = new Image();
            img.src = imgUrl;
            img.onload = () => {
                this.imagesLoaded++;
                // Once all images are loaded, load the first image and start the animation
                if (this.imagesLoaded === this.flame.maxIndex) {
                    this.loadImages(this.flame.currentIndex);
                    this.nextFrame();
                }
            };
            this.images.push(img);
        }
    }

    loadImages(index) {
        // Load and draw the image on the canvas
        const img = this.images[index];
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        const hRatio = this.canvas.width / img.width;
        const vRatio = this.canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (this.canvas.width - img.width * ratio) / 2;
        const centerShift_y = (this.canvas.height - img.height * ratio) / 2;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(
            img,
            0, 0,
            img.width, img.height,
            centerShift_x, centerShift_y,
            img.width * ratio, img.height * ratio
        );
    }

    nextFrame() {
        // Animate the frames using GSAP and ScrollTrigger
        gsap.to(this.flame, {
            currentIndex: this.flame.maxIndex - 1,
            snap: "currentIndex",
            ease: `none`,
            scrollTrigger: {
                scrub: 0.15,
                trigger: `#page>canvas`,
                start: `top top`,
                end: `600% top`,
                scroller: `#main`,
            },
            onUpdate: () => this.loadImages(Math.floor(this.flame.currentIndex))
        });

        // Pin the canvas element during scroll
        ScrollTrigger.create({
            trigger: "#page>canvas",
            pin: true,
            scroller: `#main`,
            start: `top top`,
            end: `600% top`,
        });

        // Create page pins for additional sections
        this.createPagePin("#page1");
        this.createPagePin("#page2");
        this.createPagePin("#page3");
    }

    createPagePin(selector) {
        // Pin the specified page section during scroll
        gsap.to(selector, {
            scrollTrigger: {
                trigger: selector,
                start: `top top`,
                end: `bottom top`,
                pin: true,
                scroller: `#main`
            }
        });
    }
}

// Instantiate and initialize the ScrollAnimation class
const scrollAnimation = new ScrollAnimation('canvas', 300);
scrollAnimation.init();
