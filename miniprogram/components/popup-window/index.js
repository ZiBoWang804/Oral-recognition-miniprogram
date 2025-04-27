Component({
  properties: {
    isShowPopup: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    closePopup() {
      this.triggerEvent('closePopup');
    }
  }
})