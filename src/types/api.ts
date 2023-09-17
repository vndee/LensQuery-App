export type healthCheckResponse = {
  status: number;
  data: string;
}

export type GetOCRAccessTokenResponse = {
  status: number;
  data: {
    app_id: string;
    app_token: string;
    app_token_expires_at: number;
  }
}

export type OCRResultResponse = {
  status: number;
  data: string;
}

export type OCRResponse = {
  status: number;
  data: string;
  title: string;
}