// Weglot 翻译插件动态注入代码
setTimeout(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        // 👇 把下面的 wg_xxx... 替换成你刚刚复制的真实密钥，千万别删掉两边的单引号！
        api_key: 'wg_09e141cacea940b6432fab178adc79f15' 
    });
    console.log("✅ 报告站长：Weglot 翻译插件已成功注入！");
  };
  
  document.body.appendChild(script);
}, 1000);
