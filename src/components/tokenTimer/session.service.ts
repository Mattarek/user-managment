import { refreshApi } from '../../api/refreshApi';

export async function refreshSession() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token');

  const res = await refreshApi.post('/refresh-token', {
    refreshToken,
  });

  localStorage.setItem('accessToken', res.data.accessToken);
  localStorage.setItem('refreshToken', res.data.refreshToken);
}
