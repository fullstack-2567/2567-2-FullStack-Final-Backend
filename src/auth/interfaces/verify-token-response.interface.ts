export interface VerifyTokenResponse {
    status: 'success';
    data: {
      valid: boolean;
      user_id: string | null;
      expires_in: number;
    };
  }