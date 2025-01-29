// Définition de l'interface pour les tokens
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  value: T extends any[] ? T : T | null;
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    description: string;
    type: number;
  };
}

