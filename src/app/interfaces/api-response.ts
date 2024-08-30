export interface AuthResponse {
    "value": {
      accessToken: string,
      refreshToken: string
    }
    "isSuccess": boolean,
    "isFailure": boolean,
    "error": {
        code: string;
        description: string;
        type: number;
      }
}

export interface ApiResponse<T> {
    value: T[];
    isSuccess: boolean;
    isFailure: boolean;
    error: {
      code: string;
      description: string;
      type: number;
    };
  }