import axios from "axios";
import { useZustandState } from "@/app/state/state";
const useAxios = axios.create({
  timeout: 5000, // 타임아웃 설정
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 설정
useAxios.interceptors.request.use(
  (config) => {
    const { sampleData } = useZustandState(); //이런 식으로 상태 값 가져오기
    if (sampleData) {
      console.log("axios get some data : ", sampleData);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 설정
useAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 처리 로직
    if (error.response?.status === 401) {
      // 예: 인증 실패 처리
      console.log("Unauthorized");
    }
    return Promise.reject(error);
  }
);

export default useAxios;
