const cssInline = require("./css-inline");

const PLUGIN_NAME = "Css inline webpack plugin";

const onInitCompilation = (compiler, options) => (compilation) => {
  compilation.hooks.processAssets.tapPromise(
    {
      name: PLUGIN_NAME,
      stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
    },
    async () => cssInline(compiler, compilation, options)
  );
};

const onRunStarted = (compiler, options) => (compilation) => {
  compilation.hooks.run.tapPromise(
    {
      name: PLUGIN_NAME,
      stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
    },
    async () => cssInline(compiler, compilation, options)
  );
};

class CssInlineWebpackPlugin {
  options;
  constructor(options = {}) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(
      PLUGIN_NAME,
      onInitCompilation(compiler, this.options)
    );
    compiler.hooks.run.tap(PLUGIN_NAME, onRunStarted(compiler, this.options));
  }
}

module.exports.default = CssInlineWebpackPlugin;
