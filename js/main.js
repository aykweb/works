'use strict';
{
  /* =====================
ヘッダーフッター読込と初期化
===================== */
  function loadHTML(selector, url) {
    const target = document.querySelector(selector);
    if (!target) return Promise.resolve();
    return fetch(url)
      .then((res) => {

        if (!res.ok) throw new Error('load failed');
        return res.text();
      })
      .then((html) => {
        target.innerHTML = html;
      });
  }

  function init() {
    initHamBtn();
    initScrollAnime();
    initModal();
    initCopy();
    initActiveNav();
  }
  Promise.all([
    loadHTML('#js-header', '/works/parts/header.html'),
    loadHTML('#js-footer', '/works/parts/footer.html'),

  ]).then(init).catch((err) => {
    console.error(err);
  });
  /* ========================================== */

  function initActiveNav() {
    const sections = document.querySelectorAll('main section[id], .hero');
    const navLinks = document.querySelectorAll('.header__nav-link');

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id; // heroの場合は空文字になる

          navLinks.forEach((link) => {
            if (!id) {
              link.classList.remove('is-current');
            } else {
              link.classList.toggle('is-current', link.getAttribute('href').endsWith(`#${id}`));
            }
          });
        }
      });
    }, {
      rootMargin: '-50% 0px -50% 0px'
    });

    sections.forEach((section) => obs.observe(section));
  }


  /* =====================
ハンバーガーメニュー
===================== */
  function initHamBtn() {
    const nav = document.querySelector('.header__nav');
    const hamBtn = document.querySelector('#js-toggle-btn');


    const navTargets = Array.from(nav.children).filter(el => el.id !== 'js-toggle-btn' && el.id !== 'js-panel');
    const bodyTargets = Array.from(document.body.children).filter(el => el.tagName !== 'HEADER' && el.id !== 'js-modal-container');
    const inertTargets = navTargets.concat(bodyTargets);

    const setBackgroundInert = (isInert) => {
      inertTargets.forEach((el) => {
        if (isInert) {
          el.setAttribute('inert', '');
        } else {
          el.removeAttribute('inert');
        }
      });
    };

    const updateMenuState = (isActive) => {
      nav.classList.toggle('is-active', isActive);
      hamBtn.setAttribute('aria-expanded', isActive);
      hamBtn.setAttribute('aria-label', isActive ? 'メニューを閉じる' : 'メニューを開く');
      document.body.classList.toggle('u-scroll-lock', isActive);
    };

    hamBtn.addEventListener('click', () => {
      const currentState = nav.classList.contains('is-active');
      const nextState = !currentState;
      updateMenuState(nextState);
      setBackgroundInert(nextState);
    });

    // リンククリック時の処理
    const spMenu = document.querySelector('#js-panel');
    spMenu.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        updateMenuState(false);
        setBackgroundInert(false);
      }
    });
  }

  /* =====================
   フェード表示
   ===================== */
  function initScrollAnime() {
    const h2s = document.querySelectorAll('h2, .about__photo');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    });

    h2s.forEach(h2 => obs.observe(h2));
  }

  /* =====================
 モーダル処理
 ===================== */
  function initModal() {
    // モーダルを開く直前にフォーカスされてた要素
    let lastFocusedElement;
    const modal = document.querySelector('#js-modal-container');

    if (modal) {
      const modalTriggers = document.querySelectorAll('.works__card--trigger');
      const modalCloseBtn = document.querySelector('#js-modal-close');
      const modalOverlay = document.querySelector('.modal__overlay');

      const modalImg = document.querySelector('.modal__img');
      const modalTitle = document.querySelector('.modal__title');
      const modalTools = document.querySelector('.modal__tools');
      const modalDetails = document.querySelector('.modal__details');

      const detailItems = [
        { label: '制作背景', dataAttr: 'overview' },
        { label: '設計', dataAttr: 'structure' },
        { label: 'デザイン', dataAttr: 'design' },
        { label: '実装', dataAttr: 'development' },
        { label: '課題', dataAttr: 'improvement' },
      ];

      const modalLink = document.querySelector('.modal__link');

      // タブフォーカス
      // body直下のmodal以外を背景として扱う
      const backgroundEls = Array.from(document.body.children)
        .filter((el) => el !== modal);

      const setBackgroundInert = (isInert) => {
        backgroundEls.forEach((el) => {
          if (isInert) {
            el.setAttribute('inert', '');
          } else {
            el.removeAttribute('inert');
          }
        });
      };

      // 開く処理
      modalTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
          lastFocusedElement = trigger;
          document.documentElement.classList.add('u-scroll-lock');

          modalImg.src = trigger.dataset.img;
          modalImg.alt = `「${trigger.dataset.title}」のスクリーンショット`;
          modalTitle.textContent = trigger.dataset.title;

          const tools = trigger.dataset.tools.split(',');
          modalTools.innerHTML = tools
            .map(tool => `<li class="modal__tag">${tool.trim()}</li>`)
            .join('');

          modalDetails.innerHTML = '';
          detailItems.forEach(({ label, dataAttr }) => {
            const h4 = document.createElement('h4');
            h4.textContent = label;

            const p = document.createElement('p');
            p.textContent = trigger.dataset[dataAttr] ?? '';
            modalDetails.append(h4, p);
          });

          modalLink.href = trigger.dataset.link;

          modal.classList.add('is-active');
          modal.removeAttribute('aria-hidden');
          modal.removeAttribute('inert');
          setBackgroundInert(true);
          modalCloseBtn.focus();
        });
      });

      // 閉じる処理
      const closeModal = () => {
        modal.classList.remove('is-active')
        document.documentElement.classList.remove('u-scroll-lock');

        // SRから隠す
        modal.setAttribute('aria-hidden', 'true');

        // 要素をフォーカス不可にする
        modal.setAttribute('inert', '');
        setBackgroundInert(false);

        if (lastFocusedElement) {

          // フォーカスを戻す
          lastFocusedElement.focus();
        }
      };

      modalCloseBtn.addEventListener('click', closeModal);
      modalOverlay.addEventListener('click', closeModal);
    }
  }

  /* =====================
コピーライト西暦表示
===================== */
  function initCopy() {
    const copyrightEl = document.querySelector('#js-copy');
    if (copyrightEl) {
      copyrightEl.textContent = new Date().getFullYear();
    }
  }

}
