import { jwtDecode, type JwtPayload } from 'jwt-decode';

export function isTokenExpired(token: string): boolean {
  const decodedToken = jwtDecode<JwtPayload>(token);
  return decodedToken.exp ? decodedToken.exp < Date.now() / 1000 : true;
}
