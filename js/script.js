// Exclamação intermitente
function intermitente() {
  const interr = document.querySelector(".interr");
  if (interr) {
    function intermitenteLight() {
      setInterval(() => {
        interr.classList.toggle("ativo");
      }, 1000);
    }
    intermitenteLight();
  }
}
intermitente();

// Fade intro ao carregar
function fadeInDown() {
  const elements = document.querySelectorAll("[data-fade]");
  window.addEventListener("load", fadeElements);
  function fadeElements() {
    elements.forEach((element) => {
      element.classList.add("active");
    });
  }
}
fadeInDown();

// Fade Left Skills
function fadeLeftSkills() {
  const elements = document.querySelectorAll("[data-fadeInLeft]");
  const windowHeight = Math.floor(window.innerHeight * 0.8);
  if (elements.length) {
    window.addEventListener("load", checkDistance);

    // Pega a distância do elemento até o topo da página
    function checkDistance() {
      elements.forEach((element) => {
        const distElementTop = element.offsetTop;
        //ativa a função passando a distancia do elemento ao topo da página como argumento
        activeClass(distElementTop, element);
      });
    }

    function activeClass(distElementTop, element) {
      function debounce(func, time) {
        let timer = null;
        return function () {
          clearTimeout(timer);
          timer = setTimeout(func, time);
        };
      }

      window.addEventListener(
        "scroll",
        debounce(function () {
          if (
            window.pageYOffset + windowHeight > distElementTop &&
            !(window.pageYOffset + windowHeight > distElementTop * 1.3)
          ) {
            element.classList.add("active");
          }
        }, 100)
      );
    }
  }
}
fadeLeftSkills();

// Slide Certificados

class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.6;
    return this.dist.finalPosition - this.dist.movement;
  }

  onStart(event) {
    let movetype;
    if (event.type === "mousedown") {
      event.preventDefault();
      movetype = "mousemove";
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      movetype = "touchmove";
    }
    this.wrapper.addEventListener(movetype, this.onMove);
  }

  onMove(event) {
    const pointerPosition =
      event.type === "mousemove"
        ? event.clientX
        : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  onEnd(event) {
    const movetype = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.wrapper.removeEventListener(movetype, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
  }

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
    return this;
  }
}

const slide = new Slide(".slide", ".wrapper-slide");
slide.init();
