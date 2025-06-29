// Fungsi untuk mengubah string base64 menjadi Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const swRegister = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported in the browser');
    return;
  }
  try {
    const registration = await navigator.serviceWorker.register('./sw.js');
    console.log('Service worker registered successfully');

    // Minta Izin Notifikasi setelah service worker terdaftar
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted.');
      return;
    }

    // Buat Subscription
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        'BPAb-p0gW1VekY9v4K2l79jhk3WlnvN8BBOh39d-Tiy0cWjXSNhYtD6xW75PzW86ey8nQvUaL0hMhYtKx1iFmJ4'
      ),
    });

    console.log('Push subscription:', subscription);
    
    // NOTE: Di aplikasi nyata, kamu akan mengirim object `subscription` ini ke server backend-mu
    // untuk disimpan, agar server bisa mengirim notifikasi ke perangkat ini.
    // Contoh:
    // await fetch('/api/subscribe', {
    //   method: 'POST',
    //   body: JSON.stringify(subscription),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });

  } catch (error) {
    console.error('Failed to register service worker or subscribe:', error);
  }
};

export default swRegister;