gsap.registerPlugin(ScrollTrigger);

// Створюємо таймлайн, який прив'язаний до скролу
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".pin-section",
    start: "top top",
    end: "+=3000", // Чим більше число, тим довше треба скролити
    scrub: true,
    pin: true,
    markers: true,
  },
});

// Додаємо кроки анімації в таймлайн
tl.to(".text", { opacity: 1, y: 0, duration: 1 }) // 1. Текст з'являється
  .to(".text", { scale: 2, color: "#ff0000", duration: 1 }) // 2. Текст збільшується і червоніє
  .to(".text", { opacity: 0, x: 100, duration: 1 }); // 3. Текст вилітає вбік
