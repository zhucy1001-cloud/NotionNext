// Weglot 顶部菜单集成版脚本
setTimeout(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        api_key: 'wg_09e141cacea940b6432fab178adc79f15', // 别忘了替换成你的密钥！
        hide_switcher: true // 关闭默认浮动挂件
    });
    
    // 监听 Weglot 加载并把按钮塞进顶部导航栏
    function appendHeaderLangButton() {
      // 寻找 NotionNext 顶部的菜单容器（兼容 Fuwari 主题）
      var navContainer = document.querySelector('header nav') || document.querySelector('.menu-links');
      if (!navContainer) return;
      
      // 防止重复添加
      if (document.getElementById('nav-lang-switch')) return;
      
      // 创建一个和顶部其他菜单项（关于我、友情链接）一样样式的按钮
      var langBtn = document.createElement('a');
      langBtn.id = 'nav-lang-switch';
      langBtn.className = 'cursor-pointer ml-2 px-3 py-1.5 text-sm font-medium transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/10';
      
      // 实时同步当前语言状态显示文字
      function updateText() {
        var currentLang = Weglot.getCurrentLang();
        langBtn.innerText = currentLang === 'zh' ? 'EN' : '中文';
      }
      
      updateText();
      
      // 点击时触发语言切换
      langBtn.onclick = function(e) {
        e.preventDefault();
        var currentLang = Weglot.getCurrentLang();
        var targetLang = currentLang === 'zh' ? 'en' : 'zh';
        Weglot.switchTo(targetLang);
      };
      
      // 当语言切换完成后更新按钮文字
      Weglot.on('languageChanged', function() {
        updateText();
      });
      
      // 把这个按钮追加到顶部菜单的最后面（即“友情链接”旁边）
      navContainer.appendChild(langBtn);
      console.log("✅ 报告站长：语言切换按钮已成功集成到顶栏！");
    }
    
    // 延迟 1.5 秒等待顶部菜单渲染完成后再执行插入
    setTimeout(appendHeaderLangButton, 1500);
  };
  
  document.body.appendChild(script);
}, 1000);
