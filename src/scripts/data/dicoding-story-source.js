const API_BASE_URL = '/v1';

class DicodingStorySource {
  // --- Kumpulan fungsi untuk mengelola data otentikasi (Model) ---
  static saveToken(token) {
    localStorage.setItem('token', token);
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static saveUserName(name) {
    localStorage.setItem('userName', name);
  }

  static clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
  }
  // ----------------------------------------------------------------

  static async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Login Gagal. Server merespons: ${response.status} ${response.statusText}`);
    }

    const responseJson = await response.json();
    if (responseJson.error) {
      throw new Error(responseJson.message);
    }
    return responseJson.loginResult;
  }

  static async getAllStories() {
    const response = await fetch(`${API_BASE_URL}/stories`, {
      headers: {
        Authorization: `Bearer ${this.getToken() || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Gagal memuat stories. Status: ${response.status} ${response.statusText}`);
    }

    const responseJson = await response.json();
    if (responseJson.error) {
      throw new Error(responseJson.message);
    }
    return responseJson.listStory;
  }

  static async getStoryDetail(id) {
    const response = await fetch(`${API_BASE_URL}/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${this.getToken() || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Gagal memuat detail story. Status: ${response.status} ${response.statusText}`);
    }

    const responseJson = await response.json();
    if (responseJson.error) {
      throw new Error(responseJson.message);
    }
    return responseJson.story;
  }

  static async addStory(formData) {
    const response = await fetch(`${API_BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.getToken() || ''}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Gagal menambah story. Status: ${response.status} ${response.statusText}`);
    }

    const responseJson = await response.json();
    if (responseJson.error) {
      throw new Error(responseJson.message);
    }
    return responseJson;
  }

  static async addStoryAsGuest(formData) {
    const response = await fetch(`${API_BASE_URL}/stories/guest`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Gagal menambah story sebagai guest. Status: ${response.status} ${response.statusText}`);
    }

    const responseJson = await response.json();
    if (responseJson.error) {
      throw new Error(responseJson.message);
    }
    return responseJson;
  }
  static async register({ name, email, password }) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      throw new Error(`Registrasi Gagal. Server merespons: ${response.status} ${response.statusText}`);
    }

    const responseJson = await response.json();
    if (responseJson.error) {
      throw new Error(responseJson.message);
    }
    return responseJson;
}
}

export default DicodingStorySource;