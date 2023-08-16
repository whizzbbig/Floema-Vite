import UAParser from 'ua-parser-js';

class DetectionManager {
  constructor() {
    this.parser = new UAParser();
    this.type = this.determineDeviceType(this.parser.getDevice().type);

    this.isMobile = this.type !== 'desktop';
    this.isPhone = this.type === 'phone';
    this.isTablet = this.type === 'tablet';
    this.isDesktop = this.type === 'desktop';

    this.setHTMLClass();

    this.isMixBlendModeUnsupported =
      typeof window.getComputedStyle(document.body).mixBlendMode ===
      'undefined';

    this._webGLAvailable = null;
    this._webPSupported = null;
  }

  determineDeviceType(deviceType) {
    return deviceType === 'mobile' ? 'phone' : deviceType || 'desktop';
  }

  setHTMLClass() {
    const htmlElement = document.documentElement;
    htmlElement.classList.add(this.isMobile ? 'mobile' : 'desktop');
  }

  isWebGLAvailable() {
    if (this._webGLAvailable === null) {
      const canvas = document.createElement('canvas');
      this._webGLAvailable =
        !!window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    }
    return this._webGLAvailable;
  }

  isWebPSupported() {
    if (this._webPSupported === null) {
      const element = document.createElement('canvas');
      this._webPSupported =
        element.getContext &&
        element.getContext('2d') &&
        element.toDataURL('image/webp').startsWith('data:image/webp');
    }
    return this._webPSupported;
  }

  isAppBrowser() {
    const ua = navigator.userAgent;
    return /FBAN|FBAV|Twitter/.test(ua);
  }

  check({ onErrorWebGL, onSuccess }) {
    if (!this.isWebGLAvailable()) {
      onErrorWebGL();
    } else {
      onSuccess();
    }
  }
}

export const Detection = new DetectionManager();
