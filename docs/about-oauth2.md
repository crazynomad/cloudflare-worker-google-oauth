# About OAuth2

## 协议介绍
OAuth 2.0 是一种授权框架，允许第三方应用在资源所有者的许可下，获取访问资源服务器上的受保护资源的权限，而不需要暴露资源所有者的凭据。OAuth 2.0 被广泛应用于社交登录、API 访问控制等场景。

> The OAuth 2.0 authorization framework enables a third-party application to obtain limited access to an HTTP service, either on behalf of a resource owner by orchestrating an approval interaction between the resource owner and the HTTP service, or by allowing the third-party application to obtain access on its own behalf.

## 名词解释

1. **授权服务器（Authorization Server）**：
   - 负责验证资源所有者的身份，并颁发访问令牌（Access Token）给客户端应用。
     > 在本项目中由 Google Cloud 的相应API endpoints 来提供 OAuth2 业务流程中的授权服务。（待完善）

2. **资源服务器（Resource Server）**：
   - 托管资源的服务器，使用访问令牌来决定是否允许客户端访问受保护资源。
     > 在本项目中由 Google APIs 的相应API endpoints 来提供对应的资源访问服务。（待完善）

3. **客户端（Client）**：
   - 请求访问受保护资源的第三方应用。它代表资源所有者操作，但并不代表资源所有者的身份。
     > 本项目利用Workers

4. **资源所有者（Resource Owner）**：
   - 拥有受保护资源的实体，通常是最终用户。
