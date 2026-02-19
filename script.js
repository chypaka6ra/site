function t_onReady(func) {if(document.readyState!='loading') {func();} else {document.addEventListener('DOMContentLoaded',func);}}
function t_onFuncLoad(funcName,okFunc,time) {if(typeof window[funcName]==='function') {okFunc();} else {setTimeout(function() {t_onFuncLoad(funcName,okFunc,time);},(time||100));}}function t396_initialScale(t){var e=document.getElementById("rec"+t);if(e){var i=e.querySelector(".t396__artboard");if(i){window.tn_scale_initial_window_width||(window.tn_scale_initial_window_width=document.documentElement.clientWidth);var a=window.tn_scale_initial_window_width,r=[],n,l=i.getAttribute("data-artboard-screens");if(l){l=l.split(",");for(var o=0;o<l.length;o++)r[o]=parseInt(l[o],10)}else r=[320,480,640,960,1200];for(var o=0;o<r.length;o++){var d=r[o];a>=d&&(n=d)}var _="edit"===window.allrecords.getAttribute("data-tilda-mode"),c="center"===t396_getFieldValue(i,"valign",n,r),s="grid"===t396_getFieldValue(i,"upscale",n,r),w=t396_getFieldValue(i,"height_vh",n,r),g=t396_getFieldValue(i,"height",n,r),u=!!window.opr&&!!window.opr.addons||!!window.opera||-1!==navigator.userAgent.indexOf(" OPR/");if(!_&&c&&!s&&!w&&g&&!u){var h=parseFloat((a/n).toFixed(3)),f=[i,i.querySelector(".t396__carrier"),i.querySelector(".t396__filter")],v=Math.floor(parseInt(g,10)*h)+"px",p;i.style.setProperty("--initial-scale-height",v);for(var o=0;o<f.length;o++)f[o].style.setProperty("height","var(--initial-scale-height)");t396_scaleInitial__getElementsToScale(i).forEach((function(t){t.style.zoom=h}))}}}}function t396_scaleInitial__getElementsToScale(t){return t?Array.prototype.slice.call(t.children).filter((function(t){return t&&(t.classList.contains("t396__elem")||t.classList.contains("t396__group"))})):[]}function t396_getFieldValue(t,e,i,a){var r,n=a[a.length-1];if(!(r=i===n?t.getAttribute("data-artboard-"+e):t.getAttribute("data-artboard-"+e+"-res-"+i)))for(var l=0;l<a.length;l++){var o=a[l];if(!(o<=i)&&(r=o===n?t.getAttribute("data-artboard-"+e):t.getAttribute("data-artboard-"+e+"-res-"+o)))break}return r}window.TN_SCALE_INITIAL_VER="1.0",window.tn_scale_initial_window_width=null;
</script> <!-- nominify begin --><meta name="p:domain_verify" content="9f41643f1384b1b957363a9cdcc4e132"/><!-- nominify end --><script type="text/javascript">window.dataLayer=window.dataLayer||[];
(function() {if((/bot|google|yandex|baidu|bing|msn|duckduckbot|teoma|slurp|crawler|spider|robot|crawling|facebook/i.test(navigator.userAgent))===false&&typeof(sessionStorage)!='undefined'&&sessionStorage.getItem('visited')!=='y'&&document.visibilityState){var style=document.createElement('style');style.type='text/css';style.innerHTML='@media screen and (min-width: 980px) {.t-records {opacity: 0;}.t-records_animated {-webkit-transition: opacity ease-in-out .2s;-moz-transition: opacity ease-in-out .2s;-o-transition: opacity ease-in-out .2s;transition: opacity ease-in-out .2s;}.t-records.t-records_visible {opacity: 1;}}';document.getElementsByTagName('head')[0].appendChild(style);function t_setvisRecs(){var alr=document.querySelectorAll('.t-records');Array.prototype.forEach.call(alr,function(el) {el.classList.add("t-records_animated");});setTimeout(function() {Array.prototype.forEach.call(alr,function(el) {el.classList.add("t-records_visible");});sessionStorage.setItem("visited","y");},400);}
document.addEventListener('DOMContentLoaded',t_setvisRecs);}})();
</script> <style>
    .number .tn-atom:after {
        content: '%';
        font-size: 25px;
    }

    .number {
        overflow: hidden;
        animation: transform-number 3.2s cubic-bezier(0.98, 0.12, 0.18, 1.03);
        animation-fill-mode: forwards;
        animation-delay: 0.4s;
        z-index: 9999;
        position: fixed; /* Изменено на fixed */
        bottom: 20px; /* Позиционирование снизу */
        right: 20px; /* Позиционирование справа */
    }

    .number .tn-atom {
        animation: transform-number-atom 0.5s ease-in-out;
        animation-fill-mode: forwards;
        animation-delay: 3.6s;
        font-size: 30px;
        color: #000000;
    }

    @keyframes transform-number-atom {
        0% {
            transform: translateY(0px);
        }
        100% {
            transform: translateY(-10vh);
        }
    }

    @keyframes transform-number {
        0% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-45vh);
        }
        100% {
            transform: translateY(-83vh);
        }
    }

    @media screen and (max-width: 650px) {
        .number {
            overflow: hidden;
            animation: transform-number-mobile 3.2s cubic-bezier(0.98, 0.12, 0.18, 1.03);
            animation-fill-mode: forwards;
            animation-delay: 0.4s;
            bottom: 20px; /* Меньший отступ для мобильных */
            right: 20px; /* Меньший отступ для мобильных */
        }
        @keyframes transform-number-mobile {
            0% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-44vh);
            }
            100% {
                transform: translateY(-80vh);
            }
        }
    }

    .uc-preloader {
        z-index: 9998;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #FBF7EE;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 1s ease;
    }

    .preloader-shape {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9997;
        background: #FBF7EE;
        transition: transform 1s ease;
    }

    .t-body {
        overflow: hidden;
    }

    .overflow {
        overflow: auto !important;
    }

    .hide {
        display: none !important;
    }

    .slide-up-smooth {
        transform: translateY(-120%);
        transition: transform 1.7s cubic-bezier(0.4, 0, 0.2, 1);
    }
</style> <script>
    document.addEventListener('DOMContentLoaded', function() {
        window.addEventListener('load', function() {
            const preloader = document.querySelector('.uc-preloader');
            const numberElement = document.querySelector('.number .tn-atom');
            const numberContainer = document.querySelector('.number');
            const preloaderShape = document.querySelector('.preloader-shape');
            const body = document.querySelector('.t-body');

            if (!preloader || !numberElement || !preloaderShape) {
                console.error("Элементы прелоадера не найдены");
                return;
            }

            // Показываем прелоадер
            preloader.classList.remove('hide');
            preloader.style.display = 'flex';

            // Анимация счетчика от 0 до 100 (длительность: 2800ms)
            let start = 0;
            const end = 100;
            const duration = 2100; // Тайминг из оригинального кода
            const startTime = performance.now();

            function animateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const currentValue = Math.floor(progress * end);
                numberElement.textContent = currentValue;

                if (progress < 1) {
                    requestAnimationFrame(animateCounter);
                } else {
                    numberElement.textContent = end;
                    
                    // После завершения счетчика, плавно скрываем белую область (задержка: 400ms)
                    setTimeout(function() {
                        preloaderShape.classList.add('slide-up-smooth');
                        preloader.classList.add('slide-up-smooth');
                    }, 400); // Тайминг из оригинального кода

                    // Разрешаем прокрутку после исчезновения прелоадера (задержка: 3500ms)
                    setTimeout(function() {
                        if (body) body.classList.add('overflow');
                    }, 3500); // Тайминг из оригинального кода

                    // Минимальная задержка, чтобы убрать резкость (скрытие элементов: 5300ms)
                    setTimeout(function() {
                        preloader.classList.add('hide');
                        numberContainer.classList.add('hide');
                    }, 5300); // Тайминг из оригинального кода
                }
            }

            requestAnimationFrame(animateCounter);
        });
    });

    // Резервный таймер для полного скрытия (из оригинального кода)
    setTimeout(function() {
        const preloader = document.querySelector('.uc-preloader');
        const numberContainer = document.querySelector('.number');
        const body = document.querySelector('.t-body');
        
        if (preloader) preloader.classList.add('hide');
        if (numberContainer) numberContainer.classList.add('hide');
        if (body) body.classList.add('overflow');
    }, 5300);

t_onFuncLoad('t396_initialScale',function() {t396_initialScale('1670038901');});t_onReady(function() {t_onFuncLoad('t396_init',function() {t396_init('1670038901');});});
t_onFuncLoad('t396_initialScale',function() {t396_initialScale('1670038921');});t_onReady(function() {t_onFuncLoad('t396_init',function() {t396_init('1670038921');});});
t_onFuncLoad('t396_initialScale',function() {t396_initialScale('1670787751');});t_onReady(function() {t_onFuncLoad('t396_init',function() {t396_init('1670787751');});});
t_onFuncLoad('t396_initialScale',function() {t396_initialScale('1670038941');});t_onReady(function() {t_onFuncLoad('t396_init',function() {t396_init('1670038941');});});
t_onFuncLoad('t396_initialScale',function() {t396_initialScale('1670038951');});t_onReady(function() {t_onFuncLoad('t396_init',function() {t396_init('1670038951');});});
t_onFuncLoad('t396_initialScale',function() {t396_initialScale('1681079961');});t_onReady(function() {t_onFuncLoad('t396_init',function() {t396_init('1681079961');});});
t_onFuncLoad('t396_initialScale',function() {t396_initialScale('1681106511');});t_onReady(function() {t_onFuncLoad('t396_init',function() {t396_init('1681106511');});});
function t_animateInputs(recid) {var rec=document.getElementById('rec' + recid);if(!rec) return;var inputsGroup=rec.querySelectorAll('.t-input-group:not(.t-input-group_da):not(.t-input-group_uw):not(.t-input-group_ri):not(.t-input-group_cb):not(.t-input-group_rg):not(.t-input-group_rd) .t-input-block, .t-datepicker__wrapper');Array.prototype.forEach.call(inputsGroup,function(inputBlock) {if((inputBlock.closest('.t-input-group_ph')&&!inputBlock.closest('.t-input-group_ph').hasAttribute('data-init-mask'))||!inputBlock.parentElement.classList.contains('t-input-group_ph')) {inputBlock.style.position='relative';inputBlock.style.overflow='hidden';}});var inputsPhone=rec.querySelectorAll('.t-input-group.t-input-group_ph');Array.prototype.forEach.call(inputsPhone,function(inputGroup) {if(inputGroup.hasAttribute('data-init-mask')) {inputGroup.style.position='relative';}});var inputs=rec.querySelectorAll('.t-input:not(.t-inputquantity):not(.t-input-phonemask__wrap):not(.t-input-phonemask)');Array.prototype.forEach.call(inputs,function(input) {input.classList.add('t-input_pvis');var inputPlaceholder=input.getAttribute('placeholder');if(inputPlaceholder) {input.insertAdjacentHTML('afterend','<div class="t-input__vis-ph">' + inputPlaceholder + '</div>');input.setAttribute('placeholder','');input.addEventListener('blur',function() {var inputValue=input.value;if(inputValue) {input.classList.add('t-input_has-content');} else {input.classList.remove('t-input_has-content');}});if(inputPlaceholder.length<35) {var inputParent=input.closest('.t-input-block');if(inputParent) {inputParent.style.overflow='';}}}});window.addEventListener('load',function() {Array.prototype.forEach.call(inputs,function(input) {if(input.value) {input.classList.add('t-input_has-content');}});});if(/iPhone|iPad|iPod/i.test(navigator.userAgent)) {var textareas=rec.querySelectorAll('textarea:not(.t-input_bbonly)');Array.prototype.forEach.call(textareas,function(textarea) {textarea.style.paddingLeft='17px';});var iOSVersion=navigator.appVersion.match(/OS(\d+)_(\d+)_?(\d+)?/);var iOSMajorVersion='';if(iOSVersion!==null) {iOSMajorVersion=parseInt(iOSVersion[1],10);};if(iOSMajorVersion&&(iOSMajorVersion<13)) {var textareasBBonly=rec.querySelectorAll('textarea.t-input_bbonly');Array.prototype.forEach.call(textareasBBonly,function(textarea) {textarea.style.textIndent='-3px';});}}}
t_onReady(function() {t_onFuncLoad('t_animateInputs',function() {t_animateInputs('1670038981');});});
t_onReady(function() {window.setTimeout(function() {var rec=document.getElementById('rec1670038981');if(!rec) return;var firstButton=rec.querySelectorAll('.t-btn[data-btneffects-first], .t-submit[data-btneffects-first]');Array.prototype.forEach.call(firstButton,function(button) {var buttonEffect=button.querySelector('.t-btn_wrap-effects');if(!buttonEffect) {button.insertAdjacentHTML('beforeend','<div class="t-btn_wrap-effects"><div class="t-btn_effects"></div></div>');buttonEffect=button.querySelector('.t-btn_wrap-effects');};if(button.offsetWidth>230) {buttonEffect.classList.add('t-btn_wrap-effects_md');};if(button.offsetWidth>300) {buttonEffect.classList.remove('t-btn_wrap-effects_md');buttonEffect.classList.add('t-btn_wrap-effects_lg');}});},1000);});
t_onFuncLoad('t396_initialScale',function() {t396_initialScale('1670038991');});t_onReady(function() {t_onFuncLoad('t396_init',function() {t396_init('1670038991');});});
