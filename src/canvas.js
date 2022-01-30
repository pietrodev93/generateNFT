const { loadImage } = require("canvas");

// aggiungi firma su top image
const signImage = (ctx, sig) => {
  ctx.fillStyle = "#000000";
  ctx.font = "bold 30pt Helvetica";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(sig, 40, 40);
};

// Genera colore random
const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, 85%)`;
  return pastel;
};

const drawBackground = (ctx, width, height) => {
  ctx.fillStyle = genColor();
  ctx.fillRect(0, 0, width, height);
};

// Carichiamo image dal path e lo restituiamo in formato canvas
const loadLayerImg = async (layer) => {
  return new Promise(async (resolve) => {
    const image = await loadImage(`${layer.selectedElement.path}`);
    resolve({ layer: layer, loadedImage: image });
  });
};

const drawElement = (ctx, element) => {
  ctx.drawImage(
    element.loadedImage,
    element.layer.position.x,
    element.layer.position.y,
    element.layer.size.width,
    element.layer.size.height
  );
};

module.exports = {
    signImage,
    genColor,
    drawBackground,
    loadLayerImg,
    drawElement
}
