# 项目脚手架

如前所述 Cloudflare Workers 在部署/运维/可扩展性上存在很大的优势， 但是如果直接使用其提供的 [Runtime APIs](https://developers.cloudflare.com/workers/runtime-apis/) 进行项目开发则存在以下风险

## 潜在风险和注意事项

1. **锁定效应**：
   - **供应商锁定**：过于依赖 Cloudflare Workers 及其特有的 APIs 可能导致迁移到其他平台时成本较高。开发者需要评估这种依赖是否会对项目的长期发展造成限制。

2. **学习成本**：
   - **新技术学习**：Cloudflare Workers 的开发模式和工具链与传统服务器开发有所不同，开发人员需要时间学习和适应。对于团队中的新成员或外包开发人员，这可能会增加培训成本。

## 开发框架 hono
考虑到以上风险，我们寻找一个能够对 Workers API 进行有效封装和模块化， 能够适当缓解**供应商锁定**效应的开发框架， 并且拥有一个设计良好 API 来降低开发人员的**学习成本**。 
Hono 是一个超快速、轻量级的 Web 框架，专为边缘计算环境设计，如 Cloudflare Workers、Deno、Bun 和 AWS Lambda。它提供高性能路由、灵活的中间件支持和简洁的 API，极大地提高了开发效率和代码质量。Hono 使用标准 Web API，具有跨平台兼容性，帮助开发者避免供应商锁定。
而且 Cloudflare 的[官方SDK 项目](https://github.com/cloudflare/workers-sdk)模版中， 也采用了 [hono 作为项目的开发框架](https://github.com/cloudflare/workers-sdk/blob/2893c1abe3daefb67a41adbba66bc038e39f8243/templates/worker-d1-api/package.json#L9-L11)。

更多详情可参考 [Hono 官方文档](https://hono.dev/docs/).
