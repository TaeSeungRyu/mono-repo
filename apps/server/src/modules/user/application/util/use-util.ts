import { Auth } from '../../domain/auth.entity';

export function stringToJson(arg: string | null): unknown {
  if (!arg) {
    return null; // 또는 적절한 기본값을 반환
  }
  try {
    return JSON.parse(arg);
  } catch (error) {
    console.error('JSON parsing error:', error);
    return null; // 또는 적절한 기본값을 반환
  }
}

export function dataToAuthArray({ data }: any): Auth[] {
  const authArray: Auth[] = [];
  if (data && data instanceof Array) {
    for (const item of data) {
      if (item instanceof Auth) {
        authArray.push(item);
      }
    }
  }
  return authArray;
}
