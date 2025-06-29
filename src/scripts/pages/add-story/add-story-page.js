/* global L */
import AddStoryPresenter from '../../presenters/add-story-presenter'; // Naik dua level
import DicodingStorySource from '../../data/dicoding-story-source';   // Naik dua level

class AddStoryPage {
  constructor() {
    this._presenter = new AddStoryPresenter({
      view: this,
      model: DicodingStorySource,
    });
  }

  async render() {
    return `
      <section class="container">
        <h2>Tambah Story Baru</h2>
        <form id="add-story-form" class="add-story-form">
          <div class="form-group">
            <label for="photo">Foto:</label>
            <div class="camera-wrapper">
              <video id="camera-preview" autoplay playsinline></video>
              <canvas id="camera-canvas" style="display: none;"></canvas>
              <button id="capture-button" type="button">Ambil Gambar</button>
            </div>
            <img id="preview-image" src="#" alt="Preview Gambar" style="display: none; max-width: 100%; margin-top: 10px;" />
            <input type="file" id="photo" name="photo" style="display: none;" required>
          </div>
          <div class="form-group">
            <label for="description">Deskripsi:</label>
            <textarea id="description" name="description" rows="4" required></textarea>
          </div>
          <div class="form-group">
            <label>Lokasi (Klik pada peta):</label>
            <div id="map-add" style="height: 300px;"></div>
            <input type="hidden" id="latitude" name="lat">
            <input type="hidden" id="longitude" name="lon">
          </div>
          <button type="submit" class="button-submit">Upload Story</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    // --- Inisialisasi DOM Elements ---
    const form = document.getElementById('add-story-form');
    const photoInput = document.getElementById('photo');
    const descriptionInput = document.getElementById('description');
    const latInput = document.getElementById('latitude');
    const lonInput = document.getElementById('longitude');
    const captureButton = document.getElementById('capture-button');

    // --- Minta Presenter untuk Menyalakan Kamera ---
    this._presenter.initCamera();

    // --- Event Listeners yang Memanggil Presenter ---
    captureButton.addEventListener('click', () => {
      this.captureImage();
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append('photo', photoInput.files[0]);
      formData.append('description', descriptionInput.value);
      if (latInput.value && lonInput.value) {
        formData.append('lat', latInput.value);
        formData.append('lon', lonInput.value);
      }
      await this._presenter.addStory(formData);
    });

    // Pastikan stream kamera berhenti saat pengguna meninggalkan halaman
    window.addEventListener('hashchange', () => this._presenter.stopCameraStream(), { once: true });

    // --- Logika Peta (Tetap di View karena ini murni manipulasi DOM) ---
    this._initializeMap();
  }

  // --- Metode yang dipanggil Presenter atau internal View ---
  showCameraStream(stream) {
    const video = document.getElementById('camera-preview');
    video.srcObject = stream;
  }

  showCameraError(message) {
    console.error("Kamera tidak dapat diakses:", message);
    alert("Tidak bisa mengakses kamera. Pastikan Anda memberikan izin.");
  }

  captureImage() {
    const video = document.getElementById('camera-preview');
    const canvas = document.getElementById('camera-canvas');
    const previewImage = document.getElementById('preview-image');
    const photoInput = document.getElementById('photo');
    const captureButton = document.getElementById('capture-button');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    previewImage.src = canvas.toDataURL('image/jpeg');
    previewImage.style.display = 'block';
    video.style.display = 'none';
    captureButton.style.display = 'none';

    canvas.toBlob((blob) => {
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      photoInput.files = dataTransfer.files;
    }, 'image/jpeg');

    this._presenter.stopCameraStream();
  }

  _initializeMap() {
    const latInput = document.getElementById('latitude');
    const lonInput = document.getElementById('longitude');
    const map = L.map('map-add').setView([-2.5489, 118.0149], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    let marker;
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      latInput.value = lat;
      lonInput.value = lng;
      if (marker) marker.setLatLng(e.latlng);
      else marker = L.marker(e.latlng).addTo(map);
      marker.bindPopup(`Lokasi dipilih: <span class="math-inline">{lat.toFixed(4)}, </span>{lng.toFixed(4)}`).openPopup();
    });
  }

  showLoading() {
    document.querySelector('.button-submit').innerText = 'Mengunggah...';
    document.querySelector('.button-submit').disabled = true;
  }

  onAddSuccess() {
    alert('Story berhasil ditambahkan!');
    window.location.hash = '#';
  }

  onAddFailed(message) {
    alert(`Gagal menambahkan story: ${message}`);
    document.querySelector('.button-submit').innerText = 'Upload Story';
    document.querySelector('.button-submit').disabled = false;
  }
}

export default AddStoryPage;