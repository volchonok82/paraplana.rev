// window.addEventListener('load', function () {
document.addEventListener("DOMContentLoaded", () => {
function _removeClasses(elem, elemClass) {
    if (elem) {
        for (let i = 0; i < elem.length; i++) {
            elem[i].classList.remove(elemClass);
        }
    }
}
const htmlBody =document.querySelector('html');
// код определяющий на каком устройстве открыта страница
let isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows());
    }
};


if (isMobile.any()) {
    htmlBody.classList.add('_touch');

} else {
    htmlBody.classList.add('_pc');
}


// Проверка поддержки webp
function testWebP(elem) {
    const webP = new Image();
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    webP.onload = webP.onerror = function () {
      webP.height === 2 ? elem.classList.add('_webp') : elem.classList.add('_no-webp');
    };
  }

  testWebP(htmlBody);

  // IE
function isInternetExplorer() {
    return window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
}
// console.log(isInternetExplorer());
if (isInternetExplorer() === false) {
    // alert('Браузер не IE');
} else {
    alert('Ваш браузер не поддерживается, страница может отображаться некорректно!');
    htmlBody.classList.add('_ie');
}
// lock body
const documentBody = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');
const lockPaddingValue = window.innerWidth - document.querySelector('._body-wrapper').offsetWidth + 'px';
let unlock = true;
let timeout = 10;


function bodyLock() {
    
  
    if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index];
        el.style.paddingRight = lockPaddingValue;
      }
    }
    documentBody.style.paddingRight = lockPaddingValue;
    documentBody.classList.add('_lock');
  
    unlock = false;
    setTimeout(function () {
      unlock = true;
    }, timeout);
  }
  
  function bodyUnLock() {
    setTimeout(function () {
      if (lockPadding.length > 0) {
        for (let index = 0; index < lockPadding.length; index++) {
          const el = lockPadding[index];
          el.style.paddingRight = '0px';
        }
      }
      documentBody.style.paddingRight = '0px';
      documentBody.classList.remove('_lock');
    }, 0);
  
    unlock = false;
    setTimeout(function () {
      unlock = true;
    }, timeout);
  }
// nclude('./_spoller.js')
// задать хедер(по дефолту везде .header)
const headerElement = '.header';

// const menuArrows = document.querySelectorAll('.menu__link._arrows');


actionBurgerMenu();
onMenuLinkClick(headerElement);
hideHeader(headerElement, 300);
clickMenuArrow();

/*-------------------------- */
function actionBurgerMenu(iconBurger = '.icon-menu', bodyMenu = '.menu__body') {
    const iconMenu = document.querySelector(iconBurger);
    const menuBody = document.querySelector(bodyMenu);
    if (iconMenu && menuBody) {
        iconMenu.addEventListener("click", function (e) {
            if (iconMenu.classList.contains('_active')) {
                iconMenu.classList.remove("_active");
                menuBody.classList.remove("_active");
                iconMenu.removeAttribute('style');
                iconMenu.ariaExpanded="false";
                bodyUnLock();
            } else {
                iconMenu.classList.add("_active");
                iconMenu.style.marginRight = lockPaddingValue;
                iconMenu.ariaExpanded="true";
                menuBody.classList.add("_active");
                bodyLock();
            }
        });
    }
}


/*-------------------------- */
function onMenuLinkClick(headerElement = '.header', links = 'a[data-goto]', iconBurger = '.icon-menu', bodyMenu = '.menu__body') {
    const menuLinks = document.querySelectorAll(links);
    const iconMenu = document.querySelector(iconBurger);
    const menuBody = document.querySelector(bodyMenu);

    if (menuLinks.length > 0) {
        menuLinks.forEach(menuLink => {
            menuLink.addEventListener("click", function (e) {
                const menuLink = e.target;
                if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
                    const gotoBlock = document.querySelector(menuLink.dataset.goto);
                    const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset;

                    if (iconMenu.classList.contains('_active')) {
                        bodyUnLock();
                        iconMenu.classList.remove('_active');
                        menuBody.classList.remove('_active');
                    }

                    if (document.querySelectorAll('._hover')) {
                        _removeClasses(document.querySelectorAll('._hover'), "_hover");
                    }

                    window.scrollTo({
                        top: gotoBlockValue,
                        behavior: "smooth"
                    });
                    e.preventDefault();
                }
            });
        });
    }
}

/*-------------------------- */
function hideHeader(headerElement = '.header', topOfset = 200) {
    let lastScroll = 0;
    const header = document.querySelector(headerElement);
    const defaultOfset = topOfset;
    const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;
    const containHide = () => header.classList.contains('_hide');
    const upBtn = document.querySelector('.up-btn');
    if (header) {
        window.addEventListener('scroll', () => {
            if (scrollPosition() > lastScroll && !containHide()) {
                //scroll down с нуля
                header.classList.add('_vis');
            }
            if (scrollPosition() > lastScroll && !containHide() && scrollPosition() > defaultOfset) {
                //scroll down после определенной позиции
                header.classList.add('_hide');
                upBtn.classList.add('_vis');
            }
            if (scrollPosition() < lastScroll && containHide()) {
                //scroll up
                header.classList.remove('_hide');
            }
            if (scrollPosition() < 200) {
                upBtn.classList.remove('_vis');
            }
            if (scrollPosition() == 0) {
                header.classList.remove('_vis');

            }
            lastScroll = scrollPosition();
        });
    }
}

function clickMenuArrow(menuArrows = document.querySelectorAll('.menu__link._arrow')) {
    if (menuArrows.length > 0) {
        for (let i = 0; i < menuArrows.length; i++) {
            const menuArrow = menuArrows[i];
            menuArrow.addEventListener("click", () => {
                menuArrow.parentElement.classList.toggle('_active');
            });
        }
    }
}
if (window.Swiper) {

    let sliderClassic = new Swiper('.slider-classic', {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
        },
        // включение/отключение
        // перетаскивания на ПК
        simulateTouch: true,
        // чувствительность свайпа(для меньшего усилия увеличить число, 0 отключит возможность перетаскивания на всех устройствах)
        touchRatio: 1,
        // Угол срабатывания свайпа/перетаскивания
        touchAngle: 45,
        // Курсор перетаскивания
        grabCursor: true,
        slidesPerView: 1,
        watchOverflow: true,
        spaceBetween: 15,
        slidesPerGroup: 1,

        // активный слайд по центру
        centeredSlides: true,

        // стартовый слайд
        initialSlide: 0,
        loop: true,
        loopedSlides: 0,

        /* 
        // Автопрокрутка
        autoplay:{
            // пауза между прокруткой
            delay: 2000,
            // закончить на последнем слайде
            stopOnLastSlide: true,
            // отключить после ручного переключения
            disableOnInteraction: false
        },*/
        speed: 800,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },

        /**/
        // Обновить свайпер (например когда он изначально скрыт)
        // при изменении элементов слайдера
        observer: true,

        // при изменении родитеьских элементов слайдера
        observeParents: true,

        // при изменении дочерних элементов слайда
        observeSlideChildren: true,
    });

    let sliderOptimal = new Swiper('.slider-optimal', {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
        },
        // включение/отключение
        // перетаскивания на ПК
        simulateTouch: true,
        // чувствительность свайпа(для меньшего усилия увеличить число, 0 отключит возможность перетаскивания на всех устройствах)
        touchRatio: 1,
        // Угол срабатывания свайпа/перетаскивания
        touchAngle: 45,
        // Курсор перетаскивания
        grabCursor: true,
        slidesPerView: 1,
        watchOverflow: true,
        spaceBetween: 15,
        slidesPerGroup: 1,

        // активный слайд по центру
        centeredSlides: true,

        // стартовый слайд
        initialSlide: 0,
        loop: true,
        loopedSlides: 0,

        /* 
        // Автопрокрутка
        autoplay:{
            // пауза между прокруткой
            delay: 2000,
            // закончить на последнем слайде
            stopOnLastSlide: true,
            // отключить после ручного переключения
            disableOnInteraction: false
        },*/
        speed: 800,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },

        /**/
        // Обновить свайпер (например когда он изначально скрыт)
        // при изменении элементов слайдера
        observer: true,

        // при изменении родитеьских элементов слайдера
        observeParents: true,

        // при изменении дочерних элементов слайда
        observeSlideChildren: true,
    });
    let sliderLuxury = new Swiper('.slider-luxury', {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
        },
        // включение/отключение
        // перетаскивания на ПК
        simulateTouch: true,
        // чувствительность свайпа(для меньшего усилия увеличить число, 0 отключит возможность перетаскивания на всех устройствах)
        touchRatio: 1,
        // Угол срабатывания свайпа/перетаскивания
        touchAngle: 45,
        // Курсор перетаскивания
        grabCursor: true,
        slidesPerView: 1,
        watchOverflow: true,
        spaceBetween: 15,
        slidesPerGroup: 1,

        // активный слайд по центру
        centeredSlides: true,

        // стартовый слайд
        initialSlide: 0,
        loop: true,
        loopedSlides: 0,
        autoHeight: true,

        /* 
        // Автопрокрутка
        autoplay:{
            // пауза между прокруткой
            delay: 2000,
            // закончить на последнем слайде
            stopOnLastSlide: true,
            // отключить после ручного переключения
            disableOnInteraction: false
        },*/
        speed: 800,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },

        /**/
        // Обновить свайпер (например когда он изначально скрыт)
        // при изменении элементов слайдера
        observer: true,

        // при изменении родитеьских элементов слайдера
        observeParents: true,

        // при изменении дочерних элементов слайда
        observeSlideChildren: true,
    });
}
  //  --------------------------------
  document.addEventListener('click', documentActions);

  // делегирование события клик
  function documentActions(e) {

    const targetElement = e.target;

    //обработка клика на стрелку меню

    // закрытие меню и суб-меню
    if (targetElement.classList.contains('menu__sub-link')) {
      targetElement.parentElement.closest('._active').classList.toggle('_active');
    }

    if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._active').length > 0) {
      _removeClasses(document.querySelectorAll('.menu__item._active'), "_active");

    }
    // 
    if (targetElement.classList.contains('up-btn')) {
      e.preventDefault();
      scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }

    if (targetElement.classList.contains('collapsed')) {
      e.preventDefault();

      let collapseContent = document.querySelectorAll('.collapse');
      let targetToggle = targetElement.dataset.toggle;

      if (targetElement.classList.contains('_active')) {
        targetElement.classList.remove('_active');
        collapseContent.forEach(item => {
          item.classList.remove('_active');
        });
      } else {
        targetElement.classList.add('_active');
        collapseContent.forEach(item => {
          item.classList.remove('_active');
          if (item.id == targetToggle) {
            item.classList.add('_active');
          }
        });
      }
    }




    // можно добавлять события клика
  }


});