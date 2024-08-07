# 开发环境准备

### nodejs
为了避免版本冲突建议通过 conda 进行 nodejs 环境安装, 本项目使用 2024-07 月间的 LTS 版本 v20.12.0
如果还没有安装 `conda`，可以从以下链接下载并安装 Miniconda 或 Anaconda：
   - [Miniconda](https://docs.conda.io/en/latest/miniconda.html)
   - [Anaconda](https://www.anaconda.com/products/distribution)

1. **创建并激活一个新的 Conda 环境**（可选，但推荐这样做，以避免影响其他环境）:
   ```bash
   conda create -n nodee-lts
   conda activate nodee-lts
   ```     

2. **添加 Conda-Forge 仓库**（如果还没有添加过）:
   ```bash
   conda config --add channels conda-forge
   ```

3. **使用 Conda 安装 Node.js 的 认定版本**:
   ```bash
   conda install -c conda-forge nodejs=20
   ```

4. **验证安装**:
   安装完成后，可以通过以下命令验证 Node.js 和 npm 是否安装成功，以及它们的版本：
   ```bash
   node -v
   npm -v
   ```

### wrangler
`wrangler` 是一个用于管理和部署 Cloudflare Workers 的命令行工具。它能快速初始化新项目、本地开发和调试、部署 Workers 到 Cloudflare 边缘网络。`wrangler` 使用 `wrangler.toml` 文件管理配置，支持 Workers KV 存储的创建和管理，并提供实时日志查看功能。通过 `wrangler`，开发者可以高效地在 Cloudflare 上开发、调试和部署代码，极大地简化了操作流程。

<details>
<summary> <b> wrangler 安装以及配置 </b> </summary>

- wrangler 安装，请在项目目录当中执行
```bash
npm install wrangler --save-dev
```
- 验证 wrangler 安装
```bash
npx wrangler -v
```
- 配置文件 wrangler.toml
```
name = "oauth-client"
main = "src/index.ts"
compatibility_date = "2024-07-25"
```
</details>

### Google Cloud
- 需要一个 Google Services account
  
- A Google OAuth Client ID and Secret, from the [Credentials](https://console.cloud.google.com/apis/credentials) > + Create credentials > Oauh client ID. > Application: Web application
  - 注意: "Authorized redirect URIs"
    - 本地开发时可使用 `http://127.0.0.1:8787/auth`
    - 生产环境时应使用 `[your cloudflare worker url]/auth` 
  - 完成设置后需要需要记录生成的 `Client ID` 和 `Client secret`
