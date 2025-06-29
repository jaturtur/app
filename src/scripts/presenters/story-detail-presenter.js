import { parseActivePathname } from '../routes/url-parser';

class StoryDetailPresenter {
  // Constructor menerima view dan data source
  constructor({ view, dataSource }) {
    this._view = view;
    this._dataSource = dataSource;
    this._detailContainer = document.getElementById('story-detail'); // Ambil container di sini

    this._renderPage(); // Panggil method utama saat presenter dibuat
  }

  async _renderPage() {
    try {
      const { id } = parseActivePathname();
      const story = await this._dataSource.getStoryDetail(id);

      // Panggil method di view untuk menampilkan data
      this._view.showStory(story, this._detailContainer);
    } catch (error) {
      // Panggil method di view untuk menampilkan error
      this._view.showError(error.message, this._detailContainer);
    }
  }
}

export default StoryDetailPresenter;