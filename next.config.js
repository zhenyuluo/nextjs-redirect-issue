require(`dotenv`).config();

const withPlugins = require(`next-compose-plugins`);
const withCSS = require(`@zeit/next-css`);
const withLess = require(`@zeit/next-less`);
const FilterWarningsPlugin = require(`webpack-filter-warnings-plugin`);
// const withSass = require(`@zeit/next-sass`);
const withBundleAnalyzer = require(`@zeit/next-bundle-analyzer`);
const nextRuntimeDotenv = require(`next-runtime-dotenv`);
const withConfig = nextRuntimeDotenv({ public: [`API_URL`, `API_KEY`] });
const lessToJS = require(`less-vars-to-js`);
const fs = require(`fs`);
const path = require(`path`);

const nextConfig = {
  analyzeServer: [`server`, `both`].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: [`browser`, `both`].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: `static`,
      reportFilename: `../bundles/server.html`
    },
    browser: {
      analyzerMode: `static`,
      reportFilename: `../bundles/client.html`
    }
  },
  publicRuntimeConfig: {
    URL_APP: process.env.URL_APP,
    URL_API: process.env.URL_API,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    DEVELOPMENT_URL_API: process.env.DEVELOPMENT_URL_API,
    DEVELOPMENT_URL_APP: process.env.DEVELOPMENT_URL_APP,
    PRODUCTION_URL_API: process.env.PRODUCTION_URL_API,
    PRODUCTION_URL_APP: process.env.PRODUCTION_URL_APP,
    PROXY_MODE: process.env.PROXY_MODE,
    PORT_APP: process.env.PORT_APP,
    PORT_API: process.env.PORT_API,
    STATIC_PATH: process.env.STATIC_PATH
  }
};

const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, `./assets/antd-custom.less`), `utf-8`)
);

const configWebpack = (config, isServer) => {
  if (isServer) {
    const antStyles = /antd\/.*?\/style.*?/;
    const origExternals = [...config.externals];
    config.externals = [
      (context, request, callback) => {
        if (request.match(antStyles)) return callback();
        if (typeof origExternals[0] === `function`) {
          return origExternals[0](context, request, callback);
        } else {
          return callback();
        }
      },
      ...(typeof origExternals[0] === `function` ? [] : origExternals)
    ];

    config.module.rules.unshift({
      test: antStyles,
      use: `null-loader`
    });
  }

  // config.devtool = `cheap-module-eval-source-map`;
  config.plugins.push(
    new FilterWarningsPlugin({
      exclude: /extract-css-chunks-plugin[^]*Conflicting order between:/
    })
  );

  return config;
};

const withAntdLess = withLess({
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables
  },
  webpack: (config, { isServer }) => configWebpack(config, isServer)
});

const plugins = [withCSS, withAntdLess, withBundleAnalyzer];

module.exports = withConfig(withPlugins(plugins, nextConfig));
