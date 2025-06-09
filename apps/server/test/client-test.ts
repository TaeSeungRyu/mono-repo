// client-test.ts
import axios from 'axios';

async function runLoadTest() {
  const url = 'http://127.0.0.1:8080/'; // 테스트할 API 주소
  const totalRequests = 2; // 몇 번 호출할지
  const delayMs = 10; // 각 요청 사이의 시간 (ms)

  for (let i = 1; i <= totalRequests; i++) {
    try {
      const res = await axios.get(url);
      console.log(`[${i}] ✅ Success:`, res.data);
    } catch (error: any) {
      if (error) {
        console.log(`[${i}] ❌ Unknown Error:`, error);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}

runLoadTest().catch((error) => {
  console.error('Load test failed:', error);
});
