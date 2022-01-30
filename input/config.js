const fs = require("fs");
const dir = __dirname;

const addRarity = (_id, _from, _to) => {
  const _rarityWeight = {
    value: _id,
    from: _from,
    to: _to,
    layerPercent: {},
  };
  return _rarityWeight;
};

// Ottieni il nome senza gli ultimi 4 caratteri -> slice .png dal nome
const cleanName = (_str) => {
  let name = _str.slice(0, -4);
  return name;
};

// Leggi il filenames dalla cartella e ritorna nome con path
const getElements = (_path, _elementCount) => {
  return fs
    .readdirSync(_path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i) => {
      return {
        id: _elementCount,
        name: cleanName(i),
        path: `${_path}/${i}`,
      };
    });
};

// Aggiungiamo Layer
const addLayer = (_id, _position, _size) => {
  if (!_id) {
    console.log("error adding layer, parameters id required");
    return null;
  }
  if (!_position) {
    _position = { x: 0, y: 0 };
  }
  if (!_size) {
    _size = { width: width, height: height };
  }
  // add two different dimension for elements:
  // - all elements with their path information
  // - only the ids mapped to their rarity
  let elements = [];
  let elementCount = 0;
  let elementIdsForRarity = {};
  rarityWeights.forEach((rarityWeight) => {
    let elementsForRarity = getElements(`${dir}/${_id}/${rarityWeight.value}`);

    elementIdsForRarity[rarityWeight.value] = [];
    elementsForRarity.forEach((_elementForRarity) => {
      _elementForRarity.id = `${editionDnaPrefix}${elementCount}`;
      elements.push(_elementForRarity);
      elementIdsForRarity[rarityWeight.value].push(_elementForRarity.id);
      elementCount++;
    });
    elements[rarityWeight.value] = elementsForRarity;
  });

  let elementsForLayer = {
    id: _id,
    position: _position,
    size: _size,
    elements,
    elementIdsForRarity,
  };
  return elementsForLayer;
};

// Aggiungi layer specifici in base alla rarità
const addRarityPercentForLayer = (_rarityId, _layerId, _percentages) => {
  let _rarityFound = false;
  rarityWeights.forEach((_rarityWeight) => {
    if (_rarityWeight.value === _rarityId) {
      let _percentArray = [];
      for (let percentType in _percentages) {
        _percentArray.push({
          id: percentType,
          percent: _percentages[percentType],
        });
      }
      _rarityWeight.layerPercent[_layerId] = _percentArray;
      _rarityFound = true;
    }
  });
  if (!_rarityFound) {
    console.log(
      `rarity ${_rarityId} not found, failed to add percentage information`
    );
  }
};

/**************************************************************
 * CONFIGURAZIONE
 *************************************************************/

// Dimensione in px
const width = 1000;
const height = 1000;

const description = "NFT creato dai piskelli";
// url IPFS
const baseImageUri = "https://zcopyf4bu10x.usemoralis.com:2053/server";

// Id dal quale partire
const startEditionFrom = 1;

// Numero di NFT da generare
const editionSize = 10;

// Numero da aggiungere al dna per distinguere le varie rarità
const editionDnaPrefix = 0;

// Aggiungere le rarità da generare

let rarityWeights = [
    // addRarity("super-rare", 1, 1)
    addRarity("original", 1, editionSize)
];

// Aggiungere i Layers
const layers = [
    addLayer("Background", { x: 0, y: 0 }, { width: width, height: height }),
    addLayer("Body"),
    addLayer("Eyes"),
    addLayer("Head"),
    addLayer("HeadWear"),
    addLayer("Mouth"),
    addLayer("Nose"),
    addLayer("Outfit"),
    addLayer("Sunglasses"),
];

// provide any specific percentages that are required for a given layer and rarity level
// all provided options are used based on their percentage values to decide which layer to select from
addRarityPercentForLayer("original", "Eyes", {
    super_rare: 1,
    rare: 1,
    original: 100,
});

module.exports = {
    layers,
    width,
    height,
    description,
    baseImageUri,
    editionSize,
    startEditionFrom,
    rarityWeights,
};