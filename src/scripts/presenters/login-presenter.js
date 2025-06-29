class LoginPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;
  }

  async login({ email, password }) {
    try {
      const loginResult = await this._model.login(email, password);
      // Panggil Model untuk menyimpan data
      this._model.saveToken(loginResult.token);
      this._model.saveUserName(loginResult.name);
      this._view._onLoginSuccess();
    } catch (error) {
      this._view._onLoginFailed(error.message);
    }
  }
}

export default LoginPresenter;