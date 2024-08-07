import { defineConfig } from 'vitepress';
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid({
  title: 'Cloudflare Workers Google OAuth',
  description: "Step by Step guide to implement Google OAuth in Cloudflare Workers",
  themeConfig: {
    nav: [
      { text: 'Get Started', link: '/introduction' },
      { text: 'Github', link: 'https://github.com/crazynomad/cloudflare-worker-google-oauth' }
    ],
    sidebar: [
      { text: 'Introduction', link: '/introduction' },      
      { text: 'About OAuth2', link: '/about-oauth2' },
      { text: 'OAuth2 Client Worker 设计思路', link: '/oauth2-client-design' },
      { text: '项目脚手架', link: '/project-scaffolding' },
      { text: '开发环境准备', link: '/development-setup' },
      { text: '路由实现', link: '/implement' },
      { text: '部署', link: '/deployment' },
      { text: '改进计划', link: '/todolist' }
    ]
  },
  mermaid: {
    // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
  },
  // optionally set additional config for plugin itself with MermaidPluginConfig
  mermaidPlugin: {
    class: "mermaid my-class", // set additional css classes for parent container 
  },
});