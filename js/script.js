//Debounce
function debounce(callback, delay) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
      timer = null;
    }, delay);
  };
}

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
            !(window.pageYOffset + windowHeight > distElementTop * 1.6)
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

function slide() {
  class Slide {
    constructor(slide, wrapper) {
      this.slide = document.querySelector(slide);
      this.wrapper = document.querySelector(wrapper);
      this.dist = { finalPosition: 0, startX: 0, movement: 0 };
      this.activeClass = "active";
      this.changeEvent = new Event("changeEvent");
    }

    transition(active) {
      this.slide.style.transition = active ? "transform .3s" : "";
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
        this.dist.startX = event.clientX;
        movetype = "mousemove";
      } else {
        this.dist.startX = event.changedTouches[0].clientX;
        movetype = "touchmove";
      }
      this.wrapper.addEventListener(movetype, this.onMove);
      this.transition(false);
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
      this.transition(true);
      this.changeSlideOnEnd();
    }

    changeSlideOnEnd() {
      if (this.dist.movement > 120 && this.index.next !== undefined) {
        this.activeNextSlide();
      } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
        this.activePrevSlide();
      } else {
        this.changeSlide(this.index.active);
      }
    }

    addSlideEvents() {
      this.wrapper.addEventListener("mousedown", this.onStart);
      this.wrapper.addEventListener("touchstart", this.onStart);
      this.wrapper.addEventListener("mouseup", this.onEnd);
      this.wrapper.addEventListener("touchend", this.onEnd);
    }

    slidePosition(slide) {
      const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
      return -(slide.offsetLeft - margin);
    }

    slidesConfig() {
      this.slideArray = [...this.slide.children].map((element) => {
        const position = this.slidePosition(element);
        return { element, position };
      });
    }

    slideIndexNav(index) {
      const last = this.slideArray.length - 1;
      this.index = {
        prev: index ? index - 1 : undefined,
        active: index,
        next: index === last ? undefined : index + 1,
      };
    }

    changeSlide(index) {
      const activeSlide = this.slideArray[index];
      this.moveSlide(activeSlide.position);
      this.slideIndexNav(index);
      this.dist.finalPosition = activeSlide.position;
      this.changeActiveClass();
      this.wrapper.dispatchEvent(this.changeEvent);
    }

    changeActiveClass() {
      this.slideArray.forEach((item) =>
        item.element.classList.remove(this.activeClass)
      );
      this.slideArray[this.index.active].element.classList.add(
        this.activeClass
      );
    }

    activePrevSlide() {
      if (this.index.prev !== undefined) this.changeSlide(this.index.prev);
    }

    activeNextSlide() {
      if (this.index.next !== undefined) this.changeSlide(this.index.next);
    }

    onResize() {
      setTimeout(() => {
        this.slidesConfig();
        this.changeSlide(this.index.active);
      }, 1000);
    }

    addResizeEvent() {
      window.addEventListener("resize", this.onResize);
    }

    bindEvents() {
      this.onStart = this.onStart.bind(this);
      this.onMove = this.onMove.bind(this);
      this.onEnd = this.onEnd.bind(this);
      this.onResize = debounce(this.onResize.bind(this), 200);
    }

    init() {
      this.bindEvents();
      this.addSlideEvents();
      this.slidesConfig();
      this.addResizeEvent();
      this.changeSlide(0);
      return this;
    }
  }

  class SlideNav extends Slide {
    constructor(slide, wrapper) {
      super(slide, wrapper);
      this.bindControlEvents();
    }
    createControl() {
      const control = document.createElement("ul");
      control.dataset.control = "slide";
      this.slideArray.forEach((item, index) => {
        control.innerHTML += `<li><a href="#slide${index + 1}">${
          index + 1
        }</a></li>`;
        this.wrapper.appendChild(control);
      });
      return control;
    }
    eventControl(item, index) {
      item.addEventListener("click", (event) => {
        event.preventDefault();
        this.changeSlide(index);
      });
      this.wrapper.addEventListener("changeEvent", this.activeControlItem);
    }

    activeControlItem() {
      this.controlArray.forEach((item) => {
        item.classList.remove(this.activeClass);
      });
      this.controlArray[this.index.active].classList.add(this.activeClass);
    }

    addControl() {
      this.control = this.createControl();
      this.controlArray = [...this.control.children];
      this.activeControlItem();
      this.controlArray.forEach(this.eventControl);
    }

    bindControlEvents() {
      this.eventControl = this.eventControl.bind(this);
      this.activeControlItem = this.activeControlItem.bind(this);
    }
  }

  const slide = new SlideNav(".slide", ".wrapper-slide");
  slide.init();
  slide.addControl();
}
slide();

// Scroll Suave

function scrollsuave() {
  class ScrollSuave {
    constructor(links, options) {
      this.linksInternos = document.querySelectorAll(links);
      if (options === undefined) {
        this.options = { behavior: "smooth", block: "start" };
      } else {
        this.options = options;
      }

      this.scrollToSection = this.scrollToSection.bind(this);
    }

    scrollToSection(event) {
      event.preventDefault();
      const href = event.currentTarget.getAttribute("href");
      const section = document.querySelector(href);
      section.scrollIntoView(this.options);
    }

    addLinkEvent() {
      this.linksInternos.forEach((link) => {
        link.addEventListener("click", this.scrollToSection);
      });
    }

    init() {
      if (this.linksInternos.length) {
        this.addLinkEvent();
      }
      return this;
    }
  }

  const scrollSuave = new ScrollSuave('[href^="#"]', undefined);
  scrollSuave.init();
}
scrollsuave();

// Menu Mobile
function menuMobile() {
  class MenuMobile {
    constructor(button, list) {
      this.button = document.querySelector('[data-menu="button"]');
      this.list = document.querySelector('[data-menu="list"]');
    }

    toggleActiveClass(event) {
      this.list.classList.toggle("active");
      this.button.classList.toggle("active");
      event.stopPropagation();
      window.addEventListener("click", this.outsideClick);
    }

    outsideClick(event) {
      if (!this.list.contains(event.target)) {
        this.list.classList.remove("active");
        this.button.classList.remove("active");
      }
    }

    addEvents() {
      this.button.addEventListener("click", this.toggleActiveClass);
    }

    init() {
      this.bindEvents();
      this.addEvents();
    }
    bindEvents() {
      this.toggleActiveClass = this.toggleActiveClass.bind(this);
      this.outsideClick = this.outsideClick.bind(this);
    }
  }
  const menumobile = new MenuMobile();
  menumobile.init();
}
menuMobile();
