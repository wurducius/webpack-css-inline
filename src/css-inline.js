const path = require("path");
const fs = require("fs");
const { addAsset, mapCombinator } = require("./util");

const CWD = process.cwd();
const tagHeadEnd = "</head>";

const readStyle = (styleName) =>
  fs.promises
    .readFile(path.resolve(CWD, styleName), "utf-8")
    .then((buffer) => buffer.toString());

const cssInline = (compiler, compilation, views) => {
  try {
    Object.keys(views).forEach((page) => {
      const styles = views[page];
      const pageAssetName = page + ".html";
      const pageAsset = compilation.assets[pageAssetName];
      const pageSourceSplit = pageAsset.source().split(tagHeadEnd);
      const pageHeadOld = pageSourceSplit[0];

      return Promise.all(mapCombinator(styles, readStyle)).then((contents) => {
        const pageSourceInjected =
          pageHeadOld +
          `<style>${contents.join(" ")}</style>` +
          tagHeadEnd +
          pageSourceSplit[1];
        addAsset(
          compilation,
          pageAssetName,
          pageSourceInjected,
          pageAsset.info,
          true
        );
      });
    });
  } catch (ex) {
    console.error("Error during CSS inline: ", ex);
    throw ex;
  }
};

module.exports = cssInline;
