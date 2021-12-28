// window.addEventListener('load', function () {
document.addEventListener("DOMContentLoaded", () => {
// удаляем класс у выбранных элементов
 function _removeClasses(elemSelector, elemClass) {
    let el = document.querySelectorAll(elemSelector);
    if (el.length >0) {
        for (let i = 0; i < el.length; i++) {
            el[i].classList.remove(elemClass);
        }
    }
}

/*  -------------------------------------------------------*/
/*  Функция для прокрутки с контролем скорости
/*  -------------------------------------------------------*/
 function scrollToTop(to, duration = 700) {
    const
        element = document.scrollingElement || document.documentElement,
        start = element.scrollTop,
        change = to - start,
        startDate = +new Date(),
        // t = current time
        // b = start value
        // c = change in value
        // d = duration
        easeInOutQuad = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        },
        animateScroll = function () {
            const currentDate = +new Date();
            const currentTime = currentDate - startDate;
            element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration));
            if (currentTime < duration) {
                requestAnimationFrame(animateScroll);
            } else {
                element.scrollTop = to;
            }
        };
    animateScroll();
}
isMobile();
isWebp();
isIE();

function isMobile() {
    // код определяющий на каком устройстве открыта страница
    let isMob = {
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
                isMob.Android() ||
                isMob.BlackBerry() ||
                isMob.iOS() ||
                isMob.Opera() ||
                isMob.Windows());
        }
    };

    if (isMob.any()) {
        document.documentElement.classList.add('_touch');

    } else {
        document.documentElement.classList.add('_pc');
    }
}

// Проверка поддержки webp
function isWebp() {
    function testWebp(callback) {

        let webp = new Image();
        webp.onload = webp.onerror = function () {
            callback(webp.height == 2);
        };
        webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    }
    testWebp(function (support) {
        let className = support === true ? '_webp' : "_no-webp";
        document.documentElement.classList.add(className);
    });
}


// IE
function isIE() {
    function isInternetExplorer() {
        return window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
    }
    if (isInternetExplorer() === false) {
        // alert('Браузер не IE');
    } else {
        alert('Ваш браузер не поддерживается, страница может отображаться некорректно!');
        document.documentElement.classList.add('_ie');
    }
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
//SPOLLERS
const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
    //Получение обычных спойлеров
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
        return !item.dataset.spollers.split(",")[0];
    });
    // Инициализация обычных спойлеров
    if (spollersRegular.length > 0) {
        initSpollers(spollersRegular);
    }

    // Получение спойлеров с медиазапросами
    const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
        return item.dataset.spollers.split(",")[0];
    });

    //Инициализация спойлеров с медиазапросами
    if (spollersMedia.length > 0) {
        const breakpointsArray = [];
        spollersMedia.forEach(item => {
            const params = item.dataset.spollers;
            const breakpoint = {};
            const paramsArray = params.split(",");
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
        });

        // Получаем уникальные брейкпоинты
        let mediaQueries = breakpointsArray.map(function (item) {
            return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
        });
        mediaQueries = mediaQueries.filter(function (item, index, self) {
            return self.indexOf(item) === index;
        });

        // Работаем с каждым брейкпоинтом
        mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(",");
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);

            // Объекты с нужными условиями
            const spollersArray = breakpointsArray.filter(function (item) {
                if (item.value === mediaBreakpoint && item.type === mediaType) {
                    return true;
                }
            });
            // Событие
            if (matchMedia.addListener) { //для старых браузеров
                matchMedia.addListener(function () {
                    initSpollers(spollersArray, matchMedia);
                });
            } else { // для новых
                matchMedia.addEventListener('change', function () {
                    initSpollers(spollersArray, matchMedia);
                });
            }

            initSpollers(spollersArray, matchMedia);
        });
    }

    // Инициализация
    function initSpollers(spollersArray, matchMedia = false) {
        spollersArray.forEach(spollersBlock => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if (matchMedia.matches || !matchMedia) {
                spollersBlock.classList.add('_init');
                initSpollerBody(spollersBlock);
                spollersBlock.addEventListener("click", setSpollerAction);
            } else {
                spollersBlock.classList.remove('_init');
                initSpollerBody(spollersBlock, false);
                spollersBlock.removeEventListener("click", setSpollerAction);
            }
        });
    }

    // Работа с контентом
    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
        const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
        if (spollerTitles.length > 0) {
            spollerTitles.forEach(spollerTitle => {
                if (hideSpollerBody) {
                    spollerTitle.removeAttribute('tabindex');
                    if (!spollerTitle.classList.contains('_active')) {
                        spollerTitle.nextElementSibling.hidden = true;
                    }
                } else {
                    if(!spollerTitle.classList.contains('_excp')){
                       spollerTitle.setAttribute('tabindex', '-1');
                    spollerTitle.nextElementSibling.hidden = false; 
                    }else{
                        spollerTitle.setAttribute('tabindex', '0');
                    }                   
                }
            });
        }
    }

    function setSpollerAction(e) {
        const el = e.target;
        if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
            const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
            const spollersBlock = spollerTitle.closest('[data-spollers]');
            const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
            if (!spollersBlock.querySelectorAll('._slide').length) {
                if (oneSpoller && !spollerTitle.classList.contains('_active')) {
                    hideSpollersBody(spollersBlock);
                }
                spollerTitle.classList.toggle('_active');
                _slideToggle(spollerTitle.nextElementSibling, 500);
            }
            e.preventDefault();
        }
    }

    function hideSpollersBody(spollersBlock) {
        const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
        if (spollerActiveTitle) {
            spollerActiveTitle.classList.remove('_active');
            _slideUp(spollerActiveTitle.nextElementSibling, 500);
        }
    }
}

//==============================================
//SlideToggle
let _slideUp = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.hidden = true;
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration);

    }
}
let _slideDown = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        if (target.hidden) {
            target.hidden = false;
        }
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration);
    }

}
let _slideToggle = (target, duration = 500) => {
    if (target.hidden) {
        return _slideDown(target, duration);
    } else {
        return _slideUp(target, duration);
    }
}
//==============================================
/* 
Для родителя спойлеров пишем атрибут data-spollers
Для заголовков спойлеров пишем атрибут data-spoller
Если нужно включать/выключать работу спойлеров на разных размерах экранов
пишем параметры ширины и типа брейкпоинта.
Например:
data-spollers="992,max"-спойлеры будут работать только на экранах меньше или равно 992px
data-spollers="768,min"-спойлеры будут работать только на экранах больше или равно 768px

Если нужно чтобы в блоке открывался только один спойлер добавляем атрибут d
 */
// задать хедер(по дефолту везде .header)
const headerElement = '.header';


actionBurgerMenu();
hideHeader(headerElement, 100);

/*-------------------------- */
function actionBurgerMenu(iconBurger = '.icon-menu', bodyMenu = '.menu__body') {
    const iconMenu = document.querySelector(iconBurger);
    const menuBody = document.querySelector(bodyMenu);

    function closeBurger() {
        iconMenu.classList.remove("_active");
        menuBody.classList.remove("_active");
        iconMenu.removeAttribute('style');
        iconMenu.ariaExpanded = "false";
        bodyUnLock();
    }

    function openBurger() {
        iconMenu.classList.add("_active");
        menuBody.classList.add("_active");
        iconMenu.style.marginRight = lockPaddingValue;
        iconMenu.ariaExpanded = "true";
        bodyLock();
    }

    if (iconMenu && menuBody) {
        iconMenu.addEventListener("click", function (e) {
            if (iconMenu.classList.contains('_active')) {
                closeBurger();
            } else {
                openBurger();
            }
        });
    }
    window.addEventListener('resize', () => {
        closeBurger();
    });
}




/*-------------------------- */
//   для слушателя всего документа
function onMenuLinkClick(e, fixedHeader = false, activeMenuItem = false, linkMenu = '.menu__link', iconBurger = '.icon-menu', bodyMenu = '.menu__body') {

    if (activeMenuItem && linkMenu) {
        let linksMenu = document.querySelectorAll(linkMenu);
        linksMenu.forEach(linkMenu => {
            linkMenu.classList.remove('_active');
        });
        e.target.closest(linkMenu).classList.add('_active');
    }
    onClickLink(e, fixedHeader);
    let menuIcon = document.querySelector(iconBurger);
    let menuBody = document.querySelector(bodyMenu);

    if (menuIcon.classList.contains('_active')) {
        onClickLink(e, fixedHeader);
        bodyUnLock();
        menuIcon.classList.remove('_active');
        menuBody.classList.remove('_active');
    }
}


function onClickLink(e, headerFixed = false) {
    let targetElement = e.target.closest('a');
    let linkName = targetElement.getAttribute('href');
    //   console.log(linkName);
    if (linkName[0] == '#' && linkName.length > 1) {
        //   console.log("якорь");
        e.preventDefault();
        let gotoBlockName = document.querySelector(linkName);
        if (gotoBlockName) {
            if (headerFixed) {
                let gotoBlockValue = gotoBlockName.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

                //   let gotoBlockValue = gotoBlockName.getBoundingClientRect().top + document.documentElement.scrollTop - document.querySelector('header').offsetHeight;

                window.scrollTo({
                    top: gotoBlockValue,
                    behavior: "smooth"
                });
            } else {
                gotoBlockName.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    }
    if (linkName[0] == '#' && linkName.length == 1) {
        e.preventDefault();
        //   console.log("ссылка никуда не ведет");
    }
}

/*-------------------------- */
function hideHeader(headerElement = '.header', topOfset = 200) {
    let lastScroll = 0;
    const header = document.querySelector(headerElement);
    const defaultOfset = topOfset;
    const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;
    const containHide = () => header.classList.contains('_hide');

    if (header) {
        window.addEventListener('scroll', () => {
            if (scrollPosition() > lastScroll && !containHide()) {
                //scroll down с нуля
                header.classList.add('_vis');

            }
            if (scrollPosition() > lastScroll && !containHide() && scrollPosition() > defaultOfset) {
                //scroll down после определенной позиции
                header.classList.add('_hide');
            }
            if (scrollPosition() < lastScroll && containHide()) {
                //scroll up
                header.classList.remove('_hide');
            }
            if (scrollPosition() == 0) {
                header.classList.remove('_vis');
            }
            lastScroll = scrollPosition();
        });
    }
}
    // смотри в templates/html/_btn-up.html

    /*  находим кнопку и задаем верхний отступ при котором она будет появляться */
    let btnUp = document.querySelector('.up-btn');
    // showBtnUp();
    if (btnUp) {
        window.addEventListener('scroll', function () {
            // по дефолту отступ при котором появляется кнопка 300px, если надо другой указать в скобках
            showBtnUp();
        });
    }

    function showBtnUp(topOfset = 300) {
        // let top = document.documentElement.scrollTop;
        let top = window.pageYOffset;
        if (top > topOfset) {
            btnUp.classList.add('_show');
        } else {
            btnUp.classList.remove('_show');
        }
        
    }
// nclude('./files/filter&tabs.js')
// nclude('./files/popup.js')
// nclude('./files/form.js')
// проверка подключения Swiper

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
// nclude('./files/google-map.js')
// слушатель всего документа
document.addEventListener('click', documentActions);

// делегирование события клик
function documentActions(e) {
    const targetElement = e.target;

    // переключение фильтра(раскоментировать код ниже)
    // if (targetElement.closest('.filter__button')) {
    //     toggleDocumentFilter(targetElement, '.filter__button', '.filter__item', 'all');
    // }

    // переключение табов(раскоментировать код ниже)
    // if (targetElement.closest('.tabs-button')) {
    //     toggleDocumentTabs(targetElement, '.tabs-button', '.tabs-block');
    // }

    if(targetElement.closest('.menu__link._arrow')){
       targetElement.parentElement.classList.toggle("_active");
    }
    if(targetElement.closest('.menu__sub-link')){
        targetElement.parentElement.closest('._active').classList.remove('_active');
    }

    //   обработка ссылок
    if (targetElement.closest('a')) {
        onClickLink(e, true);
    }

    //   обработка ссылок из меню
    if (targetElement.closest('.menu__link') && targetElement.hasAttribute('href')) {
        onMenuLinkClick(e, false, false, '.menu__link');
    }

    // btn-up
    if (targetElement.closest('.up-btn')) {
        e.preventDefault();
        scrollToTop(0, 400);
    }

}

});