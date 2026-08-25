// Weglot 悬浮装甲 - 响应式智能间距版
setTimeout(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        api_key: 'wg_09e141cacea940b6432fab178adc79f15',
        hide_switcher: true 
    });
    
    if (document.getElementById('evan-absolute-lang')) return;

    // 1. 注入响应式 CSS 样式表 (智能判断手机和电脑)
    var style = document.createElement('style');
    style.innerHTML = `
      #evan-absolute-lang {
        position: fixed;
        z-index: 2147483647;
        cursor: pointer;
        color: #ffffff; /* 白色文字，在深色背景上更清晰 */
        font-weight: bold;
        font-size: 14px;
        background: rgba(128, 128, 128, 0.25);
        padding: 4px 10px;
        border-radius: 6px;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        transition: background 0.3s;
      }
      #evan-absolute-lang:hover {
        background: rgba(128, 128, 128, 0.6);
      }
      
      /* 💻 电脑端坐标 (屏幕宽度大于 768px 时生效) */
      @media (min-width: 768px) {
        #evan-absolute-lang {
          top: 18px;
          right: 120px; /* 数值越大越靠左，120px 大约在“友情链接”和放大镜中间 */
        }
      }
      
      /* 📱 手机端坐标 (屏幕宽度小于 768px 时生效) */
      @media (max-width: 767px) {
        #evan-absolute-lang {
          top: 18px;
          right: 100px; /* 避开手机右上角的菜单和搜索图标，往左挪一点 */
        }
      }
    `;
    document.head.appendChild(style);

    // 2. 创建独立按钮
    var langBtn = document.createElement('div');
    langBtn.id = 'evan-absolute-lang';
    
    function updateText() {
        langBtn.innerText = Weglot.getCurrentLang() === 'zh' ? 'EN' : '中文';
    }
    updateText();
    
    langBtn.onclick = function(e) {
        e.preventDefault(); e.stopPropagation();
        Weglot.switchTo(Weglot.getCurrentLang() === 'zh' ? 'en' : 'zh');
    };
    
    Weglot.on('languageChanged', updateText);

    // 3. 挂载到最顶层
    document.body.appendChild(langBtn);
    console.log("✅ 报告站长：响应式悬浮装甲已就位，坐标校准完毕！");
  };
  
  document.body.appendChild(script);
}, 1000);
