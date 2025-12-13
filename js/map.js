/* ============================================
   BeeFarm - Map View Module (ECharts Version)
   使用ECharts实现精确中国地图
   ============================================ */

const MapView = (function() {
  'use strict';

  let container = null;
  let chartInstance = null;
  let selectedRecord = null;

  // 省份配色（卡通风格绿色系）
  const provinceColors = {
    '新疆': '#A5D6A7', '西藏': '#C8E6C9', '内蒙古': '#DCEDC8',
    '青海': '#E8F5E9', '四川': '#81C784', '黑龙江': '#AED581',
    '甘肃': '#C5E1A5', '云南': '#66BB6A', '广西': '#81C784',
    '湖南': '#A5D6A7', '陕西': '#9CCC65', '广东': '#8BC34A',
    '吉林': '#C5E1A5', '河北': '#DCEDC8', '湖北': '#81C784',
    '贵州': '#66BB6A', '山东': '#AED581', '江西': '#A5D6A7',
    '河南': '#C5E1A5', '辽宁': '#8BC34A', '山西': '#DCEDC8',
    '安徽': '#9CCC65', '福建': '#81C784', '浙江': '#66BB6A',
    '江苏': '#AED581', '重庆': '#A5D6A7', '宁夏': '#E8F5E9',
    '海南': '#4CAF50', '台湾': '#81C784', '北京': '#FF8A65',
    '天津': '#FFAB91', '上海': '#FF7043', '香港': '#FFB74D',
    '澳门': '#FFA726', '南海诸岛': '#B2DFDB'
  };

  // 初始化
  function init(containerEl) {
    container = containerEl;
    render();
  }

  // 渲染地图视图
  function render() {
    const records = DataManager.getRecords();
    const stats = DataManager.getStats();
    
    // 生成蜂蜜瓶子数据 - 从采蜜记录中统计产量
    const honeyByType = {};
    records.forEach(r => {
      const type = r.honey.type.replace('蜜', '');
      honeyByType[type] = (honeyByType[type] || 0) + r.honey.amount;
    });
    
    // 蜂蜜瓶子颜色（与真实蜂蜜颜色对应 - 按用户文案）
    const honeyColors = {
      '椴树': '#F0E6C8',     // 浅琥珀色至乳白色
      '百花': '#D4A857',     // 金黄至深琥珀色
      '洋槐': '#FDF9E8',     // 水白色至浅黄色
      '龙眼': '#C68E4E',     // 琥珀色至深褐色
      '荔枝': '#E8C170',     // 浅黄色至琥珀色
      '油菜花': '#F5DFA0',   // 浅黄色至白色
      '五倍子': '#8B5742',   // 深琥珀色至棕褐色
      '枣花': '#6B3A23',     // 深琥珀色至红棕色
      '荆条': '#E5B56A'      // 浅琥珀色至深黄色
    };
    
    // 获取所有9种蜂蜜类型（从 honeyDetails 数据库）
    const allHoneyTypes = DataManager.getAllHoneyTypes();
    
    // 生成所有蜂蜜瓶子（有产量的显示产量，无产量的也显示但不显示产量）
    const honeyBottlesHtml = allHoneyTypes
      .map(type => {
        const color = honeyColors[type] || '#FFB347';
        const amount = honeyByType[type];
        const amountText = amount ? `${amount}kg` : '售完';
        return `
          <div class="honey-bottle" onclick="MapView.showHoneyDetail('${type}')" data-type="${type}">
            <div class="honey-bottle__jar">
              <div class="honey-bottle__cap"></div>
              <div class="honey-bottle__body" style="background: linear-gradient(180deg, ${color}dd 0%, ${color} 100%);">
                <span class="honey-bottle__name">${type}</span>
              </div>
              <div class="honey-bottle__amount">${amountText}</div>
            </div>
          </div>
        `;
      }).join('');
    
    container.innerHTML = `
      <div class="map-container">
        <!-- ECharts 地图容器 -->
        <div class="echarts-map" id="echarts-map"></div>
        
        <!-- 手机端标语 - 右上角竖列一句排列 -->
        <div class="map-slogan" id="map-slogan">
          <div class="map-slogan__col">春入云南</div>
          <div class="map-slogan__col">夏越秦岭</div>
          <div class="map-slogan__col">逐花深入云深处</div>
          <div class="map-slogan__col">采得山野四时甜</div>
        </div>
        
        <!-- 省份名称显示 -->
        <div class="map-province-label" id="province-label"></div>
        
        <!-- 左侧统计描述（手机端显示） -->
        <div class="map-stats-overlay" id="map-stats-overlay">
          <p><strong>${stats.recordCount}</strong>次转场</p>
          <p><strong>${stats.provinces}</strong>省辗转</p>
          <p><strong>${stats.recordCount * 2 * 160}</strong>次蜂箱搬运</p>
          <p><strong>${stats.totalKm}</strong>公里风雨兼程</p>
          <p>只为这一口山野的甜</p>
        </div>
        
        <!-- 底部蜂蜜瓶子（手机端显示） -->
        <div class="honey-bottles-container" id="honey-bottles">
          <div class="honey-bottles__scroll">${honeyBottlesHtml}</div>
        </div>
        
        <!-- 蜂蜜详情卡片 -->
        <div class="honey-detail-card" id="honey-detail-card">
          <div class="honey-detail-card__overlay" onclick="MapView.closeHoneyDetail()"></div>
          <div class="honey-detail-card__content" id="honey-detail-content"></div>
        </div>
        
        <!-- 控制按钮 -->
        <div class="map-controls">
          <button class="map-control-btn" title="放大" onclick="MapView.zoomIn()">+</button>
          <button class="map-control-btn" title="缩小" onclick="MapView.zoomOut()">−</button>
        </div>
        
        <!-- 联系方式按钮 -->
        <button class="contact-btn" title="联系我们" onclick="MapView.showContactModal()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </button>
        
        <!-- 联系方式弹窗 -->
        <div class="contact-modal" id="contact-modal">
          <div class="contact-modal__overlay" onclick="MapView.closeContactModal()"></div>
          <div class="contact-modal__content">
            <p class="contact-modal__note">忙着照看蜂箱，来电不一定能及时接到，加微信留言更方便，感谢体谅！</p>
            <div class="contact-modal__body">
              <div class="contact-item" onclick="MapView.callPhone('12345678901')">
                <span class="contact-item__name">袁师傅</span>
                <span class="contact-item__phone">123-4567-8901</span>
                <span class="contact-item__icon">📱</span>
              </div>
              <div class="contact-item" onclick="MapView.callPhone('12345678901')">
                <span class="contact-item__name">张师傅</span>
                <span class="contact-item__phone">123-4567-8901</span>
                <span class="contact-item__icon">📱</span>
              </div>
            </div>
            <button class="contact-modal__close" onclick="MapView.closeContactModal()">关闭</button>
          </div>
        </div>
        
        <!-- 图例 -->
        <div class="map-legend">
          <div class="map-legend__title">🗺️ 采蜜足迹</div>
          <div class="map-legend__items">
            <div class="map-legend__item">
              <span class="map-legend__dot map-legend__dot--high"></span>
              <span>> 400kg 高产</span>
            </div>
            <div class="map-legend__item">
              <span class="map-legend__dot map-legend__dot--medium"></span>
              <span>200-400kg 中产</span>
            </div>
            <div class="map-legend__item">
              <span class="map-legend__dot map-legend__dot--low"></span>
              <span>< 200kg</span>
            </div>
          </div>
        </div>
        
        <!-- 信息面板 -->
        <div class="map-info-panel" id="map-info-panel">
          <button class="map-info-panel__close" onclick="MapView.closeInfoPanel()">
            ${Utils.getIcon('close')}
          </button>
          <div class="map-info-panel__header">
            <div class="map-info-panel__title" id="panel-title"></div>
            <div class="map-info-panel__subtitle" id="panel-subtitle"></div>
          </div>
          <div class="map-info-panel__content" id="panel-content"></div>
        </div>
      </div>
    `;

    // 初始化 ECharts 地图
    initEChartsMap(records);
  }

  // 初始化 ECharts 地图
  function initEChartsMap(records) {
    const mapDom = document.getElementById('echarts-map');
    if (!mapDom) return;

    // 检查ECharts是否加载
    if (typeof echarts === 'undefined') {
      mapDom.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#f44336;font-size:16px;flex-direction:column;gap:10px;">❌ ECharts加载失败<br><small>请检查网络连接后刷新页面</small></div>';
      return;
    }

    // 等待中国地图数据加载（最多等待5秒）
    let attempts = 0;
    const maxAttempts = 50;
    
    function tryInitMap() {
      attempts++;
      
      if (echarts.getMap('china')) {
        // 地图数据已加载，开始渲染
        renderEChartsMap(mapDom, records);
      } else if (attempts < maxAttempts) {
        // 继续等待
        mapDom.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#689F38;font-size:16px;">🗺️ 地图加载中...</div>';
        setTimeout(tryInitMap, 100);
      } else {
        // 超时，显示错误
        mapDom.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#f44336;font-size:16px;flex-direction:column;gap:10px;text-align:center;">❌ 中国地图数据加载超时<br><small>请检查网络连接后刷新页面</small></div>';
      }
    }
    
    tryInitMap();
  }

  // 渲染ECharts地图
  function renderEChartsMap(mapDom, records) {
    // 创建 ECharts 实例
    chartInstance = echarts.init(mapDom);

    // 准备省份数据（用于着色）
    const provinceData = Object.keys(provinceColors).map(name => ({
      name: name,
      value: 0,
      itemStyle: { areaColor: provinceColors[name] }
    }));

    // 准备采蜜点数据 - 统一大小，通过颜色深浅表示产量
    const maxHoney = Math.max(...records.map(r => r.honey.amount));
    const scatterData = records.map(record => {
      const honey = record.honey.amount;
      // 根据产量计算颜色深浅 (0.3 - 1.0)
      const ratio = honey / maxHoney;
      const opacity = 0.4 + ratio * 0.6;
      // 颜色从浅黄到深橙
      const r = Math.round(255);
      const g = Math.round(200 - ratio * 80);
      const b = Math.round(100 - ratio * 100);
      const color = `rgb(${r}, ${g}, ${b})`;

      return {
        name: record.location.name,
        value: [record.location.lng, record.location.lat, honey],
        symbolSize: 24, // 统一大小
        itemStyle: {
          color: color,
          opacity: opacity,
          shadowBlur: 8,
          shadowColor: 'rgba(255, 152, 0, 0.4)'
        },
        record: record
      };
    });

    // 准备路径数据
    const sortedRecords = [...records].sort((a, b) => 
      new Date(a.date.start) - new Date(b.date.start)
    );
    
    // 为每条路径线设置不同的延迟，实现依次流动效果
    const linesData = [];
    const totalLines = sortedRecords.length - 1;
    
    for (let i = 0; i < totalLines; i++) {
      const from = sortedRecords[i];
      const to = sortedRecords[i + 1];
      
      // 计算这条线的时间信息用于tooltip
      const fromDate = new Date(from.date.start).toLocaleDateString('zh-CN');
      const toDate = new Date(to.date.start).toLocaleDateString('zh-CN');
      
      linesData.push({
        name: `${from.location.city} → ${to.location.city}`,
        coords: [
          [from.location.lng, from.location.lat],
          [to.location.lng, to.location.lat]
        ],
        lineStyle: {
          curveness: 0.3
        },
        // 用于依次播放动画的索引
        lineIndex: i,
        fromCity: from.location.city,
        toCity: to.location.city,
        fromDate: fromDate,
        toDate: toDate
      });
    }

    // 检测是否为手机端
    const isMobile = window.innerWidth <= 768;
    
    // ECharts 配置
    const option = {
      backgroundColor: 'transparent',
      title: {
        text: '采蜜足迹图',
        left: 'center',
        top: isMobile ? 6 : 15,
        textStyle: {
          color: '#6B4423',
          fontSize: isMobile ? 20 : 24,
          fontWeight: 'bold',
          fontFamily: '"Ma Shan Zheng", "ZCOOL XiaoWei", "KaiTi", "STKaiti", "楷体", cursive, serif'
        }
      },
      tooltip: {
        show: !isMobile, // 手机端禁用tooltip，使用底部面板
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#FFA726',
        borderWidth: 2,
        borderRadius: 12,
        padding: [12, 16],
        textStyle: {
          color: '#333',
          fontSize: 13
        },
        formatter: function(params) {
          if (params.seriesType === 'scatter' && params.data.record) {
            const r = params.data.record;
            return `
              <div style="font-weight: bold; font-size: 15px; margin-bottom: 8px;">
                🍯 ${r.location.name}
              </div>
              <div style="color: #666; margin-bottom: 4px;">
                ${r.location.province} · ${r.location.city}
              </div>
              <div style="margin-top: 8px;">
                <span style="color: #FF8F00; font-weight: bold; font-size: 16px;">
                  ${r.honey.amount}${r.honey.unit}
                </span>
                <span style="color: #888; margin-left: 8px;">${r.honey.type}</span>
              </div>
              <div style="color: #999; font-size: 12px; margin-top: 6px;">
                点击查看详情
              </div>
            `;
          }
          return '';
        }
      },
      geo: {
        map: 'china',
        roam: true,
        // 手机端调整地图以适应屏幕宽度
        zoom: isMobile ? 1.15 : 1.2,
        center: isMobile ? [105, 35] : [105, 36],
        aspectScale: 0.75, // 保持正常宽高比
        scaleLimit: {
          min: isMobile ? 1.0 : 0.8,
          max: 5
        },
        label: {
          show: !isMobile, // 手机端不显示省份名称，太挤
          fontSize: 10,
          color: '#558B2F',
          formatter: function(params) {
            // 只显示大省份的名称
            const largeProvinces = ['新疆', '西藏', '内蒙古', '青海', '四川', '黑龙江', '云南', '广东', '山东'];
            if (largeProvinces.includes(params.name)) {
              return params.name;
            }
            return '';
          }
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            color: '#E65100',
            fontWeight: 'bold'
          },
          itemStyle: {
            areaColor: '#FFE082',
            shadowBlur: 20,
            shadowColor: 'rgba(255, 193, 7, 0.5)'
          }
        },
        itemStyle: {
          borderColor: '#689F38',
          borderWidth: 1,
          shadowBlur: 5,
          shadowColor: 'rgba(0, 0, 0, 0.1)'
        },
        regions: provinceData
      },
      series: [
        // 迁徙路径线 - 底层静态线（显示完整路径）
        {
          type: 'lines',
          coordinateSystem: 'geo',
          zlevel: 1,
          lineStyle: {
            color: '#FFE0B2',
            width: 2,
            opacity: 0.4,
            curveness: 0.3
          },
          data: linesData
        },
        // 迁徙路径线 - 动态流动效果（单条流动线，由JS控制切换）
        {
          name: 'migrationEffect',
          type: 'lines',
          coordinateSystem: 'geo',
          zlevel: 2,
          effect: {
            show: true,
            period: 1.5, // 流动速度
            trailLength: 0.5,
            symbol: 'arrow',
            symbolSize: 6,
            color: '#FF8F00',
            loop: true
          },
          lineStyle: {
            color: '#FFA726',
            width: 3,
            opacity: 0.9,
            curveness: 0.3
          },
          data: linesData.length > 0 ? [linesData[0]] : [] // 初始只显示第一条
        },
        // 采蜜点标记 - 使用蜂蜜罐造型的pin
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 3,
          symbol: 'pin',
          symbolSize: function(val) {
            const honey = val[2];
            // 手机端使用更小的标记
            const scale = isMobile ? 0.7 : 1;
            if (honey > 400) return 45 * scale;
            if (honey >= 200) return 38 * scale;
            return 30 * scale;
          },
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#FFD54F' },
                { offset: 1, color: '#FF8F00' }
              ]
            },
            borderColor: '#fff',
            borderWidth: isMobile ? 1 : 2,
            shadowBlur: isMobile ? 5 : 10,
            shadowColor: 'rgba(255, 152, 0, 0.5)'
          },
          label: {
            show: !isMobile, // 手机端不显示标签，太挤
            formatter: '{@[2]}',
            position: 'inside',
            fontSize: 10,
            fontWeight: 'bold',
            color: '#fff'
          },
          data: scatterData,
          animationDelay: function(idx) {
            return idx * 200;
          }
        },
        // 采蜜点涟漪效果
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 2,
          rippleEffect: {
            brushType: 'stroke',
            scale: 4,
            period: 3
          },
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#FFA726',
            opacity: 0.6
          },
          data: scatterData.map(item => ({
            name: item.name,
            value: item.value
          }))
        }
      ]
    };

    // 应用配置
    chartInstance.setOption(option);

    // 点击事件
    chartInstance.on('click', function(params) {
      if (params.seriesType === 'scatter' && params.data.record) {
        showMarkerInfo(params.data.record);
      } else if (params.componentType === 'geo') {
        // 点击省份显示省份名称（手机端和桌面端都支持）
        showProvinceLabel(params.name);
      }
    });
    
    // 桌面端：鼠标悬停在省份上时显示名称
    if (!isMobile) {
      chartInstance.on('mouseover', function(params) {
        if (params.componentType === 'geo') {
          showProvinceLabel(params.name);
        }
      });
      
      chartInstance.on('mouseout', function(params) {
        if (params.componentType === 'geo') {
          hideProvinceLabel();
        }
      });
    }

    // 窗口大小变化时重绘
    window.addEventListener('resize', function() {
      if (chartInstance) {
        chartInstance.resize();
      }
    });
    
    // 流动线依次切换动画
    let currentLineIndex = 0;
    let isZooming = false; // 是否正在缩放
    let zoomTimeout = null;
    
    // 监听地图缩放/平移事件
    const statsOverlay = document.getElementById('map-stats-overlay');
    const honeyChart = document.getElementById('honey-chart');
    chartInstance.on('georoam', function(params) {
      if (!isZooming) {
        isZooming = true;
        // 缩放时隐藏流动线效果
        chartInstance.setOption({
          series: [{
            name: 'migrationEffect',
            data: []
          }]
        }, false);
        // 隐藏左上角描述和底部柱状图
        if (statsOverlay) statsOverlay.classList.add('hidden');
        if (honeyChart) honeyChart.classList.add('hidden');
      }
      
      // 清除之前的定时器
      if (zoomTimeout) {
        clearTimeout(zoomTimeout);
      }
      
      // 缩放结束后恢复
      zoomTimeout = setTimeout(function() {
        isZooming = false;
        // 恢复流动线
        if (chartInstance && linesData.length > 0) {
          chartInstance.setOption({
            series: [{
              name: 'migrationEffect',
              data: [linesData[currentLineIndex]]
            }]
          }, false);
        }
        // 检查缩放级别，如果放大太多则保持隐藏
        const currentZoom = chartInstance.getOption().geo[0].zoom;
        if (currentZoom <= 1.5) {
          if (statsOverlay) statsOverlay.classList.remove('hidden');
          if (honeyChart) honeyChart.classList.remove('hidden');
        }
      }, 300);
    });
    
    if (linesData.length > 1) {
      const lineInterval = 1500; // 每条线显示1.5秒后切换到下一条
      
      // 清除之前的定时器
      if (window.migrationTimer) {
        clearInterval(window.migrationTimer);
      }
      
      window.migrationTimer = setInterval(function() {
        if (!chartInstance) {
          clearInterval(window.migrationTimer);
          return;
        }
        
        // 如果正在缩放，跳过更新
        if (isZooming) return;
        
        currentLineIndex = (currentLineIndex + 1) % linesData.length;
        
        // 更新流动线数据，只显示当前这一条
        chartInstance.setOption({
          series: [{
            name: 'migrationEffect',
            data: [linesData[currentLineIndex]]
          }]
        }, false);
      }, lineInterval);
    }
  }

  // 显示标记信息
  function showMarkerInfo(record) {
    const panel = document.getElementById('map-info-panel');
    const title = document.getElementById('panel-title');
    const subtitle = document.getElementById('panel-subtitle');
    const content = document.getElementById('panel-content');
    
    if (!panel || !title || !subtitle || !content) return;

    selectedRecord = record;
    
    // 更新面板内容
    const dateRange = Utils.getDateRange(record.date.start, record.date.end);
    
    title.textContent = record.location.name;
    subtitle.textContent = `${record.location.province} · ${dateRange.rangeText}`;
    
    content.innerHTML = `
      <div class="map-info-panel__stats">
        <div class="map-info-panel__stat">
          <span class="map-info-panel__stat-icon">🍯</span>
          <div>
            <div class="map-info-panel__stat-value">${record.honey.amount}${record.honey.unit}</div>
            <div class="map-info-panel__stat-label">产量</div>
          </div>
        </div>
        <div class="map-info-panel__stat">
          <span class="map-info-panel__stat-icon">🌸</span>
          <div>
            <div class="map-info-panel__stat-value">${record.honey.type}</div>
            <div class="map-info-panel__stat-label">蜜源</div>
          </div>
        </div>
        <div class="map-info-panel__stat">
          <span class="map-info-panel__stat-icon">📅</span>
          <div>
            <div class="map-info-panel__stat-value">${dateRange.days}天</div>
            <div class="map-info-panel__stat-label">驻留</div>
          </div>
        </div>
        <div class="map-info-panel__stat">
          <span class="map-info-panel__stat-icon">${record.weather.icon}</span>
          <div>
            <div class="map-info-panel__stat-value">${record.weather.avgTemp}°C</div>
            <div class="map-info-panel__stat-label">气温</div>
          </div>
        </div>
      </div>
      <p style="margin-top: var(--space-3); color: var(--gray-600); font-size: var(--text-sm); line-height: 1.5;">
        ${record.story.excerpt}
      </p>
      <button class="btn btn--primary btn--sm map-info-panel__btn" onclick="ModalView.open(${record.id})">
        查看详情
      </button>
    `;
    
    // 显示面板
    panel.classList.add('open');
    
    // 保存选中记录
    DataManager.setSelectedRecord(record);

    // 高亮地图上的点
    if (chartInstance) {
      chartInstance.dispatchAction({
        type: 'highlight',
        seriesIndex: 1,
        name: record.location.name
      });
    }
  }

  // 关闭信息面板
  function closeInfoPanel() {
    const panel = document.getElementById('map-info-panel');
    if (panel) {
      panel.classList.remove('open');
    }
    
    // 取消高亮
    if (chartInstance && selectedRecord) {
      chartInstance.dispatchAction({
        type: 'downplay',
        seriesIndex: 1,
        name: selectedRecord.location.name
      });
    }
    
    selectedRecord = null;
    DataManager.setSelectedRecord(null);
  }

  // 显示省份名称
  let provinceLabelTimer = null;
  
  function showProvinceLabel(name) {
    const label = document.getElementById('province-label');
    if (!label) return;
    
    // 清除之前的定时器
    if (provinceLabelTimer) {
      clearTimeout(provinceLabelTimer);
    }
    
    label.textContent = name;
    label.classList.add('show');
    
    // 3秒后自动隐藏
    provinceLabelTimer = setTimeout(() => {
      hideProvinceLabel();
    }, 3000);
  }
  
  function hideProvinceLabel() {
    const label = document.getElementById('province-label');
    if (label) {
      label.classList.remove('show');
    }
  }

  // 缩放功能
  function zoomIn() {
    if (chartInstance) {
      const option = chartInstance.getOption();
      const currentZoom = option.geo[0].zoom || 1.2;
      chartInstance.setOption({
        geo: { zoom: Math.min(currentZoom * 1.3, 5) }
      });
    }
  }

  function zoomOut() {
    if (chartInstance) {
      const option = chartInstance.getOption();
      const currentZoom = option.geo[0].zoom || 1.2;
      chartInstance.setOption({
        geo: { zoom: Math.max(currentZoom / 1.3, 0.8) }
      });
    }
  }

  function reset() {
    if (chartInstance) {
      chartInstance.setOption({
        geo: { zoom: 1.2, center: [105, 36] }
      });
    }
    closeInfoPanel();
  }

  // 销毁
  function destroy() {
    // 清除流动线定时器
    if (window.migrationTimer) {
      clearInterval(window.migrationTimer);
      window.migrationTimer = null;
    }
    
    if (chartInstance) {
      chartInstance.dispose();
      chartInstance = null;
    }
    if (container) {
      container.innerHTML = '';
    }
    selectedRecord = null;
  }

  // 刷新地图（重置视图）
  function refresh() {
    if (chartInstance) {
      // 重置地图缩放和位置
      const isMobile = window.innerWidth <= 768;
      chartInstance.setOption({
        geo: {
          zoom: isMobile ? 1.15 : 1.2,
          center: isMobile ? [105, 35] : [105, 36]
        }
      });
      // 关闭信息面板
      closeInfoPanel();
      // 显示左上角描述和底部瓶子
      const statsOverlay = document.getElementById('map-stats-overlay');
      const honeyBottles = document.getElementById('honey-bottles');
      if (statsOverlay) statsOverlay.classList.remove('hidden');
      if (honeyBottles) honeyBottles.classList.remove('hidden');
    }
  }

  // 营养成分颜色数组
  const nutritionColors = ['#E65100', '#1976D2', '#388E3C', '#7B1FA2'];
  // 功效颜色数组
  const benefitColors = ['#C62828', '#00838F', '#558B2F', '#6A1B9A'];

  // 显示蜂蜜详情卡片
  function showHoneyDetail(type) {
    const details = DataManager.getHoneyDetails(type);
    if (!details) return;
    
    const card = document.getElementById('honey-detail-card');
    const content = document.getElementById('honey-detail-content');
    
    // 取第一个产地
    const mainOrigin = details.origin.split('、')[0];
    
    // 提取结晶简短描述（如"易结晶"）
    const crystalShort = details.crystallize.split('，')[0].replace(/结晶后.*/, '').trim();
    
    // 生成营养成分HTML（用分号连接，每种不同颜色）
    let nutritionHtml = '';
    if (Array.isArray(details.nutrition)) {
      nutritionHtml = details.nutrition.map((item, index) => 
        `<span style="color: ${nutritionColors[index % nutritionColors.length]}">${item}</span>`
      ).join('；');
    } else {
      nutritionHtml = details.nutrition;
    }
    
    // 生成功效HTML（用分号连接，每条不同颜色，功效词语用毛笔字）
    let benefitsHtml = '';
    if (Array.isArray(details.benefits)) {
      benefitsHtml = details.benefits.map((item, index) => {
        // 将 "养心安神：xxx" 中的 "养心安神" 用毛笔字包裹
        const parts = item.split('：');
        if (parts.length >= 2) {
          const keyword = parts[0];
          const desc = parts.slice(1).join('：');
          return `<span style="color: ${benefitColors[index % benefitColors.length]}"><span class="honey-benefit-keyword">${keyword}</span>：${desc}</span>`;
        }
        return `<span style="color: ${benefitColors[index % benefitColors.length]}">${item}</span>`;
      }).join('；');
    } else {
      benefitsHtml = details.benefits;
    }
    
    content.innerHTML = `
      <button class="honey-detail__close" onclick="MapView.closeHoneyDetail()">×</button>
      
      <!-- 顶部图片区域 -->
      <div class="honey-detail__header">
        <img src="${details.image}" alt="${details.name}">
        <div class="honey-detail__header-overlay">
          <h2 class="honey-detail__title">${details.name}</h2>
          <div class="honey-detail__price">${details.price}</div>
        </div>
      </div>
      
      <!-- 主要信息 -->
      <div class="honey-detail__body">
        <!-- 基础属性条（四列） -->
        <div class="honey-detail__attrs">
          <div class="honey-detail__attr">
            <span class="honey-detail__attr-value">${details.baume}</span>
            <span class="honey-detail__attr-label">波美度</span>
          </div>
          <div class="honey-detail__attr">
            <span class="honey-detail__attr-value">${details.season.split('(')[0]}</span>
            <span class="honey-detail__attr-label">采集季</span>
          </div>
          <div class="honey-detail__attr">
            <span class="honey-detail__attr-value">${mainOrigin}</span>
            <span class="honey-detail__attr-label">产地</span>
          </div>
          <div class="honey-detail__attr">
            <span class="honey-detail__attr-value">${crystalShort}</span>
            <span class="honey-detail__attr-label">结晶</span>
          </div>
        </div>
        
        <!-- 口感 -->
        <div class="honey-detail__block honey-detail__block--taste">
          <p class="honey-detail__inline-text"><strong>口感：</strong>${details.taste}</p>
        </div>
        
        <!-- 营养（分号连接，每种颜色不同） -->
        <div class="honey-detail__block honey-detail__block--nutrition">
          <p class="honey-detail__inline-text"><strong>营养：</strong>${nutritionHtml}</p>
        </div>
        
        <!-- 功效（分号连接，每条颜色不同） -->
        <div class="honey-detail__block honey-detail__block--benefits">
          <p class="honey-detail__inline-text"><strong>功效：</strong>${benefitsHtml}</p>
        </div>
        
        <!-- 储存提示 -->
        <div class="honey-detail__storage">
          <span class="honey-detail__storage-icon">📦</span>
          <span class="honey-detail__storage-text">储存方式：${details.storage}</span>
        </div>
      </div>
    `;
    
    card.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // 关闭蜂蜜详情卡片
  function closeHoneyDetail() {
    const card = document.getElementById('honey-detail-card');
    if (card) {
      card.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // 显示联系方式弹窗
  function showContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
      modal.classList.add('open');
    }
  }

  // 关闭联系方式弹窗
  function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
      modal.classList.remove('open');
    }
  }

  // 拨打电话（带确认）
  function callPhone(phoneNumber) {
    if (confirm(`确认拨打 ${phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')} ?`)) {
      window.location.href = 'tel:' + phoneNumber;
    }
  }

  // 公开API
  return {
    init,
    render,
    closeInfoPanel,
    zoomIn,
    zoomOut,
    reset,
    refresh,
    destroy,
    showHoneyDetail,
    closeHoneyDetail,
    showContactModal,
    closeContactModal,
    callPhone
  };
})();
