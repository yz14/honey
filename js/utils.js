/* ============================================
   BeeFarm - Utility Functions
   工具函数模块
   ============================================ */

const Utils = (function() {
  'use strict';

  // 格式化日期
  function formatDate(dateStr, format = 'YYYY-MM-DD') {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formats = {
      'YYYY-MM-DD': `${year}-${month}-${day}`,
      'YYYY年MM月DD日': `${year}年${month}月${day}日`,
      'MM月DD日': `${month}月${day}日`,
      'MM/DD': `${month}/${day}`
    };

    return formats[format] || formats['YYYY-MM-DD'];
  }

  // 计算日期范围
  function getDateRange(startStr, endStr) {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return {
      days,
      startFormatted: formatDate(startStr, 'MM月DD日'),
      endFormatted: formatDate(endStr, 'MM月DD日'),
      rangeText: `${formatDate(startStr, 'MM月DD日')} - ${formatDate(endStr, 'MM月DD日')}`
    };
  }

  // 格式化数字（添加千位分隔符）
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // 获取季节
  function getSeason(dateStr) {
    const month = new Date(dateStr).getMonth() + 1;
    if (month >= 3 && month <= 5) return { name: '春季', class: 'spring', icon: '🌸' };
    if (month >= 6 && month <= 8) return { name: '夏季', class: 'summer', icon: '☀️' };
    if (month >= 9 && month <= 11) return { name: '秋季', class: 'autumn', icon: '🍂' };
    return { name: '冬季', class: 'winter', icon: '❄️' };
  }

  // 防抖函数
  function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 节流函数
  function throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // 创建DOM元素
  function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else if (key === 'textContent') {
        element.textContent = value;
      } else if (key.startsWith('data')) {
        element.dataset[key.slice(4).toLowerCase()] = value;
      } else if (key.startsWith('on')) {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        element.setAttribute(key, value);
      }
    });

    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    });

    return element;
  }

  // 动画工具
  function animate(element, keyframes, options = {}) {
    const defaultOptions = {
      duration: 300,
      easing: 'ease',
      fill: 'forwards'
    };
    return element.animate(keyframes, { ...defaultOptions, ...options });
  }

  // 延迟执行
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 检测是否为移动设备
  function isMobile() {
    return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // 解析YouTube URL获取视频ID
  function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  // 判断是否为视频URL
  function isVideoUrl(url) {
    return url.includes('youtube.com') || 
           url.includes('youtu.be') || 
           url.includes('vimeo.com') ||
           url.endsWith('.mp4') ||
           url.endsWith('.webm');
  }

  // 生成唯一ID
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 平滑滚动到元素
  function scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  // SVG图标
  const icons = {
    map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>`,
    timeline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="4"></line><polyline points="6 10 12 4 18 10"></polyline></svg>`,
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
    location: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
    chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
    chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
    zoomIn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
    zoomOut: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
    home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
    video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,
    book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`
  };

  // 获取图标
  function getIcon(name) {
    return icons[name] || '';
  }

  // 公开API
  return {
    formatDate,
    getDateRange,
    formatNumber,
    getSeason,
    debounce,
    throttle,
    createElement,
    animate,
    delay,
    isMobile,
    getYouTubeId,
    isVideoUrl,
    generateId,
    scrollToElement,
    getIcon
  };
})();
