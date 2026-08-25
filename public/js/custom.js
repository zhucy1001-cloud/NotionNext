// 强行注入：延迟 2 秒执行的翻译挂载脚本
setTimeout(function() {
  // 1. 检查是否已经挂载过了，防止出现两个地球
  if (document.querySelector('.gtranslate_wrapper')) {
    return;
  }

  // 2. 创建小地球的容器并塞进网页身体里
  var div = document.createElement('div');
  div.className = 'gtranslate_wrapper';
  document.body.appendChild(div);

  // 3. 写入你的专属配置
  window.gtranslateSettings = {
    "default_language": "zh-CN",
    "languages": ["zh-CN", "en"],
    "wrapper_selector": ".gtranslate_wrapper",
    "switcher_horizontal_position": "right",
    "switcher_vertical_position": "bottom",
    "alt_flags": {"en": "usa"}
  };

  // 4. 加载翻译核心组件
  var script = document.createElement('script');
  script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
  script.defer = true;
  document.body.appendChild(script);

  // 5. 在控制台留个暗号，证明代码跑起来了！
  console.log("✅ 报告站长：翻译小地球代码已成功注入！");
  
}, 2000); // 强行等待 2000 毫秒（2秒），等你的博客主体完全渲染完再动手
