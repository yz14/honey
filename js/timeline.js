/* ============================================
   BeeFarm - Timeline View Module
   全屏滚动时间轴视图
   ============================================ */

const TimelineView = (function() {
  'use strict';

  let container = null;
  let timelineEl = null;
  let currentIndex = 0;
  let records = [];

  // 初始化
  function init(containerEl) {
    container = containerEl;
    render();
  }

  // 渲染时间轴视图
  function render() {
    records = DataManager.getRecords();
    
    // 按日期排序
    records = [...records].sort((a, b) => 
      new Date(a.date.start) - new Date(b.date.start)
    );
    
    container.innerHTML = `
      <!-- 中心时间轴线 -->
      <div class="timeline__line"></div>
      
      <!-- 时间轴容器 -->
      <div class="timeline" id="timeline-scroll">
        ${records.map((record, index) => renderTimelineItem(record, index)).join('')}
      </div>
      
      <!-- 进度指示器 -->
      <div class="timeline__progress" id="timeline-progress">
        ${records.map((_, index) => `
          <div class="timeline__progress-dot ${index === 0 ? 'active' : ''}" 
               data-index="${index}" 
               onclick="TimelineView.scrollToItem(${index})"></div>
        `).join('')}
      </div>
      
      <!-- 滚动提示 -->
      <div class="timeline__scroll-hint" id="scroll-hint">
        <span>向下滚动</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    `;
    
    timelineEl = document.getElementById('timeline-scroll');
    
    // 绑定滚动事件
    bindScrollEvents();
  }

  // 渲染单个时间轴项目（全屏）
  function renderTimelineItem(record, index) {
    const dateRange = Utils.getDateRange(record.date.start, record.date.end);
    const season = Utils.getSeason(record.date.start);
    const mainImage = record.media && record.media.length > 0 
      ? record.media[0].url 
      : 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800';
    
    // 取前2个标签用于手机端简洁显示
    const topTags = record.tags.slice(0, 2);
    
    return `
      <div class="timeline-item" data-index="${index}" data-id="${record.id}">
        <!-- 左侧：图片 -->
        <div class="timeline-item__left">
          <div class="timeline-item__gallery">
            <div class="timeline-item__main-image">
              <img src="${mainImage}" alt="${record.story.title}" loading="lazy">
              <div class="timeline-item__image-overlay"></div>
              <!-- 桌面端显示kg徽章 -->
              <div class="timeline-item__honey-badge timeline-item__honey-badge--desktop">
                🍯 ${record.honey.amount}${record.honey.unit}
              </div>
              <!-- 手机端显示查看故事按钮 -->
              <button class="timeline-item__story-btn" onclick="ModalView.open(${record.id})">
                查看故事
              </button>
            </div>
            ${renderThumbnails(record.media, record.id)}
          </div>
        </div>
        
        <!-- 中间：节点 -->
        <div class="timeline-item__center">
          <div class="timeline-item__node">${season.icon}</div>
          <div class="timeline-item__date">${dateRange.rangeText}</div>
        </div>
        
        <!-- 右侧：信息 -->
        <div class="timeline-item__right">
          <div class="timeline-item__info">
            <!-- 手机端地点+时间同行 -->
            <div class="timeline-item__header-row">
              <div class="timeline-item__location">
                ${Utils.getIcon('location')}
                <span>${record.location.province} · ${record.location.city}</span>
              </div>
              <div class="timeline-item__date-mobile">${dateRange.rangeText}</div>
            </div>
            <!-- 手机端标题+标签同行 -->
            <div class="timeline-item__title-row">
              <h2 class="timeline-item__title">${record.story.title}</h2>
              <div class="timeline-item__tags-inline">
                ${topTags.map(tag => `<span class="timeline-item__tag-inline">${tag}</span>`).join('')}
              </div>
            </div>
            <p class="timeline-item__excerpt">${record.story.excerpt}</p>
            
            <!-- 统计信息卡片 - 体现自然采集特点 -->
            <div class="timeline-item__stats">
              <div class="timeline-item__stat timeline-item__stat--environment">
                <span class="timeline-item__stat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/>
                    <circle cx="17.5" cy="4.5" r="2.5"/>
                  </svg>
                </span>
                <div class="timeline-item__stat-content">
                  <span class="timeline-item__stat-value">${record.environment || '自然山野'}</span>
                  <span class="timeline-item__stat-label">采蜜环境</span>
                </div>
              </div>
              <div class="timeline-item__stat timeline-item__stat--altitude">
                <span class="timeline-item__stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 22h20L12 2z"/>
                    <path d="M12 8v8M8 16h8"/>
                  </svg>
                </span>
                <div class="timeline-item__stat-content">
                  <span class="timeline-item__stat-value">${record.altitude || '800m'}</span>
                  <span class="timeline-item__stat-label">海拔高度</span>
                </div>
              </div>
              <div class="timeline-item__stat timeline-item__stat--bee">
                <span class="timeline-item__stat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <ellipse cx="12" cy="14" rx="5" ry="6"/>
                    <ellipse cx="12" cy="6" rx="3" ry="3"/>
                    <path d="M7 14c-2 0-4-1-4-2s2-2 4-2M17 14c2 0 4-1 4-2s-2-2-4-2" stroke="currentColor" stroke-width="1.5" fill="none"/>
                    <line x1="8" y1="12" x2="16" y2="12" stroke="#FFF" stroke-width="1"/>
                    <line x1="8" y1="15" x2="16" y2="15" stroke="#FFF" stroke-width="1"/>
                  </svg>
                </span>
                <div class="timeline-item__stat-content">
                  <span class="timeline-item__stat-value">${record.beeType || '中华蜂'}</span>
                  <span class="timeline-item__stat-label">蜜蜂品种</span>
                </div>
              </div>
              <div class="timeline-item__stat timeline-item__stat--weather">
                <span class="timeline-item__stat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" fill="none"/>
                  </svg>
                </span>
                <div class="timeline-item__stat-content">
                  <span class="timeline-item__stat-value">${record.weather.avgTemp}°C</span>
                  <span class="timeline-item__stat-label">平均气温</span>
                </div>
              </div>
              <!-- 产量 -->
              <div class="timeline-item__stat timeline-item__stat--yield">
                <span class="timeline-item__stat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <!-- 油罐图标 -->
                    <path d="M4 21h16v-7H4v7zm2-5h12v3H6v-3z"/>
                    <path d="M6 13h12V9c0-1.1-.9-2-2-2h-1V5c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v2H8c-1.1 0-2 .9-2 2v4zm4-8h4v2h-4V5z"/>
                  </svg>
                </span>
                <div class="timeline-item__stat-content">
                  <span class="timeline-item__stat-value">${record.honey.amount}${record.honey.unit}</span>
                  <span class="timeline-item__stat-label">产量</span>
                </div>
              </div>
              <!-- 蜂蜜类型 -->
              <div class="timeline-item__stat timeline-item__stat--type">
                <span class="timeline-item__stat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <!-- 蜂蜜罐图标 -->
                    <path d="M12 2c-1.1 0-2 .9-2 2v1H8c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-2V4c0-1.1-.9-2-2-2z"/>
                    <path d="M5 11c-.55 0-1 .45-1 1v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-.55-.45-1-1-1H5zm7 9c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                    <circle cx="12" cy="16" r="2"/>
                  </svg>
                </span>
                <div class="timeline-item__stat-content">
                  <span class="timeline-item__stat-value">${record.honey.type}</span>
                  <span class="timeline-item__stat-label">蜂蜜类型</span>
                </div>
              </div>
              <!-- 季节 -->
              <div class="timeline-item__stat timeline-item__stat--season">
                <span class="timeline-item__stat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
                  </svg>
                </span>
                <div class="timeline-item__stat-content">
                  <span class="timeline-item__stat-value">${season.name}</span>
                  <span class="timeline-item__stat-label">季节</span>
                </div>
              </div>
              <!-- 蜂蜜质量 -->
              <div class="timeline-item__stat timeline-item__stat--quality">
                <span class="timeline-item__stat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                </span>
                <div class="timeline-item__stat-content">
                  <span class="timeline-item__stat-value">${record.honey.quality || '优质'}</span>
                  <span class="timeline-item__stat-label">蜂蜜质量</span>
                </div>
              </div>
            </div>
            
            <!-- 桌面端显示标签 -->
            <div class="timeline-item__tags timeline-item__tags--desktop">
              ${record.tags.map(tag => `<span class="timeline-item__tag">${tag}</span>`).join('')}
            </div>
            
            <!-- 手机端显示查看故事详情按钮（替代标签） -->
            <button class="timeline-item__detail-btn" onclick="ModalView.open(${record.id})">
              查看故事详情
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // 渲染缩略图
  function renderThumbnails(media, recordId) {
    if (!media || media.length <= 1) return '';
    
    const thumbs = media.slice(0, 4).map((item, index) => `
      <div class="timeline-item__thumb ${index === 0 ? 'active' : ''}" 
           onclick="TimelineView.switchImage(${recordId}, ${index})"
           data-index="${index}">
        <img src="${item.thumbnail}" alt="${item.caption || ''}" loading="lazy">
      </div>
    `).join('');
    
    return `<div class="timeline-item__thumbnails" data-record-id="${recordId}">${thumbs}</div>`;
  }

  // 切换大图
  function switchImage(recordId, imageIndex) {
    const record = DataManager.getRecordById(recordId);
    if (!record || !record.media || !record.media[imageIndex]) return;
    
    // 找到对应的timeline-item
    const timelineItem = document.querySelector(`.timeline-item[data-id="${recordId}"]`);
    if (!timelineItem) return;
    
    // 更新大图
    const mainImage = timelineItem.querySelector('.timeline-item__main-image img');
    if (mainImage) {
      mainImage.src = record.media[imageIndex].url;
      mainImage.alt = record.media[imageIndex].caption || record.story.title;
    }
    
    // 更新缩略图选中状态
    const thumbs = timelineItem.querySelectorAll('.timeline-item__thumb');
    thumbs.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === imageIndex);
    });
  }

  // 绑定滚动事件
  function bindScrollEvents() {
    if (!timelineEl) return;
    
    // 监听滚动更新进度指示器
    timelineEl.addEventListener('scroll', Utils.throttle(handleScroll, 100));
    
    // 键盘导航
    document.addEventListener('keydown', handleKeydown);
  }

  // 处理滚动
  function handleScroll() {
    if (!timelineEl) return;
    
    const items = timelineEl.querySelectorAll('.timeline-item');
    const scrollTop = timelineEl.scrollTop;
    const itemHeight = timelineEl.clientHeight;
    
    // 计算当前索引
    const newIndex = Math.round(scrollTop / itemHeight);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < items.length) {
      currentIndex = newIndex;
      updateProgressDots();
      updateScrollHint();
    }
  }

  // 更新进度点
  function updateProgressDots() {
    const dots = document.querySelectorAll('.timeline__progress-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  // 更新滚动提示
  function updateScrollHint() {
    const hint = document.getElementById('scroll-hint');
    if (hint) {
      // 最后一个项目时隐藏提示
      hint.style.opacity = currentIndex >= records.length - 1 ? '0' : '1';
    }
  }

  // 滚动到指定项目
  function scrollToItem(index) {
    if (!timelineEl || index < 0 || index >= records.length) return;
    
    const itemHeight = timelineEl.clientHeight;
    timelineEl.scrollTo({
      top: index * itemHeight,
      behavior: 'smooth'
    });
    
    currentIndex = index;
    updateProgressDots();
    updateScrollHint();
  }

  // 键盘导航
  function handleKeydown(e) {
    // 只在时间轴视图激活时响应
    if (!container.classList.contains('active')) return;
    
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      scrollToItem(currentIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      scrollToItem(currentIndex - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      scrollToItem(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      scrollToItem(records.length - 1);
    }
  }

  // 销毁
  function destroy() {
    document.removeEventListener('keydown', handleKeydown);
    if (container) {
      container.innerHTML = '';
    }
    timelineEl = null;
    currentIndex = 0;
  }

  // 公开API
  return {
    init,
    render,
    scrollToItem,
    switchImage,
    destroy
  };
})();
