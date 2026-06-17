'use strict';
{
  /* ========================================== */
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
  }
  Promise.all([
    loadHTML('#js-header', '/works/parts/header.html'),
    loadHTML('#js-footer', '/works/parts/footer.html'),

  ]).then(init).catch((err) => {
    console.error(err);
  });
  /* ========================================== */

  function initHamBtn() {
    const nav = document.querySelector('header nav');
    const hamBtn = document.querySelector('#ham-btn');

    const updateMenuState = (isActive) => {
      nav.classList.toggle('is-active', isActive);
      hamBtn.setAttribute('aria-expanded', isActive);
      hamBtn.setAttribute('aria-label', isActive ? 'メニューを閉じる' : 'メニューを開く');
      document.body.classList.toggle('menu-open', isActive);
    };

    hamBtn.addEventListener('click', () => {
      const currentState = nav.classList.contains('is-active');
      updateMenuState(!currentState);
    });

    const spMenu = document.querySelector('#sp-menu');
    spMenu.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        updateMenuState(false); // 強制的に閉じる
      }
    });
  }

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

  function initModal() {
    // モーダルを開く直前にフォーカスされてた要素
    let lastFocusedElement;
    const modal = document.querySelector('#modal-container');

    if (modal) {
      const modalTriggers = document.querySelectorAll('.modal-trigger');
      const modalCloseBtn = document.querySelector('#modal-close');
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

      // 開く処理
      modalTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
          lastFocusedElement = trigger;
          document.documentElement.classList.add('modal-open');

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
          modalCloseBtn.focus();
        });
      });

      // 閉じる処理
      const closeModal = () => {
        modal.classList.remove('is-active')
        document.documentElement.classList.remove('modal-open');

        // SRから隠す
        modal.setAttribute('aria-hidden', 'true');

        // 要素をフォーカス不可にする
        modal.setAttribute('inert', '');

        if (lastFocusedElement) {

          // フォーカスを戻す
          lastFocusedElement.focus();
        }
      };

      modalCloseBtn.addEventListener('click', closeModal);
      modalOverlay.addEventListener('click', closeModal);
    }
  }




  function initCopy() {
    // コピーライト西暦
    const copyrightEl = document.querySelector('#copyright');
    if (copyrightEl) {
      copyrightEl.textContent = new Date().getFullYear();
    }
  }

}
