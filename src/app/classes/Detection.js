import SemverCompare from 'semver-compare';
import UAParser from 'ua-parser-js';

const BROWSERS = {
  CHROME: 'chrome',
  BRAVE: 'brave',
  FIREFOX: 'firefox',
  SAFARI: 'safari',
  EDGE: 'edge',
  OPERA: 'opera',
};

class DetectionManager {
  constructor() {
    this.parser = new UAParser();
    this.setDeviceType();
    this.setSupportData();
    this.setBrowserFlags();
    this.checkBlendModeSupport();
  }

  setDeviceType() {
    const deviceType = this.parser.getDevice().type;
    this.isPhone = deviceType === 'mobile';
    this.isTablet = deviceType === 'tablet';
    this.isDesktop = !this.isPhone && !this.isTablet;
  }

  setSupportData() {
    this.supported = {
      desktop: [
        { browser: BROWSERS.CHROME, minversion: 90 },
        { browser: BROWSERS.BRAVE, minversion: 1.25 },
        { browser: BROWSERS.FIREFOX, minversion: 90 },
        { browser: BROWSERS.SAFARI, minversion: 13 },
        { browser: BROWSERS.EDGE, minversion: 90 },
        { browser: BROWSERS.OPERA, minversion: 70 },
      ],
    };
  }

  setBrowserFlags() {
    const browserName = this.parser.getBrowser().name;
    const isNotMobile = !this.isPhone && !this.isTablet;
    const ua = navigator.userAgent.toLowerCase();

    this.isBrave = !!window.navigator.brave && isNotMobile;
    this.isChrome =
      browserName === BROWSERS.CHROME && !this.isBrave && isNotMobile;
    this.isEdge = browserName === BROWSERS.EDGE && isNotMobile;
    this.isFirefox = browserName === BROWSERS.FIREFOX && isNotMobile;
    this.isSafari = browserName.indexOf(BROWSERS.SAFARI) > -1 && isNotMobile;
    this.isOpera = browserName === BROWSERS.OPERA && isNotMobile;
  }

  checkBlendModeSupport() {
    if (
      typeof window.getComputedStyle(document.body).mixBlendMode === 'undefined'
    ) {
      this.isMixBlendModeUnsupported = true;
      document.documentElement.classList.add('mix-blend-mode-unsupported');
    }
  }

  compareVersions(a, b) {
    if (typeof a === 'string' || a instanceof String) {
      return SemverCompare(a, b) <= 0;
    }
    return a <= parseInt(b, 10);
  }

  isSupported() {
    let supported = false;
    const currentType = this.isDesktop
      ? 'desktop'
      : this.isTablet
      ? 'tablet'
      : 'phone';

    for (const device of this.supported[currentType]) {
      const requirementsMet = Object.keys(device).every(requirement => {
        const value = device[requirement];
        switch (requirement) {
          case 'os':
            return value === this.parser.getOS().name.toLowerCase();
          case 'minos':
            return this.compareVersions(value, this.parser.getOS().version);
          case 'browser':
            return value === this.parser.getBrowser().name.toLowerCase();
          case 'minversion':
            return this.compareVersions(
              value,
              this.parser.getBrowser().version,
            );
          case 'versions':
            // eslint-disable-next-line no-case-declarations
            const version = isNaN(
              parseInt(this.parser.getBrowser().version, 10),
            )
              ? this.parser.getBrowser().version.toLowerCase()
              : parseInt(this.parser.getBrowser().version, 10);
            return value.includes(version);
          default:
            return false;
        }
      });

      if (requirementsMet) {
        supported = true;

        break;
      }
    }

    return supported;
  }

  isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return (
        !!window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  checkAppBrowser() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return ua.includes('FBAN') || ua.includes('FBAV') || ua.includes('Twitter');
  }

  check({ onErrorBrowser, onErrorWebGL, onSuccess }) {
    if (!this.isWebGLAvailable()) {
      onErrorWebGL();
    } else if (this.isSupported()) {
      console.log('webl');

      onSuccess();
    } else {
      onErrorBrowser();
    }
  }
}

export const Detection = new DetectionManager();
