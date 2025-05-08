import { genSalt, hash } from 'bcrypt';

export async function hashPassword(password: string) {
  const salt = await genSalt(10);
  return await hash(password, salt);
}

async function refreshAccessToken(token: any) {
  try {
    if (token.provider === 'google') {
      const url =
        'https://oauth2.googleapis.com/token?' +
        new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          grant_type: 'refresh_token',
          refresh_token: token.refreshToken,
        });

      const res = await fetch(url, { method: 'POST' });
      const data = await res.json();

      return {
        accessToken: data.access_token,
        expiresAt: Date.now() + data.expires_in * 1000,
        refreshToken: data.refresh_token, // có thể null
      };
    }

    // Nếu là credentials, gọi API backend của bạn
    const res = await fetch('https://your-backend.com/api/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const data = await res.json();

    return {
      accessToken: data.accessToken,
      expiresAt: Date.now() + data.expiresIn * 1000,
      refreshToken: data.refreshToken,
    };
  } catch (err) {
    console.error('Refresh token failed:', err);
    return {
      accessToken: '',
      refreshToken: token.refreshToken,
      expiresAt: 0,
    };
  }
}
