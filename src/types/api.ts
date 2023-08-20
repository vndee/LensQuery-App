export type healthCheckResponse = {
  status: number;
  data: string;
}

export type GetOCRAccessTokenResponse = {
  status: number;
  data: {
    app_token: string;
    app_token_expires_at: number;
  }
}