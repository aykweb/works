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
  /* =====================
ロケーション設定
===================== */
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
    // ダイアログ（モバイルメニュー）開閉
    const openBtn = document.getElementById('js-panel-open');
    const closeBtn = document.getElementById('js-panel-close');
    const menu = document.getElementById('js-panel');

    openBtn.addEventListener('click', () => {
      menu.showModal();
    });

    closeBtn.addEventListener('click', () => {
      menu.close();
    });

    menu.addEventListener('click', (e) => {
      if (e.target === menu) {
        menu.close();
      }
    });

    menu.querySelectorAll('a[href]').forEach((link) => {
      link.addEventListener('click', () => {
        menu.close();
      });
    });
  }

  /* =====================
   スクロール判定フェード表示
   ===================== */
  function initScrollAnime() {
    const targets = document.querySelectorAll('.js-fade-in');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.4,
    });

    targets.forEach((target) => observer.observe(target));
  }

  /* =====================
 モーダルウインドウ処理
 ===================== */

  function initModal() {
    const modalInner = document.querySelector('.modal__inner');
    const modalImg = document.querySelector('.modal__img');
    const modalTitle = document.querySelector('.modal__title');
    const modalTools = document.querySelector('.modal__tools');
    const modalDetails = document.querySelector('.modal__details');

    const detailItems = [
      { label: '制作背景', dataAttr: 'overview' },
      { label: '設計', dataAttr: 'structure' },
      { label: 'デザイン', dataAttr: 'design' },
      { label: '実装', dataAttr: 'development' },
    ];

    const modalLink = document.querySelector('.modal__link');

    // ダイアログ（works詳細）開閉
    // 開くボタン
    const openBtns = document.querySelectorAll('.js-modal-open');

    // 閉じるボタン
    const closeBtn = document.getElementById('js-modal-close');

    // モーダル本体
    const modal = document.getElementById('js-modal-window');

    // 開く処理
    openBtns.forEach((openBtn) => {
      openBtn.addEventListener('click', () => {
        modal.showModal();
        modalInner.scrollTop = 0;

        modalImg.src = openBtn.dataset.img;
        modalImg.alt = `「${openBtn.dataset.title}」のスクリーンショット`;
        modalTitle.textContent = openBtn.dataset.title;

        const tools = openBtn.dataset.tools.split(',');
        modalTools.innerHTML = tools
          .map(tool => `<li class="modal__tag">${tool.trim()}</li>`)
          .join('');

        modalDetails.innerHTML = '';
        detailItems.forEach(({ label, dataAttr }) => {
          const h4 = document.createElement('h4');
          h4.textContent = label;

          const p = document.createElement('p');
          p.textContent = openBtn.dataset[dataAttr] ?? '';
          modalDetails.append(h4, p);
        });

        modalLink.href = openBtn.dataset.link;
      });
    });

    // 閉じる処理
    closeBtn.addEventListener('click', () => {
      modal.close();
    });


    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.close();
      }
    });

    modal.querySelectorAll('a[href]').forEach((link) => {
      link.addEventListener('click', () => {
        modal.close();
      });
    });


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
