/* ============================================
   BeeFarm - Modal Module
   模态框/详情面板模块
   ============================================ */

const ModalView = (function() {
  'use strict';

  let modalBackdrop = null;
  let modalContainer = null;
  let lightbox = null;
  let currentMedia = [];
  let currentMediaIndex = 0;

  // 初始化
  function init() {
    createModalElements();
    bindEvents();
  }

  // 创建模态框DOM元素
  function createModalElements() {
    // 模态框背景
    modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'modal-backdrop';
    modalBackdrop.id = 'modal-backdrop';
    document.body.appendChild(modalBackdrop);

    // 模态框容器
    modalContainer = document.createElement('div');
    modalContainer.className = 'modal';
    modalContainer.id = 'modal';
    document.body.appendChild(modalContainer);

    // 图片灯箱
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox__close" onclick="ModalView.closeLightbox()">
        ${Utils.getIcon('close')}
      </button>
      <button class="lightbox__nav lightbox__nav--prev" onclick="ModalView.prevMedia()">
        ${Utils.getIcon('chevronLeft')}
      </button>
      <button class="lightbox__nav lightbox__nav--next" onclick="ModalView.nextMedia()">
        ${Utils.getIcon('chevronRight')}
      </button>
      <div class="lightbox__content" id="lightbox-content"></div>
      <div class="lightbox__caption" id="lightbox-caption"></div>
    `;
    document.body.appendChild(lightbox);
  }

  // 绑定事件
  function bindEvents() {
    // 点击背景关闭
    modalBackdrop.addEventListener('click', close);
    
    // ESC键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (lightbox.classList.contains('open')) {
          closeLightbox();
        } else if (modalContainer.classList.contains('open')) {
          close();
        }
      }
      // 灯箱左右键导航
      if (lightbox.classList.contains('open')) {
        if (e.key === 'ArrowLeft') prevMedia();
        if (e.key === 'ArrowRight') nextMedia();
      }
    });
  }

  // 打开模态框
  function open(recordId) {
    const record = DataManager.getRecordById(recordId);
    if (!record) return;

    renderModal(record);
    
    // 显示模态框
    modalBackdrop.classList.add('open');
    modalContainer.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // 保存当前媒体列表
    currentMedia = record.media || [];
    currentMediaIndex = 0;
  }

  // 关闭模态框
  function close() {
    modalBackdrop.classList.remove('open');
    modalContainer.classList.remove('open');
    document.body.style.overflow = '';
  }

  // 渲染模态框内容
  function renderModal(record) {
    const dateRange = Utils.getDateRange(record.date.start, record.date.end);
    const headerImage = record.media && record.media.length > 0 
      ? record.media[0].url 
      : 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800';

    modalContainer.innerHTML = `
      <div class="modal__header">
        <div class="modal__header-image">
          <img src="${headerImage}" alt="${record.story.title}">
        </div>
        <div class="modal__header-overlay"></div>
        <button class="modal__close" onclick="ModalView.close()">
          ${Utils.getIcon('close')}
        </button>
        <div class="modal__header-content">
          <div class="modal__location">
            ${Utils.getIcon('location')}
            <span>${record.location.province} · ${record.location.city}</span>
          </div>
          <h2 class="modal__title">${record.story.title}</h2>
          <div class="modal__meta">
            <span class="modal__meta-item">
              ${Utils.getIcon('calendar')}
              ${dateRange.rangeText}
            </span>
            <span class="modal__meta-item">
              📅 ${dateRange.days} 天
            </span>
            <span class="modal__meta-item">
              ${record.weather.icon} ${record.weather.avgTemp}°C
            </span>
          </div>
        </div>
      </div>
      
      <div class="modal__body">
        <!-- 统计数据 -->
        <div class="modal__stats">
          <div class="modal__stat">
            <div class="modal__stat-icon">🍯</div>
            <div class="modal__stat-value">${record.honey.amount}${record.honey.unit}</div>
            <div class="modal__stat-label">蜂蜜产量</div>
          </div>
          <div class="modal__stat">
            <div class="modal__stat-icon">🌸</div>
            <div class="modal__stat-value">${record.honey.type}</div>
            <div class="modal__stat-label">蜜源类型</div>
          </div>
          <div class="modal__stat">
            <div class="modal__stat-icon">⭐</div>
            <div class="modal__stat-value">${record.honey.quality}</div>
            <div class="modal__stat-label">品质等级</div>
          </div>
        </div>
        
        <!-- 采蜜故事 -->
        <div class="modal__section">
          <h3 class="modal__section-title">
            ${Utils.getIcon('book')}
            采蜜故事
          </h3>
          <div class="modal__story">
            ${record.story.content.split('\n\n').map(p => `<p>${p}</p>`).join('')}
          </div>
        </div>
        
        <!-- 媒体画廊 -->
        ${record.media && record.media.length > 0 ? renderGallery(record.media) : ''}
        
        <!-- 天气信息 -->
        <div class="modal__section">
          <h3 class="modal__section-title">
            ${record.weather.icon}
            天气状况
          </h3>
          <div class="modal__weather">
            <div class="modal__weather-icon">${record.weather.icon}</div>
            <div class="modal__weather-info">
              <div class="modal__weather-temp">${record.weather.avgTemp}°C</div>
              <div class="modal__weather-desc">平均气温 · ${record.weather.condition}</div>
            </div>
          </div>
        </div>
        
        <!-- 标签 -->
        <div class="modal__section">
          <h3 class="modal__section-title">
            🏷️ 标签
          </h3>
          <div class="modal__tags">
            ${record.tags.map(tag => `<span class="modal__tag">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // 渲染媒体画廊
  function renderGallery(media) {
    const items = media.map((item, index) => {
      const isVideo = item.type === 'video';
      return `
        <div class="modal__gallery-item ${isVideo ? 'modal__gallery-item--video' : ''}" 
             onclick="ModalView.openLightbox(${index})">
          <img src="${item.thumbnail}" alt="${item.caption}" loading="lazy">
          ${isVideo ? `<div class="modal__gallery-play">${Utils.getIcon('play')}</div>` : ''}
          <div class="modal__gallery-item__label">${item.caption}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="modal__section modal__gallery">
        <h3 class="modal__section-title">
          ${Utils.getIcon('image')}
          照片与视频
        </h3>
        <div class="modal__gallery-grid">
          ${items}
        </div>
      </div>
    `;
  }

  // 打开灯箱
  function openLightbox(index) {
    if (!currentMedia || currentMedia.length === 0) return;
    
    currentMediaIndex = index;
    renderLightboxContent();
    lightbox.classList.add('open');
  }

  // 关闭灯箱
  function closeLightbox() {
    lightbox.classList.remove('open');
    
    // 如果是视频，停止播放
    const video = lightbox.querySelector('video');
    const iframe = lightbox.querySelector('iframe');
    if (video) video.pause();
    if (iframe) iframe.src = '';
  }

  // 渲染灯箱内容
  function renderLightboxContent() {
    const content = document.getElementById('lightbox-content');
    const caption = document.getElementById('lightbox-caption');
    const media = currentMedia[currentMediaIndex];
    
    if (!content || !caption || !media) return;

    if (media.type === 'video') {
      // 检查是否是YouTube链接
      const youtubeId = Utils.getYouTubeId(media.url);
      if (youtubeId) {
        content.innerHTML = `
          <iframe 
            src="https://www.youtube.com/embed/${youtubeId}?autoplay=1" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            style="width: 80vw; max-width: 1000px; aspect-ratio: 16/9; border-radius: var(--radius-lg);"
          ></iframe>
        `;
      } else {
        content.innerHTML = `
          <video controls autoplay style="max-width: 90vw; max-height: 80vh; border-radius: var(--radius-lg);">
            <source src="${media.url}" type="video/mp4">
            您的浏览器不支持视频播放
          </video>
        `;
      }
    } else {
      content.innerHTML = `<img src="${media.url}" alt="${media.caption}">`;
    }

    caption.textContent = `${media.caption} (${currentMediaIndex + 1}/${currentMedia.length})`;
  }

  // 上一个媒体
  function prevMedia() {
    if (currentMedia.length === 0) return;
    currentMediaIndex = (currentMediaIndex - 1 + currentMedia.length) % currentMedia.length;
    renderLightboxContent();
  }

  // 下一个媒体
  function nextMedia() {
    if (currentMedia.length === 0) return;
    currentMediaIndex = (currentMediaIndex + 1) % currentMedia.length;
    renderLightboxContent();
  }

  // 销毁
  function destroy() {
    if (modalBackdrop) modalBackdrop.remove();
    if (modalContainer) modalContainer.remove();
    if (lightbox) lightbox.remove();
  }

  // 公开API
  return {
    init,
    open,
    close,
    openLightbox,
    closeLightbox,
    prevMedia,
    nextMedia,
    destroy
  };
})();
