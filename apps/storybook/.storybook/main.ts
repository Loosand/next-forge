import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { StorybookConfig } from "@storybook/nextjs";

const require = createRequire(import.meta.url);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
const getAbsolutePath = (value: string) =>
  dirname(require.resolve(join(value, "package.json")));

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-themes"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/nextjs"),
    options: {},
  },
  staticDirs: ["../public"],

  // Fix $RefreshSig$ error in production builds
  webpackFinal: (webpackConfig, { configType }) => {
    if (configType === "PRODUCTION") {
      // Remove ReactRefreshPlugin
      webpackConfig.plugins = webpackConfig.plugins?.filter(
        (plugin) => plugin?.constructor?.name !== "ReactRefreshPlugin"
      );

      // Remove react-refresh babel plugin from all loaders
      const rules = webpackConfig.module?.rules ?? [];
      for (const rule of rules) {
        if (rule && typeof rule === "object" && rule.use) {
          const uses = Array.isArray(rule.use) ? rule.use : [rule.use];
          for (const use of uses) {
            if (
              use &&
              typeof use === "object" &&
              "options" in use &&
              use.options &&
              typeof use.options === "object" &&
              "plugins" in use.options &&
              Array.isArray(use.options.plugins)
            ) {
              use.options.plugins = use.options.plugins.filter(
                (plugin: unknown) => {
                  const pluginName = Array.isArray(plugin) ? plugin[0] : plugin;
                  return (
                    typeof pluginName !== "string" ||
                    !pluginName.includes("react-refresh")
                  );
                }
              );
            }
          }
        }
      }
    }
    return webpackConfig;
  },
};

export default config;
