# ( ◕◡◕)っ Cloudflare Workers Google OAuth

本项目是一个利用 Cloudflare 提供的 Workers 无服务器架构（Serverless）实现的 **OAuth2 协议中的客户端（Client）应用**， OAuth2 中对应的授权服务器和资源服务器由 Google Cloud 进行提供。本项目fork [jazcarate/cloudflare-worker-google-oauth](https://github.com/jazcarate/cloudflare-worker-google-oauth) 并对项目文档细节进行了补充并Cloudflare Workers v3 版本的 CLI （Wrangler, C3）工具进行改进，


## About Cloudflare Workers

Cloudflare Workers 是一种无服务器计算平台，允许开发者在全球分布的 Cloudflare 网络上运行 JavaScript 代码，从而实现快速、可扩展和高性能的应用和功能。需要注册一个 Cloudflare account 来使用 Workers, Workers 免费规格(Free Plan) 的 Workers 每日可支持 100,000 请求响应，每个请求响应消耗的的 CPU 时间可达10 ms。Cloudflare 【2024年公布的计费模型](https://blog.cloudflare.com/workers-pricing-scale-to-zero/)中排除了 I/O 等待的耗时， 使得多数I/O密集Web应用可以在免费规格上顺利的运行。

> Cloudflare Workers provides a serverless execution environment that allows you to create new applications or augment existing ones without configuring or maintaining infrastructure.

> Cloudflare Workers let you deploy serverless code instantly across the globe for exceptional performance, reliability, and scale.

