## 具体实现
1. **路由**：`/` ： 项目首页   
   - 用户请求到达 Worker，检查认证 Cookie。
   - 如果未认证，显示 `/login` 链接。
   - 如果认证，利用Token 调用Google Userinfo API。
   https://github.com/crazynomad/cloudflare-worker-google-oauth/blob/5026fb742ccc4ee7383229da15586555eef2218e/src/index.ts#L227-L261   
2. **路由**：`/login` ：登录页 
   - 用户点击 `/login` 链接，重定向到 Google 的 OAuth2 授权 URL，请求包含 `access_type=offline` 参数。
   https://github.com/crazynomad/cloudflare-worker-google-oauth/blob/5026fb742ccc4ee7383229da15586555eef2218e/src/index.ts#L81-L127   
3. **路由**：`/auth`：授权码交换令牌   
   - Worker 接收到授权码后，与 Google API 交换获取访问令牌和刷新令牌。
   - 存储令牌信息并设置认证 Cookie，然后显示登录成功， 等待10秒后重定向回 `/userinfo`。
   https://github.com/crazynomad/cloudflare-worker-google-oauth/blob/5026fb742ccc4ee7383229da15586555eef2218e/src/index.ts#L134-L192   
4. **路由**：`/userinfo`： 用户信息页   
   - 检查认证 Cookie，如果存在有效令牌，则处理用户请求，如获取用户信息。
   https://github.com/crazynomad/cloudflare-worker-google-oauth/blob/5026fb742ccc4ee7383229da15586555eef2218e/src/index.ts#L198-L221
5. **路由**：`/logout`：撤销令牌并清除 Cookie   
   - 撤销令牌，删除 KV 中的令牌数据，并清除认证 Cookie。
   https://github.com/crazynomad/cloudflare-worker-google-oauth/blob/5026fb742ccc4ee7383229da15586555eef2218e/src/index.ts#L267-L279