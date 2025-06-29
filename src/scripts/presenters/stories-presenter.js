// Impor helper untuk berinteraksi dengan IndexedDB
import FavoriteStoryIdb from '../data/database-helper';

class StoriesPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;
  }

  async getStories() {
    this._view._showLoading();
    try {
      // 1. Coba ambil data dari network (API)
      const stories = await this._model.getAllStories();
      this._view._showStories(stories);
      
      // 2. Jika berhasil, simpan setiap story ke IndexedDB
      stories.forEach(story => {
        FavoriteStoryIdb.putStory(story);
      });

    } catch (error) {
      // 3. Jika gagal (misal: offline), tampilkan error dan coba ambil dari IndexedDB
      this._view._showError(error.message);
      
      const stories = await FavoriteStoryIdb.getAllStories();
      if (stories && stories.length > 0) {
        // Jika ada data di IndexedDB, tampilkan
        this._view._showStories(stories);
      }
    }
  }
}

export default StoriesPresenter;