export interface AuthResponse {
    token: string;
    refreshToken: string;
  }

export interface SignupResponse {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  token: string; 
  refreshToken: string;
}
