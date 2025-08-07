const {
  addAsset,
  mapCombinator,
  readResource,
  replaceSep,
  injectHead,
  tag,
} = require("./util");

const cssInline = (_compiler, compilation, options) => {
  const views = options.views;
  const shared = options.shared ?? [];

  try {
    return Promise.all(mapCombinator(shared, readResource)).then(
      (sharedContent) =>
        Object.keys(views).forEach((pageName) => {
          const assetName = replaceSep(pageName);
          const asset = compilation.assets[assetName];
          return Promise.all(mapCombinator(views[pageName], readResource)).then(
            (contents) =>
              addAsset(
                compilation,
                assetName,
                injectHead(
                  asset.source(),
                  tag(
                    "style",
                    [...contents, ...sharedContent].filter(Boolean).join(" ")
                  )
                ),
                asset.info,
                true
              )
          );
        })
    );
  } catch (ex) {
    console.error("Error during CSS inline: ", ex);
    throw ex;
  }
};

module.exports = cssInline;
