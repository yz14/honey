/* ============================================
   BeeFarm - Main Application
   主应用入口
   ============================================ */

const App = (function() {
  'use strict';

  // DOM元素引用
  let elements = {
    yearValue: null,
    yearPrevBtn: null,
    yearNextBtn: null,
    viewToggleBtns: null,
    statsSidebar: null,
    mapView: null,
    timelineView: null
  };

  // 当前状态
  let currentYear = new Date().getFullYear();
  let currentView = 'map';

  // 初始化应用
  function init() {
    // 初始化数据管理器
    DataManager.init();
    
    // 缓存DOM元素
    cacheElements();
    
    // 初始化模态框
    ModalView.init();
    
    // 初始化视图
    initViews();
    
    // 绑定事件
    bindEvents();
    
    // 更新统计数据
    updateStats();
    
    // 更新年份显示
    updateYearDisplay();
    
    console.log('🐝 BeeFarm App initialized!');
  }

  // 缓存DOM元素
  function cacheElements() {
    elements.yearValue = document.getElementById('year-value');
    elements.yearPrevBtn = document.getElementById('year-prev');
    elements.yearNextBtn = document.getElementById('year-next');
    elements.viewToggleBtns = document.querySelectorAll('.view-toggle__btn');
    elements.statsSidebar = document.querySelector('.stats-sidebar');
    elements.mapView = document.getElementById('map-view');
    elements.timelineView = document.getElementById('timeline-view');
    
    // 统计数据元素
    elements.statHoney = document.getElementById('stat-honey');
    elements.statLocations = document.getElementById('stat-locations');
    elements.statDays = document.getElementById('stat-days');
    elements.statRecords = document.getElementById('stat-records');
  }

  // 初始化视图
  function initViews() {
    // 初始化地图视图
    MapView.init(elements.mapView);
    
    // 初始化时间轴视图
    TimelineView.init(elements.timelineView);
    
    // 默认显示地图视图
    switchView('map');
  }

  // 绑定事件
  function bindEvents() {
    // 年份切换
    if (elements.yearPrevBtn) {
      elements.yearPrevBtn.addEventListener('click', () => changeYear(-1));
    }
    if (elements.yearNextBtn) {
      elements.yearNextBtn.addEventListener('click', () => changeYear(1));
    }
    
    // 视图切换
    elements.viewToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        switchView(view);
      });
    });
    
    // 窗口大小变化
    window.addEventListener('resize', Utils.debounce(handleResize, 250));
  }

  // 切换年份
  function changeYear(delta) {
    const newYear = currentYear + delta;
    const minYear = 2020;
    const maxYear = new Date().getFullYear();
    
    if (newYear >= minYear && newYear <= maxYear) {
      currentYear = newYear;
      DataManager.setCurrentYear(currentYear);
      updateYearDisplay();
      updateStats();
      refreshCurrentView();
    }
  }

  // 更新年份显示
  function updateYearDisplay() {
    if (elements.yearValue) {
      elements.yearValue.textContent = currentYear;
    }
    
    // 更新按钮状态
    const minYear = 2020;
    const maxYear = new Date().getFullYear();
    
    if (elements.yearPrevBtn) {
      elements.yearPrevBtn.disabled = currentYear <= minYear;
    }
    if (elements.yearNextBtn) {
      elements.yearNextBtn.disabled = currentYear >= maxYear;
    }
  }

  // 切换视图
  function switchView(view) {
    currentView = view;
    DataManager.setCurrentView(view);
    
    // 更新按钮状态
    elements.viewToggleBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    // 切换视图显示
    if (elements.mapView) {
      elements.mapView.classList.toggle('active', view === 'map');
    }
    if (elements.timelineView) {
      elements.timelineView.classList.toggle('active', view === 'timeline');
    }
    
    // 关闭地图信息面板
    if (view !== 'map') {
      MapView.closeInfoPanel();
    }
  }

  // 刷新当前视图
  function refreshCurrentView() {
    if (currentView === 'map') {
      MapView.render();
    } else {
      TimelineView.render();
    }
  }

  // 更新统计数据
  function updateStats() {
    const stats = DataManager.getStats();
    
    // 更新桌面端统计
    if (elements.statHoney) {
      animateValue(elements.statHoney, stats.totalHoney);
    }
    if (elements.statLocations) {
      animateValue(elements.statLocations, stats.locations);
    }
    if (elements.statDays) {
      animateValue(elements.statDays, stats.totalDays);
    }
    if (elements.statRecords) {
      animateValue(elements.statRecords, stats.recordCount);
    }
    
    // 同时更新手机端统计
    const mobileHoney = document.getElementById('stat-honey-mobile');
    const mobileLocations = document.getElementById('stat-locations-mobile');
    const mobileDays = document.getElementById('stat-days-mobile');
    const mobileRecords = document.getElementById('stat-records-mobile');
    
    if (mobileHoney) animateValue(mobileHoney, stats.totalHoney);
    if (mobileLocations) animateValue(mobileLocations, stats.locations);
    if (mobileDays) animateValue(mobileDays, stats.totalDays);
    if (mobileRecords) animateValue(mobileRecords, stats.recordCount);
  }

  // 数字动画
  function animateValue(element, target) {
    const duration = 1000;
    const start = parseInt(element.textContent) || 0;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 缓动函数
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(start + (target - start) * easeOutQuart);
      
      element.textContent = Utils.formatNumber(current);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  // 处理窗口大小变化
  function handleResize() {
    // 移动端自动切换到时间轴视图可能更好
    // 但保持用户选择
    refreshCurrentView();
  }

  // 获取当前年份
  function getCurrentYear() {
    return currentYear;
  }

  // 获取当前视图
  function getCurrentView() {
    return currentView;
  }

  // 公开API
  return {
    init,
    changeYear,
    switchView,
    getCurrentYear,
    getCurrentView
  };
})();

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
