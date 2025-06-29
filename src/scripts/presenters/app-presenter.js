class AppPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;
  }

  checkLoginStatus() {
    // Presenter memeriksa data dari Model
    const isLoggedIn = !!this._model.getToken();
    // Presenter memerintahkan View untuk update UI
    this._view._updateLoginStatusUI(isLoggedIn);
  }

  logout() {
    // Presenter memerintahkan Model untuk hapus data
    this._model.clearAuthData();
    // Presenter memerintahkan View untuk melakukan tindakan setelah logout
    this._view._onLogout();
  }
}

export default AppPresenter;