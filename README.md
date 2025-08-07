# Webpack css inline

Webpack plugin for inlining css into html files.

## Usage

    new WebpackCssInlinePlugin({
        shared: ["path/to/shared.css"],
        views: {
          index: ["path/to/index.css"],
        },
      }),
