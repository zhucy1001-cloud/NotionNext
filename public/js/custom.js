// Weglot Hexo 双端原生融合版 (Tailwind 级适配)
setTimeout(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        api_key: 'wg_09e141cacea940b6432fab178adc79f15',
        hide_switcher: true
    });
    
    function injectNativeBtn() {
      try {
        if (document.getElementById('evan-lang-btn')) return true;

        var iconsContainer = null;
        var insertAfterNode = null;

        // 🎯 策略一：直接抓取放大镜 (最精确的图标定位)
        var searchIcon = document.querySelector('.fa-search') || 
                         document.querySelector('.fa-magnifying-glass') || 
                         document.querySelector('[aria-label="search"]');
                         
        if (searchIcon) {
            // 找到包含放大镜的点击热区 (w-8 h-8)
            var searchBtn = searchIcon.closest('.cursor-pointer') || searchIcon.parentNode;
            if (searchBtn && searchBtn.parentNode) {
                iconsContainer = searchBtn.parentNode; // 这就是包裹所有图标的父级
                insertAfterNode = searchBtn;
            }
        }

        // 🎯 策略二：如果放大镜还没加载，通过“关于我”文字菜单兜底定位 (抗干扰最强)
        if (!iconsContainer) {
            var links = document.querySelectorAll('a, span');
            var textLink = null;
            for (var i = 0; i < links.length; i++) {
                var txt = links[i].innerText || links[i].textContent;
                if (txt && (txt.includes('关于我') || txt.includes('往期整理'))) {
                    textLink = links[i]; break;
                }
            }
            if (textLink) {
                var current = textLink.parentNode;
                // 向上遍历寻找被手机端隐藏的主菜单容器
                for (var j = 0; j < 6; j++) {
                    if (current && typeof current.className === 'string' && (current.className.includes('hidden') || current.className.includes('md:flex'))) {
                        // 它的下一个兄弟节点必定是图标容器
                        if (current.nextElementSibling) iconsContainer = current.nextElementSibling;
                        break;
                    }
                    current = current ? current.parentNode : null;
                }
            }
        }

        if (!iconsContainer) return false; // 两个策略都没找到，说明网页还没渲染完，继续等

        // 🛠️ 创建完美伪装的原生按钮
        var langBtn = document.createElement('div');
        langBtn.id = 'evan-lang-btn';
        
        // 🌟 核心魔法：使用与 Hexo 主题官方图标完全相同的 Tailwind 类名
        // 这样就不需要手动写 margin 了，父容器会自动给它完美的等比间距！
        langBtn.className = 'w-8 h-8 flex justify-center items-center cursor-pointer';
        langBtn.style.cssText = 'font-weight: bold; font-size: 14px; z-index: 99999; display: flex !important; visibility: visible !important; color: inherit; transition: opacity 0.3s;';
        
        langBtn.onmouseover = function() { this.style.opacity = '0.7'; };
        langBtn.onmouseout = function() { this.style.opacity = '1'; };

        function updateText() {
            // 手机端空间宝贵，中文状态显示短小精悍的"中"，英文显示"EN"
            langBtn.innerText = Weglot.getCurrentLang() === 'zh' ? 'EN' : '中';
        }
        updateText();

        langBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation(); // 阻止事件冒泡引发的奇奇怪怪 Bug
            Weglot.switchTo(Weglot.getCurrentLang() === 'zh' ? 'en' : 'zh');
        };
        Weglot.on('languageChanged', updateText);

        // 🚀 最终注入：精确安插在放大镜的右侧 (下一个节点之前)
        if (insertAfterNode && insertAfterNode.nextSibling) {
            iconsContainer.insertBefore(langBtn, insertAfterNode.nextSibling);
        } else if (iconsContainer.children.length > 1) {
            iconsContainer.insertBefore(langBtn, iconsContainer.children[1]);
        } else {
            iconsContainer.appendChild(langBtn);
        }

        console.log("✅ 报告站长：双端原生融合版 EN 按钮已就位！");
        return true;
        
      } catch (err) {
        console.error("Weglot 注入出错，仍在重试...", err);
        return false;
      }
    }
    
    // 超级轮询保护：每 0.5 秒扫描一次，最多尝试 15 秒，必出结果！
    var attempts = 0;
    var timer = setInterval(function() {
      if (injectNativeBtn() || attempts > 30) {
        clearInterval(timer);
      }
      attempts++;
    }, 500);
  };
  
  document.body.appendChild(script);
}, 1000);
