const path = require("path");
const fs = require("fs");

const CWD = process.cwd();
const tagHeadEnd = "</head>";

const getAsset = ({ asset, nextSource, nextSize, nextInfo }) => {
  const map = asset ? asset.map() : null;
  return {
    source: () => nextSource,
    map: () => map,
    sourceAndMap: () => ({
      source: nextSource,
      map,
    }),
    size: () => nextSize,
    info: nextInfo,
  };
};

const addAsset = (compilation, assetName, nextSource, info, merge) => {
  compilation.assets[assetName] = getAsset({
    ...(merge ? compilation.assets[assetName] : {}),
    nextSource,
    nextInfo: info ?? {},
    nextSize: nextSource.length,
  });
};

function mapCombinator(items, mapper) {
  if (Array.isArray(items)) {
    return items.map(mapper);
  } else if (items) {
    return [mapper(items)];
  } else {
    return undefined;
  }
}

const readResource = (styleName) => {
  const filename = path.resolve(CWD, styleName);
  const exists = fs.existsSync(filename);
  if (!exists) {
    throw new Error(`File not found: ${styleName}`);
  }
  return fs.promises
    .readFile(filename, "utf-8")
    .then((buffer) => buffer.toString());
};

const replaceSep = (pathname) => pathname.replaceAll("/", path.sep) + ".html";

const injectHead = (html, injected) => {
  const split = html.split(tagHeadEnd);
  return split[0] + injected + tagHeadEnd + split[1];
};

const tag = (tagName, content) => `<${tagName}>${content}</${tagName}>`;

module.exports = {
  addAsset,
  mapCombinator,
  readResource,
  replaceSep,
  injectHead,
  tag,
};
