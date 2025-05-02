export class ResponseDto {
  result?: {
    success: boolean;
    access_token: string;
    refresh_token: string;
  };
  error?: string;
  message?: string;
  constructor();
  constructor(
    result: { success: boolean; access_token: string; refresh_token: string },
    error: string,
    message: string,
  );
  constructor(
    result?: { success: boolean; access_token: string; refresh_token: string },
    error?: string,
    message?: string,
  ) {
    if (result) this.result = result;
    if (error) this.error = error;
    if (message) this.message = message;
  }
}
