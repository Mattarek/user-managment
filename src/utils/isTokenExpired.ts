import { jwtDecode, type JwtPayload } from 'jwt-decode';

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;

  try {
    const decodedToken = jwtDecode<JwtPayload>(token);

    if (!decodedToken.exp) return true;

    return decodedToken.exp < Date.now() / 1000;
  } catch {
    return true;
  }
}
