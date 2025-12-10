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
            ${renderThumbnails(record.media)}
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
            
            <div class="timeline-item__stats">
              <div class="timeline-item__stat">
                <span class="timeline-item__stat-icon">🌸</span>
                <div class="timeline-item__stat-content">
                  <span class="timeline-item__stat-value">${record.honey.type}</span>
                  <span class="timeline-item__stat-label">蜜源类型</span>
                </div>
              </div>
              <div class="timeline-item__stat">
                <span class="timeline-item__stat-icon">⭐</span>
                <div class="timeline-item__stat-content">
                  <span class="timeline-item__stat-value">${record.honey.quality}</span>
                  <span class="timeline-item__stat-label">品质等级</span>
                </div>
              </div>
              <div class="timeline-item__stat">
                <span class="timeline-item__stat-icon">📅</span>
                <div class="timeline-item__stat-content">
                  <span class="timeline-item__stat-value">${dateRange.days}天</span>
                  <span class="timeline-item__stat-label">驻留时间</span>
                </div>
              </div>
              <div class="timeline-item__stat">
                <span class="timeline-item__stat-icon">${record.weather.icon}</span>
                <div class="timeline-item__stat-content">
                  <span class="timeline-item__stat-value">${record.weather.avgTemp}°C</span>
                  <span class="timeline-item__stat-label">平均气温</span>
                </div>
              </div>
            </div>
            
            <div class="timeline-item__tags">
              ${record.tags.map(tag => `<span class="timeline-item__tag">${tag}</span>`).join('')}
            </div>
            
            <button class="timeline-item__btn" onclick="ModalView.open(${record.id})">
              查看完整故事
              ${Utils.getIcon('chevronRight')}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // 渲染缩略图
  function renderThumbnails(media) {
    if (!media || media.length <= 1) return '';
    
    const thumbs = media.slice(0, 4).map((item, index) => `
      <div class="timeline-item__thumb ${index === 0 ? 'active' : ''}">
        <img src="${item.thumbnail}" alt="${item.caption || ''}" loading="lazy">
      </div>
    `).join('');
    
    return `<div class="timeline-item__thumbnails">${thumbs}</div>`;
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
    destroy
  };
})();
