class Detection {
  isPhone() {
    if (!this.isPhoneChecked) {
      this.isPhoneChecked = true;

      this.isPhoneCheck = document.documentElement.classList.contains('phone');
    }

    return this.isPhoneCheck;
  }

  isTablet() {
    if (!this.isTabletChecked) {
      this.isTabletChecked = true;

      this.isTabletCheck = document.documentElement.classList.contains('phone');
    }

    return this.isTabletCheck;
  }

  isDesktop() {
    return !this.isPhone();
  }

  isWebPSupported() {
    if (!this.isWebPChecked) {
      this.isWebPChecked = true;

      const element = document.createElement('canvas');

      if (element.getContext && element.getContext('2d')) {
        this.isWebPCheck =
          element.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      }
    }

    return this.isWebPCheck;
  }
}

const DetectionManager = new Detection();

export default DetectionManager;
