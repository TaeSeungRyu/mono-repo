const CACHE_NAME = "image-cache";

//웹 워커와 캐싱을 이용한 샘플
self.onmessage = async function (event) {
  const apiUrl = event.data; // API URL을 메인 스레드에서 전달받음
  try {
    const cache = await caches.open(CACHE_NAME); // 캐시 이름 지정

    // 캐시에서 먼저 확인
    const cachedResponse = await cache.match(apiUrl);
    if (cachedResponse) {
      // 캐시된 이미지가 있으면 바로 반환
      const cachedBlob = await cachedResponse.blob();
      self.postMessage({ success: true, data: cachedBlob });
      return;
    }

    const response = await fetch(apiUrl);
    const fileBlob = await response.blob();

    await cache.put(apiUrl, new Response(fileBlob));

    // 데이터를 메인 스레드로 보냄
    self.postMessage({ success: true, data: fileBlob });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
