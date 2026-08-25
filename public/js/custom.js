// Weglot 终极脱壳悬浮版 (完全无视 React 和主题结构)
setTimeout(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        api_key: 'wg_09e141cacea940b6432fab178adc79f15',
        hide_switcher: true // 关闭官方默认挂件
    });
    
    // 如果已经存在，就不重复创建
    if (document.getElementById('evan-absolute-lang')) return;

    // 创建一个完全独立的悬浮按钮
    var langBtn = document.createElement('div');
    langBtn.id = 'evan-absolute-lang';
    
    // 🌟 终极魔法：使用 fixed 绝对定位
    // top: 16px; right: 75px; 会让它死死钉在屏幕右上角（大概在放大镜和汉堡菜单的左边）
    // 加上了高斯模糊和微透明背景，哪怕背景是白底黑底还是跑车图片，都能看得很清楚！
    langBtn.style.cssText = 'position: fixed; top: 16px; right: 75px; z-index: 2147483647; cursor: pointer; color: #ffffff; font-weight: bold; font-size: 14px; text-shadow: 0 1px 3px rgba(0,0,0,0.8); background: rgba(0,0,0,0.25); padding: 5px 10px; border-radius: 6px; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); transition: background 0.3s;';
    
    // 悬停效果
    langBtn.onmouseover = function() { this.style.background = 'rgba(0,0,0,0.5)'; };
    langBtn.onmouseout = function() { this.style.background = 'rgba(0,0,0,0.25)'; };
    
    // 更新文字
    function updateText() {
        langBtn.innerText = Weglot.getCurrentLang() === 'zh' ? 'EN' : '中文';
    }
    updateText();
    
    // 点击切换语言
    langBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        Weglot.switchTo(Weglot.getCurrentLang() === 'zh' ? 'en' : 'zh');
    };
    
    Weglot.on('languageChanged', updateText);

    // 🚀 最关键的一步：直接将它追加到网页的 <body> 上！
    // 彻底摆脱导航栏容器的束缚，React 永远干不掉它！
    document.body.appendChild(langBtn);
    
    console.log("✅ 报告站长：悬浮装甲版 EN 按钮已空降屏幕右上角！");
  };
  
  document.body.appendChild(script);
}, 1000);
