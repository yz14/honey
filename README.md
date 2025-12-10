# 🐝 蜜蜂农场 (BeeFarm)

一个精美的养蜂采蜜记录网站，用于记录一年四季的养蜂之旅。

## ✨ 特性

### 🗺️ 双视图模式
- **卡通地图模式**：在可爱的卡通地图上标记去过的每个地方，展示时间、地点、采集的蜂蜜等信息
- **时间轴模式**：按时间顺序展示今年的采蜜记录，支持季节分组

### 📸 丰富的媒体展示
- 支持图片预览与灯箱放大
- 支持视频嵌入（YouTube、本地视频等）
- 精美的图片画廊布局

### 🎨 设计风格
- 清新大自然色调（蜂蜜金、草绿、天蓝等）
- 精美的动画效果
- 响应式设计，支持移动端

### 🔧 模块化架构
```
BeeFarm/
├── index.html          # 主入口
├── css/
│   ├── variables.css   # CSS变量（颜色、字体、间距等）
│   ├── main.css        # 主样式（布局、通用组件）
│   ├── map.css         # 地图视图样式
│   ├── timeline.css    # 时间轴视图样式
│   └── modal.css       # 模态框/灯箱样式
├── js/
│   ├── utils.js        # 工具函数
│   ├── data.js         # 数据管理
│   ├── map.js          # 地图视图模块
│   ├── timeline.js     # 时间轴视图模块
│   ├── modal.js        # 模态框模块
│   └── app.js          # 主应用入口
└── README.md
```

## 🚀 快速开始

### 直接打开
双击 `index.html` 即可在浏览器中查看。

### 本地服务器（推荐）
```bash
# 使用 Python
python -m http.server 8080

# 使用 Node.js
npx serve .

# 使用 VS Code Live Server 插件
```

然后访问 `http://localhost:8080`

## 📝 数据格式

采蜜记录数据结构示例：

```javascript
{
  id: 1,
  location: {
    name: "云南大理洱海边",
    province: "云南省",
    city: "大理市",
    coordinates: { x: 25, y: 60 }  // 地图上的相对位置(%)
  },
  date: {
    start: "2024-03-15",
    end: "2024-04-20"
  },
  honey: {
    type: "油菜花蜜",
    amount: 280,
    unit: "kg",
    quality: "优质"  // 优质/特优
  },
  weather: {
    avgTemp: 22,
    condition: "晴朗",
    icon: "☀️"
  },
  story: {
    title: "洱海春日采蜜记",
    excerpt: "三月的洱海边，油菜花开得正盛...",
    content: "完整故事内容..."
  },
  media: [
    {
      type: "image",  // image/video
      url: "https://...",
      thumbnail: "https://...",
      caption: "图片说明"
    }
  ],
  tags: ["油菜花", "春季", "云南"],
  featured: true
}
```

## 🎯 自定义

### 修改颜色主题
编辑 `css/variables.css` 中的颜色变量：
```css
:root {
  --honey-gold: #F5A623;
  --grass-green: #7CB342;
  --sky-blue: #81D4FA;
  /* ... */
}
```

### 添加新记录
编辑 `js/data.js` 中的 `sampleData.records` 数组。

### 扩展功能
- 集成后端 API 进行数据持久化
- 添加新增/编辑记录功能
- 集成真实地图（如高德/百度地图）
- 添加数据导出功能

## 🌟 技术栈

- **HTML5** - 语义化结构
- **CSS3** - 现代样式（CSS变量、Flexbox、Grid、动画）
- **Vanilla JavaScript** - 纯原生JS，无框架依赖
- **Google Fonts** - Nunito & Quicksand 字体

## 📱 兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- 移动端浏览器

## 📄 License

MIT License

---

Made with 💛 by BeeFarm Team
