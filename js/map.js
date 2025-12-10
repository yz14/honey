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
    
    container.innerHTML = `
      <div class="map-container">
        <!-- ECharts 地图容器 -->
        <div class="echarts-map" id="echarts-map"></div>
        
        <!-- 省份名称显示 -->
        <div class="map-province-label" id="province-label"></div>
        
        <!-- 控制按钮 -->
        <div class="map-controls">
          <button class="map-control-btn" title="放大" onclick="MapView.zoomIn()">+</button>
          <button class="map-control-btn" title="缩小" onclick="MapView.zoomOut()">−</button>
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

    // 准备采蜜点数据
    const scatterData = records.map(record => {
      const honey = record.honey.amount;
      let symbolSize, color;
      
      if (honey > 400) {
        symbolSize = 35;
        color = '#FF6B00';
      } else if (honey >= 200) {
        symbolSize = 28;
        color = '#FFA726';
      } else {
        symbolSize = 22;
        color = '#FFD54F';
      }

      return {
        name: record.location.name,
        value: [record.location.lng, record.location.lat, honey],
        symbolSize: symbolSize,
        itemStyle: {
          color: color,
          shadowBlur: 10,
          shadowColor: 'rgba(255, 152, 0, 0.5)'
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
        text: isMobile ? '' : '🐝 蜂农采蜜足迹图', // 手机端隐藏标题，留更多空间给地图
        left: 'center',
        top: 15,
        textStyle: {
          color: '#558B2F',
          fontSize: 18,
          fontWeight: 'bold',
          fontFamily: 'Quicksand, Nunito, sans-serif'
        }
      },
      tooltip: {
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
          } else if (params.seriesType === 'map') {
            // 获取该省份的采蜜统计
            const provinceName = params.name;
            const provinceRecords = records.filter(r => 
              r.location.province.includes(provinceName)
            );
            
            if (provinceRecords.length > 0) {
              const totalHoney = provinceRecords.reduce((sum, r) => sum + r.honey.amount, 0);
              return `
                <div style="font-weight: bold; font-size: 14px;">${provinceName}</div>
                <div style="margin-top: 6px; color: #FF8F00;">
                  🍯 ${provinceRecords.length}次采蜜 · ${totalHoney}kg
                </div>
              `;
            }
            return `<div style="font-weight: bold;">${provinceName}</div>`;
          }
          return '';
        }
      },
      geo: {
        map: 'china',
        roam: true,
        // 手机端放大地图以填满宽度，中心点下移以显示更多地图
        zoom: isMobile ? 1.35 : 1.2,
        center: isMobile ? [105, 32] : [105, 36],
        aspectScale: isMobile ? 0.85 : 0.75, // 手机端调整宽高比
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
        // 点击省份，显示省份名称
        showProvinceLabel(params.name);
      }
    });
    
    // 鼠标移出地图时隐藏省份名称
    chartInstance.on('globalout', function() {
      hideProvinceLabel();
    });

    // 窗口大小变化时重绘
    window.addEventListener('resize', function() {
      if (chartInstance) {
        chartInstance.resize();
      }
    });
    
    // 流动线依次切换动画
    if (linesData.length > 1) {
      let currentLineIndex = 0;
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
        
        currentLineIndex = (currentLineIndex + 1) % linesData.length;
        
        // 更新流动线数据，只显示当前这一条
        chartInstance.setOption({
          series: [{
            name: 'migrationEffect',
            data: [linesData[currentLineIndex]]
          }]
        });
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

  // 公开API
  return {
    init,
    render,
    closeInfoPanel,
    zoomIn,
    zoomOut,
    reset,
    destroy
  };
})();
