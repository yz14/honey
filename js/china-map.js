/* ============================================
   BeeFarm - China Map SVG Renderer
   基于真实GeoJSON数据的中国地图渲染器
   支持省份高亮、交互和卡通风格
   ============================================ */

const ChinaMap = (function() {
  'use strict';

  // SVG viewBox 设置
  const viewBox = { width: 100, height: 100 };
  const padding = 5;
  
  // 地图边界（与 ChinaGeoData 保持一致）
  const bounds = {
    minLng: 73.5,
    maxLng: 135.5,
    minLat: 17.5,
    maxLat: 53.5
  };

  // 经纬度转换为SVG坐标
  function lngLatToSVG(lng, lat) {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100;
    const scale = (100 - padding * 2) / 100;
    return {
      x: padding + x * scale,
      y: padding + y * scale
    };
  }

  // 将经纬度转换为百分比坐标（用于标记点定位）
  function lngLatToPercent(lng, lat) {
    const svg = lngLatToSVG(lng, lat);
    return { x: svg.x, y: svg.y };
  }

  // 将坐标数组转换为SVG路径
  function coordsToPath(coords) {
    const paths = [];
    coords.forEach((ring) => {
      const points = ring.map((coord) => {
        const { x, y } = lngLatToSVG(coord[0], coord[1]);
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      });
      paths.push(`M ${points.join(' L ')} Z`);
    });
    return paths.join(' ');
  }

  // 生成省份SVG路径
  function renderProvinces() {
    const geoData = ChinaGeoData.getGeoData();
    let provincePaths = '';
    
    geoData.features.forEach((feature) => {
      const name = feature.properties.name;
      const id = feature.properties.id;
      const color = ChinaGeoData.getProvinceColor(name);
      
      let pathData = '';
      if (feature.geometry.type === 'Polygon') {
        pathData = coordsToPath(feature.geometry.coordinates);
      } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach((polygon) => {
          pathData += coordsToPath(polygon) + ' ';
        });
      }
      
      provincePaths += `
        <path 
          class="province" 
          data-name="${name}" 
          data-id="${id}"
          d="${pathData}"
          fill="${color}"
          stroke="#558B2F"
          stroke-width="0.2"
        />
      `;
    });
    
    return provincePaths;
  }

  // 生成省份标签
  function renderProvinceLabels() {
    const geoData = ChinaGeoData.getGeoData();
    let labels = '';
    
    // 只为较大的省份显示标签
    const largeProvinces = ['新疆', '西藏', '内蒙古', '青海', '四川', '黑龙江', '甘肃', '云南', '广西', '湖南', '陕西', '广东', '湖北', '贵州', '山东', '河南', '河北'];
    
    geoData.features.forEach((feature) => {
      const name = feature.properties.name;
      if (!largeProvinces.includes(name)) return;
      
      const info = ChinaGeoData.getProvinceInfo(name);
      if (!info) return;
      
      const { x, y } = lngLatToSVG(info.center[0], info.center[1]);
      
      labels += `
        <text 
          class="province-label"
          x="${x.toFixed(2)}" 
          y="${y.toFixed(2)}"
          data-name="${name}"
        >${info.abbr}</text>
      `;
    });
    
    return labels;
  }

  // 生成装饰河流
  function renderRivers() {
    // 长江坐标点
    const yangtzePoints = [
      [97, 33], [100, 30], [103, 29], [106, 30], [108, 30],
      [110, 30.5], [112, 30], [114, 30], [116, 31], [118, 31], [120, 31], [122, 31.5]
    ];
    
    // 黄河坐标点
    const yellowPoints = [
      [96, 35], [100, 35], [103, 37], [106, 38], [108, 38],
      [110, 35], [113, 35], [115, 37], [117, 37], [119, 38]
    ];
    
    const yangtzePathPoints = yangtzePoints.map(p => {
      const { x, y } = lngLatToSVG(p[0], p[1]);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });
    
    const yellowPathPoints = yellowPoints.map(p => {
      const { x, y } = lngLatToSVG(p[0], p[1]);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });
    
    return `
      <g class="rivers" opacity="0.6">
        <!-- 长江 -->
        <path 
          class="river river--yangtze"
          d="M ${yangtzePathPoints.join(' L ')}"
          fill="none"
          stroke="#4FC3F7"
          stroke-width="0.4"
          stroke-dasharray="2,1"
          stroke-linecap="round"
        />
        <!-- 黄河 -->
        <path 
          class="river river--yellow"
          d="M ${yellowPathPoints.join(' L ')}"
          fill="none"
          stroke="#FFD54F"
          stroke-width="0.35"
          stroke-dasharray="2,1"
          stroke-linecap="round"
        />
      </g>
    `;
  }

  // 生成装饰元素
  function renderDecorations() {
    // 装饰位置
    const decorations = [
      { emoji: '🏔️', lng: 86, lat: 32, size: 3, opacity: 0.5 },    // 西藏山脉
      { emoji: '🏔️', lng: 80, lat: 36, size: 2.5, opacity: 0.4 },  // 昆仑山
      { emoji: '🌲', lng: 128, lat: 48, size: 2, opacity: 0.4 },   // 东北森林
      { emoji: '🌲', lng: 110, lat: 31, size: 2, opacity: 0.4 },   // 神农架
      { emoji: '🌾', lng: 116, lat: 35, size: 1.8, opacity: 0.3 }, // 华北平原
      { emoji: '🌸', lng: 100, lat: 25, size: 1.8, opacity: 0.4 }, // 云南花田
      { emoji: '🐑', lng: 105, lat: 42, size: 1.5, opacity: 0.3 }, // 内蒙古草原
      { emoji: '🌿', lng: 82, lat: 44, size: 1.5, opacity: 0.3 },  // 新疆草原
    ];
    
    let decorHtml = '<g class="map-decorations">';
    decorations.forEach(d => {
      const { x, y } = lngLatToSVG(d.lng, d.lat);
      decorHtml += `
        <text 
          x="${x.toFixed(2)}" 
          y="${y.toFixed(2)}" 
          font-size="${d.size}" 
          opacity="${d.opacity}"
          class="map-decoration-icon"
        >${d.emoji}</text>
      `;
    });
    decorHtml += '</g>';
    
    return decorHtml;
  }

  // 生成南海诸岛框
  function renderSouthChinaSea() {
    // 南海诸岛小地图框位置（右下角）
    const boxX = 78;
    const boxY = 72;
    const boxWidth = 18;
    const boxHeight = 22;
    
    return `
      <g class="south-china-sea">
        <!-- 边框 -->
        <rect 
          x="${boxX}" y="${boxY}" 
          width="${boxWidth}" height="${boxHeight}"
          fill="#E3F2FD"
          stroke="#81C784"
          stroke-width="0.3"
          rx="0.5"
        />
        <!-- 标题 -->
        <text 
          x="${boxX + boxWidth/2}" y="${boxY + 2.5}"
          font-size="1.5"
          fill="#558B2F"
          text-anchor="middle"
          font-weight="bold"
        >南海诸岛</text>
        <!-- 简化的岛屿示意 -->
        <g transform="translate(${boxX + 2}, ${boxY + 4})">
          <circle cx="3" cy="3" r="0.5" fill="#81C784"/>
          <circle cx="6" cy="5" r="0.4" fill="#81C784"/>
          <circle cx="9" cy="4" r="0.5" fill="#81C784"/>
          <circle cx="5" cy="8" r="0.4" fill="#81C784"/>
          <circle cx="8" cy="10" r="0.5" fill="#81C784"/>
          <circle cx="11" cy="8" r="0.4" fill="#81C784"/>
          <circle cx="7" cy="13" r="0.4" fill="#81C784"/>
          <circle cx="10" cy="14" r="0.3" fill="#81C784"/>
          <!-- 九段线示意 -->
          <path 
            d="M 1,2 Q 2,8 4,12 Q 8,16 12,14 Q 14,10 12,5 Q 10,2 6,1"
            fill="none"
            stroke="#689F38"
            stroke-width="0.15"
            stroke-dasharray="1,0.5"
          />
        </g>
      </g>
    `;
  }

  // 生成完整的地图SVG
  function getSVG() {
    return `
      <svg viewBox="0 0 100 100" class="china-map-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <!-- 地图阴影 -->
          <filter id="mapShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0.3" dy="0.3" stdDeviation="0.5" flood-opacity="0.25"/>
          </filter>
          
          <!-- 省份hover渐变 -->
          <linearGradient id="provinceHover" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#FFE082;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FFB74D;stop-opacity:1" />
          </linearGradient>
          
          <!-- 活跃省份渐变 -->
          <linearGradient id="provinceActive" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#FFCC80;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FF9800;stop-opacity:1" />
          </linearGradient>
          
          <!-- 海洋纹理 -->
          <pattern id="oceanPattern" patternUnits="userSpaceOnUse" width="4" height="4">
            <circle cx="2" cy="2" r="0.3" fill="#90CAF9" opacity="0.3"/>
          </pattern>
        </defs>
        
        <!-- 背景海洋 -->
        <rect x="0" y="0" width="100" height="100" fill="#E3F2FD"/>
        <rect x="0" y="0" width="100" height="100" fill="url(#oceanPattern)"/>
        
        <!-- 地图主体 -->
        <g class="china-map-group" filter="url(#mapShadow)">
          <!-- 省份 -->
          <g class="provinces">
            ${renderProvinces()}
          </g>
        </g>
        
        <!-- 河流装饰 -->
        ${renderRivers()}
        
        <!-- 省份标签 -->
        <g class="province-labels">
          ${renderProvinceLabels()}
        </g>
        
        <!-- 装饰元素 -->
        ${renderDecorations()}
        
        <!-- 南海诸岛 -->
        ${renderSouthChinaSea()}
        
        <!-- 地图标题 -->
        <text x="50" y="4" font-size="2.5" fill="#558B2F" text-anchor="middle" font-weight="bold" opacity="0.6">
          采蜜足迹图
        </text>
      </svg>
    `;
  }

  // 获取边界
  function getBounds() {
    return bounds;
  }

  // 坐标转换（供外部使用）
  function toMapCoordinates(lng, lat) {
    return lngLatToPercent(lng, lat);
  }

  // 主要城市/地点的经纬度参考（保持向后兼容）
  const locationCoordinates = {
    "云南大理": { lng: 100.19, lat: 25.69 },
    "四川若尔盖": { lng: 102.96, lat: 33.58 },
    "湖北神农架": { lng: 110.68, lat: 31.74 },
    "新疆伊犁": { lng: 81.32, lat: 43.92 },
    "陕西秦岭": { lng: 108.94, lat: 33.87 },
    "黑龙江饶河": { lng: 134.02, lat: 46.80 }
  };

  return {
    getSVG,
    getBounds,
    toMapCoordinates,
    lngLatToSVG,
    lngLatToPercent,
    locationCoordinates
  };
})();
