<!-- 使用 details 标签，不加 'open' 属性即为默认折叠 -->
<details class="bg-[#1e232d] rounded-xl overflow-hidden group">
  
  <!-- summary 是一直显示的头部，即点击区域 -->
  <summary class="flex items-center gap-3 px-5 py-4 cursor-pointer list-none outline-none">
    <i class="fas fa-thumbtack text-gray-300"></i>
    <span class="font-bold text-white">Top Favorite</span>
    <!-- 可选：添加一个右侧的展开箭头，使用 CSS 随展开状态旋转 -->
    <i class="fas fa-chevron-down ml-auto transition-transform group-open:rotate-180"></i>
  </summary>

  <!-- 展开后显示的内容列表 -->
  <div class="px-5 pb-4">
    <!-- 这里放置你的 6 条文章数据 -->
    <div class="flex items-center justify-between border-b border-gray-700 py-3">
      <div>
        <p class="text-sm text-gray-200">Article Template</p>
        <p class="text-xs text-gray-500">2026-8-26</p>
      </div>
      <img src="..." class="w-10 h-10 rounded-md" alt="cover">
    </div>
    <!-- 重复以上列表项... -->
  </div>
  
</details>
