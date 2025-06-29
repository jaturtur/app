import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import AppPresenter from '../presenters/app-presenter';
import DicodingStorySource from '../data/dicoding-story-source';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this._presenter = new AppPresenter({
      view: this,
      model: DicodingStorySource,
    });

    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this._initRouting();
    this._setupSkipLink();

    this._presenter.checkLoginStatus();
  }

  _setupSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.querySelector('#main-content');

    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      mainContent.focus();
      mainContent.scrollIntoView();
      skipLink.blur();
    });
  }

  _updateLoginStatusUI(isLoggedIn) {
    const loginMenu = document.getElementById('login-menu');
    const logoutMenu = document.getElementById('logout-menu');
    const logoutButton = document.getElementById('logout-button');

    // --- PERBAIKAN: Tambahkan pengecekan `if (element)` ---
    // Hanya ubah style jika elemennya benar-benar ada di halaman
    if (loginMenu && logoutMenu) {
      if (isLoggedIn) {
        loginMenu.style.display = 'none';
        logoutMenu.style.display = 'block';
      } else {
        loginMenu.style.display = 'block';
        logoutMenu.style.display = 'none';
      }

      logoutButton.onclick = (event) => {
        event.preventDefault();
        this._presenter.logout();
      };
    }
  }

  _onLogout() {
    alert('Anda telah logout.');
    window.location.hash = '#/';
    window.location.reload();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a, button').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  _initRouting() {
    window.addEventListener('hashchange', () => this.renderPage());
    document.addEventListener('DOMContentLoaded', () => this.renderPage());
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    this._presenter.checkLoginStatus(); // Cek status login di setiap render

    if (!page) {
      this.#content.innerHTML = '<h2>404 Halaman Tidak Ditemukan</h2>';
      // Saat halaman 404, tidak ada `afterRender`, jadi tidak ada error lagi.
      return;
    }

    const pageContent = await page.render();

    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        this.#content.innerHTML = pageContent;
        await page.afterRender();
      });
    } else {
      this.#content.innerHTML = pageContent;
      await page.afterRender();
    }
  }
}

export default App;