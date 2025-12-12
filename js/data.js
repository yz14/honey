/* ============================================
   BeeFarm - Data Management Module
   数据管理与状态
   ============================================ */

const DataManager = (function() {
  'use strict';

  // 示例数据 - 实际使用时可从API或本地存储加载
  const sampleData = {
    year: 2024,
    records: [
      {
        id: 1,
        location: {
          name: "云南大理洱海边",
          province: "云南省",
          city: "大理市",
          lng: 100.19,  // 经度
          lat: 25.69    // 纬度
        },
        date: {
          start: "2024-03-15",
          end: "2024-04-20"
        },
        honey: {
          type: "油菜花蜜",
          amount: 280,
          unit: "kg",
          quality: "优质"
        },
        weather: {
          avgTemp: 22,
          condition: "晴朗",
          icon: "☀️"
        },
        story: {
          title: "洱海春日采蜜记",
          excerpt: "三月的洱海边，油菜花开得正盛，金黄一片望不到边际...",
          content: `三月的洱海边，油菜花开得正盛，金黄一片望不到边际。我们驱车翻越了连绵的山路，终于在日落时分抵达了这片世外桃源。

蜜蜂们似乎比我们更早发现了这片宝地，当我们打开蜂箱时，它们已经忙碌地工作着。空气中弥漫着淡淡的花香，混合着蜂蜜的甜味，让人心旷神怡。

这一季的油菜花蜜色泽金黄，口感醇厚，带有独特的清香。每一滴都凝聚着大自然的馈赠和蜜蜂们的辛勤。

在洱海边度过的三十多天，我们收获的不仅是蜂蜜，还有与自然和谐相处的宁静与满足。`
        },
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800",
            thumbnail: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400",
            caption: "洱海边的油菜花田"
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800",
            thumbnail: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
            caption: "忙碌的蜜蜂"
          },
          {
            type: "video",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            thumbnail: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400",
            caption: "采蜜日常记录"
          }
        ],
        tags: ["油菜花", "春季", "云南", "优质蜜源"],
        featured: true
      },
      {
        id: 2,
        // distanceFromPrev: 手工设置从上一个地点到这里的实际行驶距离（公里）
        // 如果不设置，则自动计算两点直线距离
        distanceFromPrev: 800, // 从云南大理到广西南宁的实际行驶距离约800公里
        location: {
          name: "广西南宁武鸣区",
          province: "广西",
          city: "南宁市",
          lng: 108.27,
          lat: 23.16
        },
        date: {
          start: "2024-05-10",
          end: "2024-06-20"
        },
        honey: {
          type: "龙眼蜜",
          amount: 350,
          unit: "kg",
          quality: "特优"
        },
        weather: {
          avgTemp: 28,
          condition: "晴朗",
          icon: "☀️"
        },
        story: {
          title: "广西龙眼花海采蜜记",
          excerpt: "五月的广西，龙眼花开满枝头，空气中弥漫着甜蜜的芬芳...",
          content: `广西南宁武鸣区，素有"龙眼之乡"的美誉，这里种植着大片的龙眼果园。

五月初，龙眼花开始绽放。淡黄色的小花密密麻麻挂满枝头，散发出浓郁的蜜香，吸引着蜜蜂们前来采集。龙眼蜜是华南地区最受欢迎的蜂蜜品种之一。

龙眼蜜色泽金黄透亮，口感浓郁甘甜，带有龙眼特有的果香。它不易结晶，营养价值极高，有"蜂蜜中的上品"之称。

在广西的日子里，我们不仅收获了优质的龙眼蜜，还品尝了当地新鲜的龙眼和各种热带水果，感受到了南国的热情与甜蜜。`
        },
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
            thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
            caption: "龙眼果园"
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800",
            thumbnail: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
            caption: "采蜜中的蜜蜂"
          }
        ],
        tags: ["龙眼蜜", "夏季", "广西", "特优蜜源"],
        featured: true
      },
      {
        id: 3,
        location: {
          name: "湖北神农架林区",
          province: "湖北省",
          city: "神农架",
          lng: 110.68,
          lat: 31.74
        },
        date: {
          start: "2024-07-05",
          end: "2024-08-15"
        },
        honey: {
          type: "百花蜜",
          amount: 420,
          unit: "kg",
          quality: "优质"
        },
        weather: {
          avgTemp: 24,
          condition: "阴雨",
          icon: "🌧️"
        },
        story: {
          title: "神农架深山探蜜",
          excerpt: "在这片原始森林深处，我们发现了最纯净的百花蜜...",
          content: `神农架，华中地区最后一片原始森林，空气中弥漫着草木的清香。

夏季的神农架，百花争艳。这里的蜜蜂采集的是真正的百花蜜——五倍子花、七叶树花、刺槐花...种类繁多，味道层次丰富。

清晨，我们踏着露水走进蜂场，蜜蜂们已经开始了一天的工作。在这片远离城市喧嚣的净土，我们感受到了大自然最纯粹的馈赠。

这一季的百花蜜颜色较深，口感浓郁，带有独特的森林气息。每一口都能品尝出不同的花香。`
        },
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
            thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
            caption: "神农架原始森林"
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800",
            thumbnail: "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=400",
            caption: "蜂箱与森林"
          }
        ],
        tags: ["百花蜜", "夏季", "湖北", "原始森林"],
        featured: false
      },
      {
        id: 4,
        location: {
          name: "湖北恩施土家族苗族自治州",
          province: "湖北省",
          city: "恩施州",
          lng: 109.47,
          lat: 30.30
        },
        date: {
          start: "2024-08-20",
          end: "2024-09-25"
        },
        honey: {
          type: "五倍子蜜",
          amount: 200,
          unit: "kg",
          quality: "特优"
        },
        weather: {
          avgTemp: 24,
          condition: "多云",
          icon: "⛅"
        },
        story: {
          title: "恩施深山五倍子采蜜",
          excerpt: "在鄂西南的崇山峻岭中，五倍子花悄然绽放，孕育着珍贵的蜂蜜...",
          content: `恩施，位于湖北省西南部的武陵山区，这里山高林密，生态环境极为优越。

八月末，五倍子树开始开花。这种树木喜欢生长在深山老林中，花朵小而密集，散发着独特的清香。五倍子蜜是中国特有的珍稀蜂蜜品种，产量稀少。

五倍子蜜色泽深琥珀色，口感醇厚略带微涩，有独特的药香。它富含单宁酸等活性物质，具有很好的保健功效，素有"药蜜"之称。

在恩施的大山深处，我们克服了崎岖的山路，找到了这片珍贵的蜜源地。每一滴五倍子蜜都凝聚着大自然的馈赠和我们的艰辛付出。`
        },
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
            thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
            caption: "恩施深山林区"
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800",
            thumbnail: "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=400",
            caption: "山间蜂场"
          }
        ],
        tags: ["五倍子蜜", "秋季", "湖北", "药蜜"],
        featured: true
      },
      {
        id: 5,
        location: {
          name: "陕西秦岭山脉",
          province: "陕西省",
          city: "安康市",
          lng: 108.94,
          lat: 33.87
        },
        date: {
          start: "2024-04-25",
          end: "2024-05-30"
        },
        honey: {
          type: "洋槐蜜",
          amount: 380,
          unit: "kg",
          quality: "优质"
        },
        weather: {
          avgTemp: 20,
          condition: "晴朗",
          icon: "☀️"
        },
        story: {
          title: "秦岭洋槐花开时",
          excerpt: "五月的秦岭，洋槐花如雪般绽放，空气中充满甜蜜的味道...",
          content: `秦岭，横贯中国的巨龙，是中国地理上的南北分界线。这里的生态环境得天独厚，是洋槐蜜的绝佳产地。

五月初，洋槐花开始绽放。白色的花朵挂满枝头，远远望去如同覆盖了一层白雪。花香随风飘散，整个山谷都沉浸在甜蜜的芬芳中。

洋槐蜜是中国最受欢迎的蜂蜜品种之一，它色泽清澈，口感清甜，不易结晶。秦岭的洋槐蜜更是品质上乘，深受消费者喜爱。

在秦岭的一个多月里，我们亲眼见证了从花开到采蜜的全过程，每一步都是大自然与人类智慧的完美结合。`
        },
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
            thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400",
            caption: "秦岭山脉"
          }
        ],
        tags: ["洋槐蜜", "春季", "陕西", "清甜"],
        featured: false
      },
      {
        id: 6,
        location: {
          name: "黑龙江饶河县",
          province: "黑龙江",
          city: "双鸭山市",
          lng: 134.02,
          lat: 46.80
        },
        date: {
          start: "2024-08-01",
          end: "2024-09-10"
        },
        honey: {
          type: "椴树蜜",
          amount: 450,
          unit: "kg",
          quality: "特优"
        },
        weather: {
          avgTemp: 22,
          condition: "晴朗",
          icon: "🌤️"
        },
        story: {
          title: "东北椴树林采蜜",
          excerpt: "在中俄边境的原始森林中，椴树蜜飘香四溢...",
          content: `饶河县，位于黑龙江省东部，与俄罗斯隔江相望。这里有着中国最大的椴树原始森林，是椴树蜜的核心产区。

八月的饶河，椴树花开得正盛。乳白色的小花散发着浓郁的香气，吸引着蜜蜂们前来采集。椴树蜜有"蜜中之王"的美誉，其营养价值极高。

这里的椴树蜜色泽浅黄，质地细腻，有着独特的椴花香气。结晶后呈乳白色，细腻如膏，入口即化。

在东北的日子虽然短暂，但收获颇丰。我们不仅采集了大量优质的椴树蜜，还领略了东北边境的独特风情。`
        },
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800",
            thumbnail: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=400",
            caption: "东北原始森林"
          }
        ],
        tags: ["椴树蜜", "夏季", "黑龙江", "蜜中之王"],
        featured: true
      }
    ]
  };

  // 状态
  let state = {
    currentYear: new Date().getFullYear(),
    records: [],
    selectedRecord: null,
    currentView: 'map'
  };

  // 初始化
  function init() {
    loadData();
  }

  // 加载数据
  function loadData() {
    // 实际项目中可以从API或localStorage加载
    state.records = sampleData.records;
    state.currentYear = sampleData.year;
  }

  // 获取所有记录
  function getRecords() {
    return state.records;
  }

  // 获取当前年份的记录
  function getRecordsByYear(year) {
    return state.records.filter(record => {
      const recordYear = new Date(record.date.start).getFullYear();
      return recordYear === year;
    });
  }

  // 根据ID获取记录
  function getRecordById(id) {
    return state.records.find(record => record.id === id);
  }

  // 计算两点之间的距离（使用Haversine公式，返回公里数）
  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // 地球半径（公里）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  // 获取统计数据
  function getStats() {
    const records = state.records;
    const totalHoney = records.reduce((sum, r) => sum + r.honey.amount, 0);
    const locations = new Set(records.map(r => r.location.name)).size;
    
    // 计算总天数
    const totalDays = records.reduce((sum, r) => {
      const start = new Date(r.date.start);
      const end = new Date(r.date.end);
      return sum + Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }, 0);

    // 计算总省份数
    const provinces = new Set(records.map(r => r.location.province)).size;

    // 计算总公里数（按时间顺序）
    const sortedRecords = [...records].sort((a, b) => 
      new Date(a.date.start) - new Date(b.date.start)
    );
    
    let totalKm = 0;
    for (let i = 0; i < sortedRecords.length - 1; i++) {
      const from = sortedRecords[i];
      const to = sortedRecords[i + 1];
      
      // 如果有手工设置的距离，使用手工距离
      if (to.distanceFromPrev !== undefined) {
        totalKm += to.distanceFromPrev;
      } else {
        // 否则计算直线距离
        totalKm += calculateDistance(
          from.location.lat, from.location.lng,
          to.location.lat, to.location.lng
        );
      }
    }

    return {
      totalHoney,
      locations,
      totalDays,
      recordCount: records.length,
      provinces,
      totalKm
    };
  }

  // 按季节分组
  function getRecordsBySeason() {
    const seasons = {
      spring: { name: '春季', icon: '🌸', records: [] },
      summer: { name: '夏季', icon: '☀️', records: [] },
      autumn: { name: '秋季', icon: '🍂', records: [] },
      winter: { name: '冬季', icon: '❄️', records: [] }
    };

    state.records.forEach(record => {
      const month = new Date(record.date.start).getMonth() + 1;
      if (month >= 3 && month <= 5) {
        seasons.spring.records.push(record);
      } else if (month >= 6 && month <= 8) {
        seasons.summer.records.push(record);
      } else if (month >= 9 && month <= 11) {
        seasons.autumn.records.push(record);
      } else {
        seasons.winter.records.push(record);
      }
    });

    return seasons;
  }

  // 获取当前年份
  function getCurrentYear() {
    return state.currentYear;
  }

  // 设置当前年份
  function setCurrentYear(year) {
    state.currentYear = year;
  }

  // 获取当前视图
  function getCurrentView() {
    return state.currentView;
  }

  // 设置当前视图
  function setCurrentView(view) {
    state.currentView = view;
  }

  // 获取选中的记录
  function getSelectedRecord() {
    return state.selectedRecord;
  }

  // 设置选中的记录
  function setSelectedRecord(record) {
    state.selectedRecord = record;
  }

  // 蜂蜜详细信息数据库
  const honeyDetails = {
    '油菜花': {
      name: '油菜花蜜', 
      // 油菜花田图片 - 金黄色的油菜花海
      image: 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=800&q=80',
      color: '#F5C542', baume: '41-42°Be', season: '春季(3-4月)', origin: '云南',
      crystallize: '易结晶，乳白细腻',
      taste: '清香淡雅、口感细腻，甜度适中，入口即化，后味清爽回甘',
      nutrition: '果糖≈40%，葡萄糖≈35%，维生素B1、B2、C，矿物质钙、铁、锌，多种活性酶',
      benefits: '清热解毒、润肺止咳，美容养颜、淡化色斑，促进消化、增进食欲',
      storage: '阴凉干燥处，避光保存', price: '68-88元/500g'
    },
    '龙眼': {
      name: '龙眼蜜', 
      // 龙眼树/果实图片
      image: 'https://images.unsplash.com/photo-1568702846914-96b305d2uj68?w=800&q=80',
      color: '#C68E4E', baume: '42-43°Be', season: '夏季(5-6月)', origin: '广西南宁',
      crystallize: '不易结晶，质地浓稠',
      taste: '浓郁甘甜、果香四溢，口感醇厚丝滑，回味悠长，带有龙眼特有的鲜果芳香',
      nutrition: '果糖≈45%，葡萄糖≈30%，维生素B1、B2、C，富含铁、镁、锂等矿物质，多种氨基酸和活性酶',
      benefits: '补气养血、安神益智，滑肤美容、延缓衰老，温补脏腔、增强体质',
      storage: '密封阴凉保存', price: '98-128元/500g'
    },
    '五倍子': {
      name: '五倍子蜜', 
      // 山野树林图片 - 五倍子树生长环境
      image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&q=80',
      color: '#8B5742', baume: '42-43°Be', season: '秋季(8-9月)', origin: '湖北恩施',
      crystallize: '不易结晶，质地细腻',
      taste: '醇厚微涩、药香独特，口感细腻浓稠，回味甘润，带有山野草本清香',
      nutrition: '果糖≈38%，葡萄糖≈35%，富含单宁酸、没食子酸，维生素C、E，多种微量元素',
      benefits: '清热解毒、消炎杀菌，润肺止咳、化痰平喘，收敛止治、改善肠胃',
      storage: '密封避光保存', price: '138-188元/500g'
    },
    '洋槐': {
      name: '洋槐蜜', 
      // 洋槐花图片 - 白色槐花串
      image: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800&q=80',
      color: '#F8F4E3', baume: '41-42°Be', season: '春季(4-5月)', origin: '陕西',
      crystallize: '不易结晶，色泽清透',
      taste: '清香淡雅、甜而不腻，口味柔和细腻，后味清爽，带有淡淡槐花香气',
      nutrition: '果糖≈45%，葡萄糖≈30%，维生素C、K，矿物质钙、磷，多种酶类：淀粉酶、转化酶等',
      benefits: '润肺止咳、清热解燥，安神助眠、改善睡眠，促进肠道蠕动、缓解便秘，温和不燥',
      storage: '常温避光保存', price: '78-98元/500g'
    },
    '百花': {
      name: '百花蜜', 
      // 野花丛生图片 - 各种野花
      image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
      color: '#D4A857', baume: '41-42°Be', season: '夏季(6-8月)', origin: '湖北神农架',
      crystallize: '易结晶，颜色深浅不一',
      taste: '花香馥郁、层次丰富，口感醇厚满满，回味悠长，融合多种花香的综合风味',
      nutrition: '果糖≈40%，葡萄糖≈34%，维生素B群、C、E，矿物质铁、镁、锌，多种花粉营养',
      benefits: '滋阴润燥、补中益气，清热解毒、增强免疫，调节肠胃、润肤美容',
      storage: '阴凉干燥处，避光保存', price: '58-78元/500g'
    },
    '荆条': {
      name: '荆条蜜', 
      // 荆条花图片 - 紫色荆条花
      image: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=800&q=80',
      color: '#C9874D', baume: '41-42°Be', season: '夏季(6-7月)', origin: '河北',
      crystallize: '易结晶，颗粒细腻',
      taste: '甜润醇厚、略带微酸，口感绵密顺滑，回味持久，有独特草本清香',
      nutrition: '果糖≈40%，葡萄糖≈33%，维生素B1、B2，矿物质铁、锰、铜，天然果酸',
      benefits: '补气养血、强身健体，健脾益胃、促进消化，祛风除湿、增强体质',
      storage: '阴凉干燥处', price: '58-78元/500g'
    },
    '枣花': {
      name: '枣花蜜', 
      // 枣树花图片 - 枣树开花
      image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800&q=80',
      color: '#6B3A23', baume: '42-43°Be', season: '夏季(5-6月)', origin: '新疆',
      crystallize: '不易结晶，色深质浓',
      taste: '浓郁甘甜、枣香四溢，口感厚重饱满，甜度较高，回味带有红枣特有香气',
      nutrition: '果糖≈43%，葡萄糖≈32%，维生素C、P，矿物质铁、铜、锌，丰富的氨基酸',
      benefits: '补血养气、滋补强身，安神益智、养心宁神，养肝护肝、美容驻颜',
      storage: '密封避光保存', price: '88-118元/500g'
    },
    '椴树': {
      name: '椴树蜜', 
      // 椴树花图片 - 椴树和椴树花
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80',
      color: '#F0E6C8', baume: '41-42°Be', season: '夏季(7月)', origin: '长白山',
      crystallize: '易结晶，雪白细腻',
      taste: '清香怡人、甜而不腻，口感细腻如脂，入口即化，带有椴树花独特清香',
      nutrition: '果糖≈39%，葡萄糖≈36%，维生素B群、E，矿物质钙、镁、钾，多种活性酶和有机酸',
      benefits: '清热润燥、生津止渴，养心安神、缓解焦虑，增强记忆、延缓衰老',
      storage: '低温密封保存', price: '98-128元/500g'
    }
  };

  // 获取蜂蜜详情
  function getHoneyDetails(type) {
    const key = type.replace('蜜', '');
    return honeyDetails[key] || null;
  }

  // 获取所有蜂蜜类型
  function getAllHoneyTypes() {
    return Object.keys(honeyDetails);
  }

  // 公开API
  return {
    init,
    getRecords,
    getRecordsByYear,
    getRecordById,
    getStats,
    getRecordsBySeason,
    getCurrentYear,
    setCurrentYear,
    getCurrentView,
    setCurrentView,
    getSelectedRecord,
    setSelectedRecord,
    getHoneyDetails,
    getAllHoneyTypes
  };
})();
