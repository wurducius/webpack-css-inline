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

module.exports = { addAsset, mapCombinator };
