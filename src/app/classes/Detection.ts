import UAParser from 'ua-parser-js';

enum DeviceType {
  Desktop = 'desktop',
  Phone = 'phone',
  Tablet = 'tablet',
}

class DetectionManager {
  private readonly parser: UAParser;
  private readonly type: DeviceType;
  private webGLAvailable: boolean = false;
  private webPSupported: boolean = false;

  readonly isMobile: boolean;
  readonly isPhone: boolean;
  readonly isTablet: boolean;
  readonly isDesktop: boolean;
  readonly isMixBlendModeUnsupported: boolean;

  constructor() {
    this.parser = new UAParser();
    this.type = this.determineDeviceType(this.parser.getDevice().type);

    this.isMobile = this.type !== DeviceType.Desktop;
    this.isPhone = this.type === DeviceType.Phone;
    this.isTablet = this.type === DeviceType.Tablet;
    this.isDesktop = this.type === DeviceType.Desktop;

    this.isMixBlendModeUnsupported =
      typeof window.getComputedStyle(document.body).mixBlendMode ===
      'undefined';

    this.setHTMLClass();
  }

  private determineDeviceType(deviceType: string | undefined): DeviceType {
    if (deviceType === 'mobile') {
      return DeviceType.Phone;
    } else if (Object.values(DeviceType).includes(deviceType as DeviceType)) {
      return deviceType as DeviceType;
    } else {
      return DeviceType.Desktop;
    }
  }

  private setHTMLClass(): void {
    const htmlElement = document.documentElement;
    htmlElement.classList.add(this.isMobile ? 'mobile' : 'desktop');
  }

  private isWebGLAvailable(): boolean {
    if (!this.webGLAvailable) {
      const canvas = document.createElement('canvas');
      this.webGLAvailable =
        !!window.WebGLRenderingContext &&
        !!(
          canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        );
    }
    return this.webGLAvailable;
  }

  isWebPSupported(): boolean {
    if (this.webPSupported === false) {
      const element = document.createElement('canvas');
      if (element.getContext('2d')) {
        this.webPSupported = element
          .toDataURL('image/webp')
          .startsWith('data:image/webp');
      } else {
        this.webPSupported = false;
      }
    }
    return this.webPSupported;
  }

  isAppBrowser(): boolean {
    const ua = navigator.userAgent;
    return /FBAN|FBAV|Twitter/.test(ua);
  }

  check({
    onErrorWebGL,
    onSuccess,
  }: {
    onErrorWebGL: () => void;
    onSuccess: () => void;
  }) {
    if (!this.isWebGLAvailable()) {
      onErrorWebGL();
    } else {
      onSuccess();
    }
  }
}

export const Detection = new DetectionManager();
