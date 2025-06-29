// CSS imports
import '../styles/styles.css';
import swRegister from './utils/sw-register';

import App from './pages/app';

const app = new App({
  content: document.querySelector('#main-content'),
  drawerButton: document.querySelector('#drawer-button'),
  navigationDrawer: document.querySelector('#navigation-drawer'),
});
// Di akhir file, tambahkan event listener
window.addEventListener('load', () => {
  swRegister();
});