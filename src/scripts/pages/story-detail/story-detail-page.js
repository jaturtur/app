import DicodingStorySource from '../../data/dicoding-story-source';
import StoryDetailPresenter from '../../presenters/story-detail-presenter'; // Sesuaikan path jika perlu
import { parseActivePathname } from '../../routes/url-parser';

class StoryDetailPage {     
  // Method render() tetap sama, tugasnya membuat kerangka halaman
  async render() {
    return `
      <section class="container">
        <h2>Detail Story</h2>
        <div id="story-detail">Loading...</div>
        <a href="#/">Kembali ke daftar</a>
      </section>
    `;
  }

  // afterRender() sekarang hanya bertugas membuat Presenter
  async afterRender() {
    new StoryDetailPresenter({
      view: this,
      dataSource: DicodingStorySource,
    });
  }

  // Method ini akan dipanggil oleh Presenter
  showStory(story, container) {
    if (!story) {
      container.innerHTML = '<p>Story tidak ditemukan.</p>';
      return;
    }

    container.innerHTML = `
      <h3>${story.name}</h3>
      <img src="${story.photoUrl}" alt="Foto story oleh ${story.name}" width="400" />
      <p>${story.description}</p>
      <p>Dibuat pada: ${new Date(story.createdAt).toLocaleString()}</p>
      <p>Lokasi: Lat ${story.lat || 'N/A'}, Lon ${story.lon || 'N/A'}</p>
    `;
  }

  // Method ini juga akan dipanggil oleh Presenter jika ada error
  showError(message, container) {
    container.innerHTML = `<p>Error: ${message}</p>`;
  }
}

export default StoryDetailPage;