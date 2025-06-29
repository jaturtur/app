/* global L */
import StoriesPresenter from '../../presenters/stories-presenter';
import DicodingStorySource from '../../data/dicoding-story-source';
import { showFormattedDate } from '../../utils';

class StoriesPage {
  constructor() {
    // 1. View menginisialisasi Presenter, memberikan dirinya sendiri (this) sebagai View
    //    dan DicodingStorySource sebagai Model.
    this._presenter = new StoriesPresenter({
      view: this,
      model: DicodingStorySource,
    });
  }

  async render() {
    // View hanya bertanggung jawab untuk merender struktur HTML dasar.
    return `
      <section class="container">
        <h2>Daftar Stories</h2>
        <div id="map" style="height: 400px; margin-block: 1rem;"></div>
        <div id="stories-list" class="stories-list"></div>
      </section>
    `;
  }

  async afterRender() {
    // 2. Setelah rendering, View meminta Presenter untuk mengambil data.
    await this._presenter.getStories();
  }

  // 3. View menyediakan metode-metode untuk dipanggil oleh Presenter
  //    untuk memanipulasi DOM.
  _showLoading() {
    document.getElementById('stories-list').innerHTML = '<p>Loading...</p>';
  }

  _showError(message) {
    document.getElementById('stories-list').innerHTML = `<p>Error: ${message}</p>`;
  }

  _showStories(stories) {
    const storiesList = document.getElementById('stories-list');
    storiesList.innerHTML = ''; // Kosongkan daftar

    if (stories.length === 0) {
      storiesList.innerHTML = '<p>Tidak ada story tersedia.</p>';
      return;
    }

    stories.forEach((story) => {
      const storyElement = document.createElement('article');
      storyElement.tabIndex = 0;
      storyElement.classList.add('story-item');
      storyElement.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto story oleh ${story.name}" />
        <div class="story-item__content">
          <h3><a href="#/stories/${story.id}">${story.name}</a></h3>
          <p class="story-item__date">${showFormattedDate(story.createdAt)}</p>
          <p class="story-item__description">${story.description}</p>
        </div>
      `;
      storiesList.appendChild(storyElement);
    });

    this._initializeMap(stories);
  }

  _initializeMap(stories) {
    const map = L.map('map').setView([-2.5489, 118.0149], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<b>${story.name}</b><br><a href="#/stories/${story.id}">Lihat detail</a>`);
      }
    });
  }
}

export default StoriesPage;