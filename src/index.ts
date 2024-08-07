import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';

interface Env {
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

const fetchUserInfo = async (accessToken: string): Promise<UserInfo> => {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }
  return await response.json();
};

const revokeToken = async (token: string) => {
  await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

app.get('/login', async (c) => {
  const storedState = getCookie(c, 'oauth_state');
  
  if (storedState) {
    const tokenDataJson = await c.env.authTokens.get(storedState);
    if (tokenDataJson) {
      const tokenData: TokenData = JSON.parse(tokenDataJson);
      if (tokenData.refresh_token) {
        const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            client_id: c.env.CLIENT_ID,
            client_secret: c.env.CLIENT_SECRET,
            refresh_token: tokenData.refresh_token,
            grant_type: 'refresh_token'
          })
        });

        const newTokenData: TokenData = await refreshResponse.json();
        if (newTokenData.error) {
          return c.text(`Error: ${newTokenData.error}`, 400);
        }

        await c.env.authTokens.put(storedState, JSON.stringify(newTokenData), { expirationTtl: newTokenData.expires_in });
        setCookie(c, 'oauth_state', storedState, { httpOnly: true, secure: true, sameSite: 'Lax', maxAge: newTokenData.expires_in });
        return c.redirect('/userinfo');
      }
    }
  }

  const state = nanoid();
  const redirectUri = encodeURIComponent(c.env.REDIRECT_URI);
  const clientId = c.env.CLIENT_ID;
  const scope = encodeURIComponent('https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email');
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&access_type=offline`;
  
  setCookie(c, 'oauth_state', state, { httpOnly: true, secure: true, sameSite: 'Lax' });
  
  return c.redirect(authUrl);
});

app.get('/auth', async (c) => {
  const query = c.req.query();
  const code = decodeURIComponent(query.code as string);
  const state = decodeURIComponent(query.state as string);
  
  const storedState = getCookie(c, 'oauth_state');
  
  if (state !== storedState) {
    return c.text('Invalid state parameter', 400);
  }

  let tokenData: TokenData;
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code: code as string,
        client_id: c.env.CLIENT_ID,
        client_secret: c.env.CLIENT_SECRET,
        redirect_uri: c.env.REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });
    
    tokenData = await tokenResponse.json();
    if (tokenData.error) {
      return c.text(`Error: ${tokenData.error}`, 400);
    }
  } catch (error) {
    return c.text('Failed to fetch or parse token response', 500);
  }

  await c.env.authTokens.put(storedState, JSON.stringify(tokenData), { expirationTtl: tokenData.expires_in });

  return c.html(`
    <html>
      <head>
        <meta http-equiv="refresh" content="10;url=/userinfo">
      </head>
      <body>
        <h1>Authentication successful</h1>
        <p>Redirecting to user info in <span id="countdown">10</span> seconds...</p>
        <script>
          let countdown = 10;
          const countdownElement = document.getElementById('countdown');
          setInterval(() => {
            countdown--;
            if (countdownElement) {
              countdownElement.textContent = countdown.toString();
            }
          }, 1000);
        </script>
      </body>
    </html>
  `);
});

app.get('/userinfo', async (c) => {
  const storedState = getCookie(c, 'oauth_state');
  if (!storedState) {
    return c.text('Not authenticated', 401);
  }

  const tokenDataJson = await c.env.authTokens.get(storedState);
  if (!tokenDataJson) {
    return c.text('Not authenticated', 401);
  }

  const tokenData: TokenData = JSON.parse(tokenDataJson);
  
  try {
    const userInfo = await fetchUserInfo(tokenData.access_token);
    return c.json(userInfo, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return c.text('Failed to fetch user info', 500);
  }
});

app.get('/', async (c) => {
  const storedState = getCookie(c, 'oauth_state');
  
  if (storedState) {
    const tokenDataJson = await c.env.authTokens.get(storedState);
    if (tokenDataJson) {
      const tokenData: TokenData = JSON.parse(tokenDataJson);
      
      try {
        const userInfo = await fetchUserInfo(tokenData.access_token);
        
        return c.html(`
          <html>
            <body>
              <h1>User Info</h1>
              <pre>${JSON.stringify(userInfo, null, 2)}</pre>
              <a href="/logout">Logout</a>
            </body>
          </html>
        `);
      } catch (error) {
        return c.text('Failed to fetch user info', 500);
      }
    }
  }
  
  return c.html(`
    <html>
      <body>
        <h1>Welcome to the OAuth Demo App</h1>
        <a href="/login">Login with Google</a>
      </body>
    </html>
  `);
});

app.get('/logout', async (c) => {
  const storedState = getCookie(c, 'oauth_state');
  if (storedState) {
    const tokenDataJson = await c.env.authTokens.get(storedState);
    if (tokenDataJson) {
      const tokenData: TokenData = JSON.parse(tokenDataJson);
      await revokeToken(tokenData.access_token);
      await c.env.authTokens.delete(storedState);
    }
  }
  deleteCookie(c, 'oauth_state', { path: '/', secure: true, sameSite: 'Lax' });
  return c.redirect('/');
});

export default {
  fetch: app.fetch,
};
