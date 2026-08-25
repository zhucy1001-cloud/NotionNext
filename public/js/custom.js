// Weglot 翻译按钮 + 跑马灯完美悬浮在箭头上方
setTimeout(function() {
  // ==================== 1. Weglot 翻译按钮注入逻辑 ====================
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        api_key: 'wg_09e141cacea940b6432fab178adc79f15',
        hide_switcher: true
    });
    
    setInterval(function() {
      var searchIcons = document.querySelectorAll('.fa-search, .fa-magnifying-glass, .search-button i, [aria-label*="search" i]');
      if (searchIcons.length === 0) return;

      searchIcons.forEach(function(icon, index) {
        var btnId = 'evan-lang-btn-' + index;
        if (document.getElementById(btnId)) return;

        var wrapper = icon.closest('.cursor-pointer') || icon.closest('a') || icon.closest('.search-button') || icon.parentNode;
        if (!wrapper || !wrapper.parentNode) return;

        var langBtn = document.createElement('div');
        langBtn.id = btnId;
        langBtn.style.cssText = 'cursor: pointer; margin: 0 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 15px; font-weight: bold; opacity: 0.8; transition: opacity 0.3s; color: inherit; line-height: 1;';
        
        langBtn.onmouseover = function() { this.style.opacity = '1'; };
        langBtn.onmouseout = function() { this.style.opacity = '0.8'; };
        
        function updateText() {
          langBtn.innerText = Weglot.getCurrentLang() === 'zh' ? 'EN' : '中';
        }
        updateText();
        
        langBtn.onclick = function(e) {
          e.preventDefault(); e.stopPropagation();
          Weglot.switchTo(Weglot.getCurrentLang() === 'zh' ? 'en' : 'zh');
        };
        
        Weglot.on('languageChanged', updateText);
        wrapper.parentNode.insertBefore(langBtn, wrapper.nextSibling);
      });
    }, 1000); 
  };
  document.body.appendChild(script);

  // ==================== 2. 跑马灯位置微调（向上抬高至箭头正上方） ====================
  setInterval(function() {
    var typedElem = document.getElementById('typed');
    if (typedElem) {
      var subContainer = typedElem.parentElement;
      if (subContainer && subContainer !== document.body) {
        subContainer.style.position = 'absolute';
        // 🌟 将 bottom 从 115px 调整为 135px，让文字往上挪一点，与箭头拉开完美间距
        subContainer.style.bottom = '135px'; 
        subContainer.style.left = '0';
        subContainer.style.right = '0';
        subContainer.style.margin = 'auto';
        subContainer.style.zIndex = '20';
        subContainer.style.textAlign = 'center';
        subContainer.style.width = '100%';
        subContainer.style.maxWidth = '900px';
      }
    }
  }, 1000);

}, 1000);
