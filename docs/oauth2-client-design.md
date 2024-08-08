# OAuth2 Client Worker 设计思路

## 请求时序
```mermaid
sequenceDiagram
    User Browser->>Cloudflare Worker: GET /
    Note left of Cloudflare Worker: The request is unauthenticated
    Cloudflare Worker-->>User Browser: Redirect to Google Sign in
    User Browser->>Google API: Ask for permission
    Google API-->>User Browser: Prompt to sign in
    User Browser->>Google API: Grant permissions
    activate Google API
    Note left of Google API: Google now has a session for the user
    Google API-->>User Browser: Redirect back to Cloudflare Worker with a `code`
    User Browser->>Cloudflare Worker: GET /auth with a `code`
    Cloudflare Worker->>Google API: Exchange `code` for a `token`
    Google API-->>Cloudflare Worker: Access Token and Refresh Token
    activate Cloudflare Worker
    Note left of Cloudflare Worker: An auth is stored in the KV with the token
    Cloudflare Worker-->>User Browser: Set auth cookie and redirect to the original request
    User Browser->>Cloudflare Worker: GET /
    Note left of Cloudflare Worker: Now the client is authenticated
    Cloudflare Worker->>Google API: Get user info
    Google API-->>Cloudflare Worker: User Info
    Cloudflare Worker-->>User Browser: Display user info
    User Browser->>Cloudflare Worker: GET /logout
    Cloudflare Worker->>Google API: Revoke token
    deactivate Google API
    Google API-->>Cloudflare Worker: OK
    deactivate Cloudflare Worker
    Cloudflare Worker-->>User Browser: Clear auth cookie and respond OK
```

## 路由说明
1. 用户访问OAuth2 Client应用首页 `/` 路由，检查认证状态。   
2. 用户访问 `/login` 链接，重定向到 Google OAuth2 登录页面。   
3. 用户在 Google 登录并授权后，Google 返回授权码。
4. 授权码通过 `/auth` 路由交换获取令牌，存储并设置 Cookie。   
5. 用户再次访问 `/` 或 `/userinfo`，检查并处理认证状态。   
6. 用户登出时访问 `/logout`，撤销令牌并清除 Cookie。
