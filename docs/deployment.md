## 部署
### 本地开发环境
1. 创建项目
  可以使用 Cloudflare 提供的交互命令行工具 C3 (create-cloudflare-cli) 进行项目创建.
    ```
    npm create cloudflare
    ```
    交互过程中选择 Worker built from a template hosted in a git repository, 然后使用 `https://github.com/crazynomad/cloudflare-worker-google-oauth`
1. wrangler 配置
  建议 wrangler.toml 配置， `name` 是 worker 的名称，可自行更改
    ```
    name = "oauth-client"
    main = "src/index.ts"
    compatibility_date = "2024-07-25"
    ```
1. 环境变量是指
使用 wrangler 设置[上文生成 OAuth Client ID 和 Client secret](#google-cloud):
    `npx wrangler secret put CLIENT_ID`
    `npx wrangler secret put CLIENT_SECRET`
    `npx wrangler secret put REDIRECT_URI`
1. 设置Cloudflare 缓存(KV)
  创建 `KV` namespace: `npx wrangler kv namespace create "authTokens"` 并根据返回值在 `wrangler.toml` 文件中追加对应配置， 例如
    ```
    [[kv_namespaces]]
    binding = "authTokens"
    id = "cac2199813c246679f58a34ef915e138"

    [vars]
    LOCAL = true
    ```

1. 本地环境变量
  创建一个 `.dev.vars` 的文件，其中添加
    ```
    LOCAL = true
    CLIENT_ID = "<Replace With your CLIENT ID>"
    CLIENT_SECRET = "<Replace With your CLIENT SECRET>"
    REDIRECT_URI = "http://127.0.0.1:8787/auth"
    ```
    了解更多环境变量相关内容
    - [Environment variables](https://developers.cloudflare.com/workers/configuration/environment-variables/)
    - [System environment variables](https://developers.cloudflare.com/workers/wrangler/system-environment-variables/)
1. 启动
  `npx wrangler dev`
  然后访问 http://127.0.0.1:8787 ， 应该可以自动被引导进入 OAuth 授权流程。
1. DONE ！！！

### 线上部署
1. 利用 `wrangler` 工具部署至线上环境
   `npx wrangler deploy`
2. 登陆 Cloudflare Dashboard, 在 Workers & Pages 下面找到你的 Worker, 复制其外部访问的 `Worker URL` 
3. 编辑之前在 Google Cloud 的 生成的 OAuth 2.0 Client ID, 追加一个 `Authorized redirect URI`, 填入你的 [`Worker URL`/auth]
4. 在浏览器中访问 `Worker URL`， 应该可以自动被引导进入和本地开发环境相同的 OAuth 授权流程。
5. Success ！！！
