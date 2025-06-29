import LoginPresenter from '../../presenters/login-presenter';
import DicodingStorySource from '../../data/dicoding-story-source';

class LoginPage {
  constructor() {
    this._presenter = new LoginPresenter({
      view: this,
      model: DicodingStorySource,
    });
  }

  async render() {
    return `
      <section class="container">
        <h2>Login</h2>
        <form id="login-form" class="login-form">
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" minlength="8" required>
          </div>
          <button type="submit" class="button-submit">Login</button>
    <p class="auth-link">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
  </form>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      await this._presenter.login({ email, password });
    });
  }

  _onLoginSuccess() {
    alert('Login berhasil!');
    window.location.hash = '#/';
    window.location.reload();
  }

  _onLoginFailed(message) {
    alert(`Login gagal: ${message}`);
  }
}

export default LoginPage;