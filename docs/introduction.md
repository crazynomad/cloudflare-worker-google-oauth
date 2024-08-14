# ( ◕◡◕)っ Cloudflare Workers Google OAuth

本项目是一个利用 Cloudflare 提供的 Workers 无服务器架构（Serverless）实现的 **OAuth2 协议中的客户端（Client）应用**， OAuth2 中对应的授权服务器和资源服务器由 Google Cloud 进行提供。本项目fork [jazcarate/cloudflare-worker-google-oauth](https://github.com/jazcarate/cloudflare-worker-google-oauth) 并对项目文档细节进行了补充并Cloudflare Workers v3 版本的 CLI （Wrangler, C3）工具进行改进，


## About Cloudflare Workers

Cloudflare Workers 是一种无服务器计算平台，允许开发者在全球分布的 Cloudflare 网络上运行 JavaScript 代码，从而实现快速、可扩展和高性能的应用和功能。需要注册一个 Cloudflare account 来使用 Workers, Workers 免费规格(Free Plan) 的 Workers 每日可支持 100,000 请求响应，每个请求响应消耗的的 CPU 时间可达10 ms。Cloudflare 【2024年公布的计费模型](https://blog.cloudflare.com/workers-pricing-scale-to-zero/)中排除了 I/O 等待的耗时， 使得多数I/O密集Web应用可以在免费规格上顺利的运行。

> Cloudflare Workers provides a serverless execution environment that allows you to create new applications or augment existing ones without configuring or maintaining infrastructure.

> Cloudflare Workers let you deploy serverless code instantly across the globe for exceptional performance, reliability, and scale.

### 深度了解 Cloudflare 赛博菩萨 😜
在一个充分竞争的云服务市场，[2009年成立的 Cloudflare](https://en.wikipedia.org/wiki/Cloudflare) 的竞争优势在于其强大的全球边缘网络、高效的内容分发网络（CDN）和广泛的网络安全产品组合。与传统的云服务提供商相比（比如 1998 年成立的 [Akamai](https://en.wikipedia.org/wiki/Akamai_Technologies)），Cloudflare 专注于加速和保护互联网应用程序和网站，使其在应对分布式拒绝服务（DDoS）攻击、防火墙规则管理、以及优化全球数据传输方面具有独特的优势。

此外，Cloudflare 提供的创新产品如 Workers（边缘计算平台）和 Pages（静态网站托管）进一步提升了其市场竞争力。通过降低延迟、提高安全性以及提供高可扩展性的无服务器架构，Cloudflare 能够为开发者和企业提供更灵活、高效的解决方案，这些特性在一个充分竞争的市场中能够有效吸引那些寻求更高性能和更好安全性的客户群体。

因此，尽管面临激烈的市场竞争，Cloudflare 凭借其在边缘计算和网络安全方面的持续创新，能够在竞争中脱颖而出，并建立起长期的客户忠诚度。关于产品介绍， 请移步 [Cloudflare 官方文档](https://developers.cloudflare.com/workers/)

#### Fun Fact
- [Ep 46. 你知道『赛博佛祖』Cloudflare 吗？ 捕蛇者说 Podcast](https://podcasts.apple.com/cn/podcast/%E6%8D%95%E8%9B%87%E8%80%85%E8%AF%B4/id1460475182?i=1000655762344)  
  - 参与播客的CF 工程师重点强调了公司的工程文化和内部的透明度， 从这些细节让我开始理解作为一个后来者， 是如何实现`弯道超车`的。
  - 尤其是介绍了下为什么Cloudflare能够实现免费， 以及背后从技术原理上的解释。（当然这个和国外 IDC 流量成本较低的显示也是高度相关的，有关带宽价格故事， 可[听听这期](https://www.xiaoyuzhoufm.com/episode/65ba7071e4c892c9905841fb)）
  - 一窥业界标杆的 Cloudflare 事故报告：[Cloudflare incident on October 30, 2023](https://blog.cloudflare.com/cloudflare-incident-on-october-30-2023) 
- [How can CloudFlare offer a free CDN with unlimited bandwidth?](https://webmasters.stackexchange.com/questions/88659/how-can-cloudflare-offer-a-free-cdn-with-unlimited-bandwidth)
- [为什么 Cloudflare 提供免费的服务？](https://www.kawabangga.com/posts/4361)

#### 用钱投票
下面列出了Cloudflare 和 Akamai的股价对比，显示出的市场对 Cloudflare 的运营具有较强的认可。
[![Cloudflare Stock Price](https://finviz.com/chart.ashx?t=NET&ty=c&ta=1&p=d&s=l)](https://finance.yahoo.com/quote/NET/)

[![Akamai Stock Price](https://finviz.com/chart.ashx?t=AKAM&ty=c&ta=1&p=d&s=l)](https://finance.yahoo.com/quote/AKAM/)
