import partytown from "@astrojs/partytown";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { defineConfig } from "astro/config";
import rehypeMermaid from "rehype-mermaid";
import emoji from "remark-emoji";
import remarkSvgBob from "remark-svgbob";
import remarkYoutube from "remark-youtube";
import starlightLinksValidator from "starlight-links-validator";
import { collapsibleFrames } from "/src/plugins/collapsible-frames";
import remarkIncludeCode from "/src/plugins/remark-code-import";

// https://astro.build/config
export default defineConfig({
  site: "https://germanheim.github.io/",
  base: "globalsearch-rs-website",
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        limitInputPixels: false,
      },
    },
  },
  prefetch: {
    prefetchAll: true,
  },
  markdown: {
    remarkPlugins: [remarkIncludeCode, emoji, remarkYoutube, remarkSvgBob],
    rehypePlugins: [rehypeMermaid],
  },
  integrations: [
    starlight({
      title: "GlobalSearch-rs",
      customCss: ["/src/tailwind.css"],
      logo: {
        dark: "./src/assets/logo-dark.png",
        light: "./src/assets/logo-light.png",
        replacesTitle: true,
      },
      favicon: "/favicon-32.png",
      head: [
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: "/ratatui-og.png",
          },
        },
      ],
      components: {
        Head: "./src/components/Head.astro",
        Header: "./src/components/Header.astro",
      },
      plugins: [
        starlightLinksValidator({
          errorOnRelativeLinks: false,
        }),
      ],
      expressiveCode: {
        plugins: [pluginCollapsibleSections(), collapsibleFrames()],
      },
      social: {
        github: "https://github.com/GermanHeim/globalsearch-rs",
      },
      sidebar: [
        {
          label: "Getting Started",
          items: [
            {
              label: "Overview",
              link: "/getting-started/overview/",
            },
            {
              label: "Comparison with MATLAB",
              link: "/getting-started/comparison-with-matlab/",
            },
          ],
        },
        {
          label: "🦀 Rust",
          collapsed: false,
          items: [
            {
              label: "🦀 Installation",
              link: "/rust/installation/",
            },
            {
              label: "🦀 Feature flags",
              link: "/rust/feature-flags/",
            },
            {
              label: "🦀 Running an Optimization Problem",
              link: "/rust/running-an-optimization-problem/",
            },
            {
              label: "🦀 Checkpointing",
              link: "/rust/checkpointing/",
            },
            {
              label: "Examples",
              collapsed: true,
              items: [
                {
                  label: "Six-Hump Camel Function",
                  link: "/tutorials/",
                },
              ],
            },
          ],
        },
        {
          label: "🐍 Python",
          collapsed: false,
          items: [
            {
              label: "🐍 Comparison with Rust",
              link: "/python/comparison-with-rust/",
            },
            {
              label: "🐍 Installation",
              link: "/python/installation/",
            },
            { label: "🐍 Running an Optimization Problem",
              link: "/python/running-an-optimization-problem/",
            },
            {
              label: "Examples",
              collapsed: true,
              items: [
                {
                  label: "🐍 Automatic Differentiation (JAX)",
                  link: "/python/examples/automatic_differentiation_jax",
                },
              ],
            },
          ],
        },
        {
          label: "Local Solvers",
          link: "/local-solvers/",
        },
        {
          label: "Contributing",
          link: "/contributing/",
        },
      ],
      editLink: {
        baseUrl: "https://github.com/GermanHeim/globalsearch-rs-website/",
      },
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    partytown(),
  ],
  vite: {
    server: {
      watch: {
        ignored: ["**/target/**/*"],
      },
    },
  },
});
