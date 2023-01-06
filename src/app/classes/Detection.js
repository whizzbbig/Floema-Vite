import UAParser from 'ua-parser-js'

class Detection {
  constructor () {
    this.parser = new UAParser()
    this.device = this.parser.getDevice()

    this.type = null

    switch (this.device.type) {
      case 'mobile': this.type = 'phone'; break
      case 'tablet': this.type = 'tablet'; break
      default: this.type = 'desktop'; break
    }

    document.documentElement.classList.add(this.type)

    this.supported = {
      desktop: [
        {
          browser: 'chrome',
          browserVersion: 55
        }, {
          browser: 'safari',
          browserVersion: 9
        }, {
          browser: 'firefox',
          browserVersion: 55
        }
      ],
      tablet: [
        {
          os: 'ios',
          osVersion: '9',
          browser: 'mobile safari'
        }, {
          os: 'android',
          osVersion: '5.0',
          browser: 'chrome'
        }
      ],
      mobile: [
        {
          os: 'ios',
          osVersion: '9',
          browser: 'mobile safari'
        }, {
          os: 'android',
          osVersion: '5.0',
          browser: 'chrome',
          browserVersion: 58
        }
      ]
    }
  }

  compareVersions (a, b) {
    if (typeof a === 'string' || a instanceof String) {
      return semverCompare(a, b) <= 0
    }

    return a <= parseInt(b, 10)
  }

  isSupported () {
    let supported = false

    this.supported[this.type].every(device => {
      supported = Object.keys(device).every(requirement => {
        let value = device[requirement]

        switch (requirement) {
          case 'os':
            return value === this.parser.getOS().name.toLowerCase()

          case 'osVersion':
            return this.compareVersions(value, this.parser.getOS().version)

          case 'browser':
            return value === this.parser.getBrowser().name.toLowerCase()

          case 'browserVersion':
            return this.compareVersions(value, this.parser.getBrowser().version)

          default:
            return false
        }
      })

      return !supported
    })

    return supported
  }

  isAppBrowser () {
    const ua = navigator.userAgent || navigator.vendor || window.opera

    if ((ua.indexOf('FBAN') > -1) || (ua.indexOf('FBAV') > -1) || (ua.indexOf('Twitter') > -1)) {
      return true
    }

    return false
  }

  isSafari () {
    const browser = this.parser.getBrowser().name.toLowerCase()

    return browser.indexOf('safari') > -1
  }

  isMobile () {
    return this.type === 'phone' || this.type === 'tablet'
  }

  isPhone () {
    return this.type === 'phone'
  }

  isTablet () {
    return this.type === 'tablet'
  }

  isWebPSupported () {
    if (!this.isWebPChecked) {
      this.isWebPChecked = true

      const element = document.createElement('canvas')

      if (element.getContext && element.getContext('2d')) {
        this.isWebPCheck = element.toDataURL('image/webp').indexOf('data:image/webp') === 0
      }
    }

    return this.isWebPCheck
  }

  check (successCallback, failCallback) {
    if (this.isSupported()) {
      successCallback()
    } else {
      failCallback()
    }
  }
}

export default new Detection()
