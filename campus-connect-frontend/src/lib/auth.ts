import { api } from "./api";

export async function doLogin(username: string, password: string) {
  const { token } = await api.login(username, password);
  api.tokenStore.set(token);
  return token;
}

export function logout() {
  api.tokenStore.clear();
}

export function isAuthed() {
  return !!api.tokenStore.get();
}
