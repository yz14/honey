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
        distanceFromPrev: 950, // 从云南大理到四川若尔盖的实际行驶距离约950公里
        location: {
          name: "四川阿坝若尔盖草原",
          province: "四川省",
          city: "阿坝州",
          lng: 102.96,
          lat: 33.58
        },
        date: {
          start: "2024-05-10",
          end: "2024-06-25"
        },
        honey: {
          type: "高原野花蜜",
          amount: 350,
          unit: "kg",
          quality: "特优"
        },
        weather: {
          avgTemp: 18,
          condition: "多云",
          icon: "⛅"
        },
        story: {
          title: "若尔盖高原寻蜜之旅",
          excerpt: "海拔3500米的高原上，野花遍地，蜜蜂们在蓝天下自由飞翔...",
          content: `若尔盖，这片被誉为"川西北高原的绿洲"的地方，是我们每年必访的采蜜圣地。

五月的高原，正是百花盛开的季节。紫色的马先蒿、黄色的金莲花、白色的狼毒花...构成了一幅绚丽多彩的画卷。

高原的蜂蜜有着独特的韵味，因为花期短暂，蜜蜂们采集的每一滴蜜都格外珍贵。这里的野花蜜带有淡淡的草药香气，据说有很好的保健功效。

在这片广袤的草原上，我们与牧民们结下了深厚的友谊。他们淳朴热情，常常邀请我们品尝酥油茶和青稞酒。`
        },
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
            thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
            caption: "若尔盖草原风光"
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1551516594-56cb78394645?w=800",
            thumbnail: "https://images.unsplash.com/photo-1551516594-56cb78394645?w=400",
            caption: "高原野花"
          }
        ],
        tags: ["野花蜜", "高原", "四川", "特优蜜源"],
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
          name: "新疆伊犁河谷",
          province: "新疆",
          city: "伊犁州",
          lng: 81.32,
          lat: 43.92
        },
        date: {
          start: "2024-06-20",
          end: "2024-07-30"
        },
        honey: {
          type: "薰衣草蜜",
          amount: 200,
          unit: "kg",
          quality: "特优"
        },
        weather: {
          avgTemp: 26,
          condition: "晴朗",
          icon: "☀️"
        },
        story: {
          title: "伊犁薰衣草花海",
          excerpt: "紫色的花海一望无际，空气中弥漫着迷人的芳香...",
          content: `伊犁，被称为"塞外江南"的地方，六月的这里是薰衣草的天堂。

紫色的花海延绵数十公里，当风吹过时，花浪翻滚，美不胜收。我们的蜜蜂在这片紫色海洋中忙碌着，采集着这独特的芳香。

薰衣草蜜是所有蜂蜜中最具特色的品种之一，它带有浓郁的薰衣草香气，颜色呈琥珀色，入口后有淡淡的花香在舌尖萦绕。

在伊犁的日子里，我们不仅收获了珍贵的薰衣草蜜，还领略了新疆的大美风光。雪山、草原、河谷...每一处都是一幅绝美的画卷。`
        },
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1499002238440-d264f7d4eb93?w=800",
            thumbnail: "https://images.unsplash.com/photo-1499002238440-d264f7d4eb93?w=400",
            caption: "伊犁薰衣草花田"
          },
          {
            type: "video",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            thumbnail: "https://images.unsplash.com/photo-1499002238440-d264f7d4eb93?w=400",
            caption: "薰衣草田采蜜记录"
          }
        ],
        tags: ["薰衣草", "夏季", "新疆", "芳香蜜"],
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
      name: '油菜花蜜', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600',
      color: '#FFD700', baume: '41-42°Be', season: '春季(3-4月)', origin: '云南、四川、贵州',
      taste: '清香淡雅，口感细腻', crystallize: '易结晶，结晶后呈乳白色',
      nutrition: { glucose: '35%', fructose: '40%', vitamins: 'B1,B2,C', minerals: '钙、铁、锌' },
      benefits: ['清热解毒', '润肺止咳', '美容养颜', '促进消化'],
      storage: '阴凉干燥处，避光保存', price: '68-88元/500g'
    },
    '高原野花': {
      name: '高原野花蜜', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600',
      color: '#DAA520', baume: '42-43°Be', season: '夏季(5-7月)', origin: '四川阿坝、青海、西藏',
      taste: '花香浓郁，回味悠长', crystallize: '不易结晶，质地浓稠',
      nutrition: { glucose: '32%', fructose: '42%', vitamins: 'B群,E', minerals: '钾、镁、硒' },
      benefits: ['增强免疫', '抗氧化', '调节血压', '改善睡眠'],
      storage: '密封冷藏，保质期长', price: '128-168元/500g'
    },
    '槐花': {
      name: '槐花蜜', image: 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=600',
      color: '#F5F5DC', baume: '41-42°Be', season: '春季(4-5月)', origin: '山东、河南、陕西',
      taste: '清淡爽口，带槐花香', crystallize: '不易结晶，色泽清透',
      nutrition: { glucose: '30%', fructose: '45%', vitamins: 'C,K', minerals: '钙、磷' },
      benefits: ['清热凉血', '护肝养胃', '安神助眠', '润肠通便'],
      storage: '常温避光保存', price: '78-98元/500g'
    },
    '荆条': {
      name: '荆条蜜', image: 'https://images.unsplash.com/photo-1550411294-875e72553a22?w=600',
      color: '#CD853F', baume: '41-42°Be', season: '夏季(6-7月)', origin: '河北、山西、内蒙古',
      taste: '甜润醇厚，略带酸味', crystallize: '易结晶，颗粒细腻',
      nutrition: { glucose: '33%', fructose: '40%', vitamins: 'B1,B2', minerals: '铁、锰' },
      benefits: ['补气养血', '健脾益胃', '祛风除湿', '增强体质'],
      storage: '阴凉干燥处', price: '58-78元/500g'
    },
    '枣花': {
      name: '枣花蜜', image: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600',
      color: '#8B4513', baume: '42-43°Be', season: '夏季(5-6月)', origin: '河北、山东、新疆',
      taste: '浓郁甘甜，枣香四溢', crystallize: '不易结晶，色深质浓',
      nutrition: { glucose: '32%', fructose: '43%', vitamins: 'C,P', minerals: '铁、铜、锌' },
      benefits: ['补血养气', '安神益智', '养肝护肝', '美容驻颜'],
      storage: '密封避光保存', price: '88-118元/500g'
    },
    '椴树': {
      name: '椴树蜜', image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600',
      color: '#FFFACD', baume: '41-42°Be', season: '夏季(7月)', origin: '黑龙江、吉林、长白山',
      taste: '清香怡人，甜而不腻', crystallize: '易结晶，雪白细腻',
      nutrition: { glucose: '36%', fructose: '39%', vitamins: 'B群,E', minerals: '钙、镁、钾' },
      benefits: ['清热润燥', '养心安神', '增强记忆', '延缓衰老'],
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
