class AddStoryPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;
    this._cameraStream = null;
  }

  async initCamera() {
    try {
      this._cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      this._view.showCameraStream(this._cameraStream);
    } catch (error) {
      this._view.showCameraError(error.message);
    }
  }

  stopCameraStream() {
    if (this._cameraStream) {
      this._cameraStream.getTracks().forEach(track => track.stop());
      console.log("Stream kamera dinonaktifkan oleh presenter.");
    }
  }

  async addStory(formData) {
    this._view.showLoading();
    this.stopCameraStream(); // Hentikan stream saat proses upload dimulai

    try {
      const token = this._model.getToken();
      if (token) {
        await this._model.addStory(formData);
      } else {
        await this._model.addStoryAsGuest(formData);
      }
      this._view.onAddSuccess();
    } catch (error) {
      this._view.onAddFailed(error.message);
    }
  }
}

export default AddStoryPresenter;