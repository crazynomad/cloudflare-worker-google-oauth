import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { HttpsProxyAgent } from 'https-proxy-agent';

interface Env {
  LOCAL: boolean;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT_URI: string;
  authTokens: KVNamespace;
}

interface TokenData {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token?: string;
  refresh_token?: string;
  error?: string;
}

interface UserInfo {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
  locale?: string;
}

const app = new Hono<{ Bindings: Env }>();

app.get('/login', (c) => {
  const state = nanoid();
  const redirectUri = encodeURIComponent(c.env.REDIRECT_URI);
  const clientId = c.env.CLIENT_ID;
  const scope = encodeURIComponent('https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email');
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
  
  setCookie(c, 'oauth_state', state, { httpOnly: true, secure: true, sameSite: 'Lax' });
  
  return c.redirect(authUrl);
});

app.get('/auth', async (c) => {
  const query = c.req.query();
  const code = decodeURIComponent(query.code as string);
  const state = decodeURIComponent(query.state as string);
  const scope = decodeURIComponent(query.scope as string);
  const authuser = decodeURIComponent(query.authuser as string);
  const prompt = decodeURIComponent(query.prompt as string);

  const queryList = {
    code,
    state,
    scope,
    authuser,
    prompt
  };
  
  const storedState = getCookie(c, 'oauth_state');
  
  if (state !== storedState) {
    return c.text('Invalid state parameter', 400);
  }

  let tokenData: TokenData;
  try {
    const body = new URLSearchParams({
      code,
      client_id: c.env.CLIENT_ID,
      client_secret: c.env.CLIENT_SECRET,
      redirect_uri: c.env.REDIRECT_URI,
      grant_type: 'authorization_code'
    })    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });
    
    tokenData = await tokenResponse.json();
    if (tokenData.error) {
      return c.text(`Error: ${tokenData.error}`, 400);
    }
  } catch (error) {
    console.error(error);
    return c.text('Failed to fetch or parse token response', 500);
  }
  
  let userInfo: UserInfo;
  try {
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });
    userInfo = await userInfoResponse.json();
  } catch (error) {
    return c.text('Failed to fetch user info', 500);
  }

  await c.env.authTokens.put(userInfo.sub, JSON.stringify(tokenData));
  
  return c.json({ userInfo, queryList });
});

app.get('/logout', (c) => {
  deleteCookie(c, 'oauth_state', { path: '/', secure: true, sameSite: 'Lax' });
  return c.redirect('/');
});

app.get('/', (c) => c.text('Welcome to the OAuth Demo App'));

export default {
  fetch: app.fetch,
};
