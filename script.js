// ==========================================
// FUJII DOGs - JavaScript
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
  // ハンバーガーメニュー
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ヘッダースクロール効果
  const header = document.querySelector('.header');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // スムーズスクロール
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // フェードインアニメーション
  const fadeElements = document.querySelectorAll('.fade-in');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const fadeObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(element => {
    fadeObserver.observe(element);
  });

  // サービスカードの順次アニメーション
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
  });

  // ==========================================
  // 注文フォーム商品追加・削除機能
  // ==========================================
  const productList = document.getElementById('product-list');
  const addBtn = document.getElementById('add-product-btn');

  if (productList && addBtn) {
    // 追加ボタンクリック時
    addBtn.addEventListener('click', function () {
      const items = productList.getElementsByClassName('product-item');
      const newItem = items[0].cloneNode(true);

      // 入力値をクリア
      const selects = newItem.querySelectorAll('select');
      selects.forEach(select => select.value = "");

      // 必須バッジを調整（2つ目以降は任意にする場合など。今回は全て必須のままにするが、コピー元の値をリセット）

      productList.appendChild(newItem);
      updateProductNumbers();
    });

    // 削除ボタンクリック時（イベント委譲）
    productList.addEventListener('click', function (e) {
      if (e.target.classList.contains('btn-remove-product') || e.target.parentElement.classList.contains('btn-remove-product')) {
        const items = productList.getElementsByClassName('product-item');
        if (items.length > 1) {
          // ボタンそのものか、アイコン(もしあれば)をクリックした親要素を探す
          const btn = e.target.classList.contains('btn-remove-product') ? e.target : e.target.parentElement;
          const item = btn.closest('.product-item');
          item.remove();
          updateProductNumbers();
        } else {
          alert('商品は少なくとも1つ選択してください。');
        }
      }
    });

    // 初期化：番号更新とボタン表示制御
    updateProductNumbers();

    function updateProductNumbers() {
      const items = productList.getElementsByClassName('product-item');
      Array.from(items).forEach((item, index) => {
        // 商品番号更新
        const numLabel = item.querySelector('.product-number');
        if (numLabel) {
          numLabel.textContent = index + 1;
        }

        // 必須/任意の切り替え（1つ目は必須、2つ目以降は任意ラベルなどにするならここで）
        // 今回は「入力欄がある＝注文する」意図と捉え、基本的に必須のまま、あるいはラベルのみ変更。
        // ユーザー要望に「商品2」は任意だったが、動的追加の場合は追加した時点で選択意思があるため、Required属性は維持で良い。
        // ラベルの「必須」バッジの表示制御だけ調整。
        const badge = item.querySelector('.badge-required');
        /* 
           動的に追加する場合は通常「削除できるから必須」でよいが、
           初期表示を複製する場合の制御。
           ここではシンプルに全て「商品 N」とする。
        */

        // 削除ボタンの表示制御（1つしかないときは消せない、または非表示）
        const removeBtn = item.querySelector('.btn-remove-product');
        if (items.length === 1) {
          removeBtn.style.display = 'none';
        } else {
          removeBtn.style.display = 'flex';
        }
      });
    }
  }
});
