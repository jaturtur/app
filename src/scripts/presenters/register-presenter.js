class RegisterPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;
  }

  async registerUser({ name, email, password }) {
    this._view._showLoading();
    try {
      await this._model.register({ name, email, password });
      this._view._onRegisterSuccess();
    } catch (error) {
      this._view._onRegisterFailed(error.message);
    }
  }
}

export default RegisterPresenter;