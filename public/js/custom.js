// 这里编写自定义js脚本；将被静态引入到页面中
// GTranslate 动态加载脚本
window.addEventListener('DOMContentLoaded', function() {
  // 创建容器
  var div = document.createElement('div');
  div.className = 'gtranslate_wrapper';
  document.body.appendChild(div);

  // 写入配置
  window.gtranslateSettings = {
    "default_language": "zh-CN",
    "languages": ["zh-CN", "en"],
    "wrapper_selector": ".gtranslate_wrapper",
    "switcher_horizontal_position": "right",
    "switcher_vertical_position": "bottom",
    "alt_flags": {"en": "usa"}
  };

  // 加载核心插件
  var script = document.createElement('script');
  script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
  script.defer = true;
  document.body.appendChild(script);
});
