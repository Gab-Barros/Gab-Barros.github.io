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
  console.log(elements);
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
