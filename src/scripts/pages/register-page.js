import RegisterPresenter from '../presenters/register-presenter';
import DicodingStorySource from '../data/dicoding-story-source';

class RegisterPage {
  constructor() {
    this._presenter = new RegisterPresenter({
      view: this,
      model: DicodingStorySource,
    });
  }

  async render() {
    return `
      <section class="container">
        <h2>Registrasi Akun Baru</h2>
        <form id="register-form" class="register-form">
          <div class="form-group">
            <label for="name">Nama:</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" minlength="8" required>
          </div>
          <button type="submit" id="submit-button" class="button-submit">Daftar</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      await this._presenter.registerUser({ name, email, password });
    });
  }

  _showLoading() {
    document.getElementById('submit-button').innerText = 'Mendaftar...';
    document.getElementById('submit-button').disabled = true;
  }

  _onRegisterSuccess() {
    alert('Registrasi berhasil! Silakan login.');
    window.location.hash = '#/login';
  }

  _onRegisterFailed(message) {
    alert(`Registrasi gagal: ${message}`);
    document.getElementById('submit-button').innerText = 'Daftar';
    document.getElementById('submit-button').disabled = false;
  }
}

export default RegisterPage;