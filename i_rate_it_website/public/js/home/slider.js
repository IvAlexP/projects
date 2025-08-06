class NearYouSlider {
  constructor() {
    this.currentSlide = 0;
    this.totalItems = 0;
    this.init();
  }

  init() {
    this.initializeSlider();
    this.bindEvents();
  }

  initializeSlider() {
    const container = document.querySelector('.near-you-container');
    const slider = document.querySelector('.near-you-slider');
    const entities = document.querySelector('.near-you-entities');
    const items = document.querySelectorAll('.near-you-item');
    
    if (!container || !entities || items.length === 0) {
      return;
    }

    this.totalItems = items.length;
    
    // Create slider wrapper and arrows if they don't exist
    if (!slider) {
      this.createSliderElements(entities);
    }

    this.updateSliderState();
  }

  createSliderElements(entities) {
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'near-you-slider';
    
    // Create controls container for arrows under title
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'slider-controls';
    
    const leftArrow = document.createElement('button');
    leftArrow.className = 'slider-arrow left';
    leftArrow.innerHTML = '‹';
    leftArrow.addEventListener('click', () => this.slideLeft());
    
    const rightArrow = document.createElement('button');
    rightArrow.className = 'slider-arrow right';
    rightArrow.innerHTML = '›';
    rightArrow.addEventListener('click', () => this.slideRight());
    
    // Add arrows to controls container
    controlsContainer.appendChild(leftArrow);
    controlsContainer.appendChild(rightArrow);
    
    // Insert controls after the title
    const nearYouTitle = document.querySelector('.near-you-title');
    if (nearYouTitle) {
      nearYouTitle.parentNode.insertBefore(controlsContainer, nearYouTitle.nextSibling);
    }
    
    // Wrap entities in slider
    entities.parentNode.insertBefore(sliderWrapper, entities);
    sliderWrapper.appendChild(entities);
  }

  slideLeft() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateSliderPosition();
    }
  }

  slideRight() {
    const container = document.querySelector('.near-you-slider');
    const entities = document.querySelector('.near-you-entities');
    const items = document.querySelectorAll('.near-you-item');
    
    if (!container || !entities || items.length === 0) return;
    
    // Calculate how much we can scroll before the last item becomes visible
    const containerWidth = container.offsetWidth;
    const itemWidth = items[0].offsetWidth;
    const gap = parseInt(getComputedStyle(entities).gap) || 25;
    const totalWidth = (itemWidth + gap) * this.totalItems - gap;
    const maxTranslate = Math.max(0, totalWidth - containerWidth);
    const currentTranslate = this.currentSlide * (itemWidth + gap);
    
    if (currentTranslate < maxTranslate) {
      this.currentSlide++;
      this.updateSliderPosition();
    }
  }

  updateSliderPosition() {
    const entities = document.querySelector('.near-you-entities');
    const items = document.querySelectorAll('.near-you-item');
    
    if (entities && items.length > 0) {
      const itemWidth = items[0].offsetWidth;
      const gap = parseInt(getComputedStyle(entities).gap) || 25;
      const translateX = this.currentSlide * (itemWidth + gap);
      
      entities.style.transform = `translateX(-${translateX}px)`;
    }
    
    this.updateSliderState();
  }

  updateSliderState() {
    const leftArrow = document.querySelector('.slider-arrow.left');
    const rightArrow = document.querySelector('.slider-arrow.right');
    const container = document.querySelector('.near-you-slider');
    const entities = document.querySelector('.near-you-entities');
    const items = document.querySelectorAll('.near-you-item');
    
    if (!container || !entities || items.length === 0) return;
    
    // Left arrow: disabled if at beginning
    if (leftArrow) {
      leftArrow.disabled = this.currentSlide === 0;
    }
    
    // Right arrow: disabled if last item is visible
    if (rightArrow) {
      const containerWidth = container.offsetWidth;
      const itemWidth = items[0].offsetWidth;
      const gap = parseInt(getComputedStyle(entities).gap) || 25;
      const totalWidth = (itemWidth + gap) * this.totalItems - gap;
      const currentTranslate = this.currentSlide * (itemWidth + gap);
      const maxTranslate = Math.max(0, totalWidth - containerWidth);
      
      rightArrow.disabled = currentTranslate >= maxTranslate;
    }
  }

  bindEvents() {
    // Handle window resize
    window.addEventListener('resize', () => {
      // Reset to beginning to avoid being stuck
      this.currentSlide = 0;
      this.updateSliderPosition();
    });
  }
}

// Export for use in other modules
window.NearYouSlider = NearYouSlider;
