// Weglot Hexo 导航栏终极修正版
setTimeout(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        api_key: 'wg_09e141cacea940b6432fab178adc79f15', 
        hide_switcher: true
    });
    
    function attachToTopNav() {
      // 1. 如果已经添加成功，就跳过
      if (document.getElementById('fixed-lang-switch')) return;

      // 2. 全局寻找顶部的右侧菜单容器（去掉之前错误的 header 限制）
      // 囊括了 NotionNext 常见主题的各种顶部容器类名
      var targetContainer = document.querySelector('#nav-right') || 
                            document.querySelector('.nav-right') || 
                            document.querySelector('.top-nav .flex-shrink-0') ||
                            document.querySelector('#top-nav .flex');
                            
      // 如果还没找到，直接找放大镜图标所在的容器
      if (!targetContainer) {
         var icon = document.querySelector('.fa-search') || 
                    document.querySelector('.search-button') ||
                    document.querySelector('svg.search-icon');
         if (icon) targetContainer = icon.closest('div, ul, nav');
      }

      if (!targetContainer) return; // 没找到就继续等

      // 3. 创建极简的 EN 切换按钮
      var langBtn = document.createElement('a');
      langBtn.id = 'fixed-lang-switch';
      
      // 样式自适应，融入顶部栏
      langBtn.className = 'cursor-pointer px-2 py-1 mx-1 text-xs font-bold transition-all rounded-md hover:bg-black/20 dark:hover:bg-white/20 flex items-center justify-center';
      langBtn.style.display = 'inline-flex';
      langBtn.style.textDecoration = 'none';
      langBtn.style.color = 'inherit'; // 字体颜色自动跟随主题变化

      function updateText() {
        langBtn.innerText = Weglot.getCurrentLang() === 'zh' ? 'EN' : '中文';
      }
      updateText();
      
      langBtn.onclick = function(e) {
        e.preventDefault();
        Weglot.switchTo(Weglot.getCurrentLang() === 'zh' ? 'en' : 'zh');
      };
      
      Weglot.on('languageChanged', function() { updateText(); });
      
      // 4. 将按钮插入到放大镜所在容器的内部
      targetContainer.insertBefore(langBtn, targetContainer.firstChild);
      
      console.log("✅ 报告站长：EN 按钮已成功突破背景图，进入顶栏！");
    }
    
    // 采用定时器循环检测 (每秒1次)，应对 Hexo 主题的菜单延迟加载
    var checkInterval = setInterval(function() {
        if (document.getElementById('fixed-lang-switch')) {
            clearInterval(checkInterval); // 成功后停止检测
        } else {
            attachToTopNav();
        }
    }, 1000);

    // 10秒后如果还没找到，就停止检测避免消耗性能
    setTimeout(function() { clearInterval(checkInterval); }, 10000);
  };
  
  document.body.appendChild(script);
}, 1000);
