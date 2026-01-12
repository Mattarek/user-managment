import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "./jwt.types.ts";

export function isTokenExpired(token: string): boolean {
  const decodedToken = jwtDecode<JwtPayload>(token);
  return decodedToken.exp ? decodedToken.exp < Date.now() / 1000 : true;
}
