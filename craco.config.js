const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      //   webpackConfig.plugins.forEach((e) => {
      //     console.log(e)
      //   });

      webpackConfig.plugins = webpackConfig.plugins.map((x) => {
        const name = x?.constructor?.name;
        if (name == "HtmlWebpackPlugin") {
          x.options.chunks = ["main"];
          // console.log(JSON.stringify(x))
        }
        return x;
      });

      return {
        ...webpackConfig,
        entry: {
          main: [
            env === "development" &&
              require.resolve("react-dev-utils/webpackHotDevClient"),
            paths.appIndexJs,
          ].filter(Boolean),
          content: "./src/youtube.ts",
          stuff: "./src/injected.ts",
          timeSetter: "./src/timeSetter.ts",
          options: "./src/options.tsx",
        },
        output: {
          ...webpackConfig.output,
          filename: "static/js/[name].js",
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false,
          // minimize: false //comment out for prod
        },
        plugins: [
          ...webpackConfig.plugins,
          new HtmlWebpackPlugin({
            template: "./public/options.html",
            inject: true,
            chunks: ["options"],
            filename: "options.html",
          }),
        ],
        // mode: 'development' //comment out for prod
      };
    },
  },
};
