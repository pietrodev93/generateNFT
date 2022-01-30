//Dipendenze generali
const console = require("console");
const dotenv = require("dotenv");
dotenv.config(); // Inizializziamo dotenv

// Moralis
const Moralis = require("moralis/node");

// Canvas
const { createCanvas } = require("canvas");

// Import config
const {
  layers,
  width,
  height,
  editionSize,
  startEditionFrom,
  rarityWeights,
} = require("./input/config");

// metadata
const { compileMetadata } = require("./src/metadata");

// save files
const { createFile } = require("./src/filesystem");

// setup img
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// Dipendenze express
const express = require("express");
const app = express();
const port = 5000; // Local listening on this port

// Moralis cred
const serverUrl = process.env.SERVER_URL;
const appId = process.env.APP_ID;
const masterKey = process.env.MASTER_KEY;
const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

// Start Moralis
Moralis.start({ serverUrl, appId, masterKey });

// Start creation
const startCreating = async () => {
  console.log("##################");
  console.log("# Generative Art #");
  console.log("# - Generating your NFT collection");
  console.log("##################");

  // image data collection
  let imageDataArray = [];

  // create NFTs from startEditionFrom to editionSize
  let editionCount = startEditionFrom;

  while (editionCount <= editionSize) {
    console.log("-----------------");
    console.log("Creating %d of %d", editionCount, editionSize);

    const handleFinal = async () => {
      // create image files and return object array of created images
      [...imageDataArray] = await createFile(
        canvas,
        ctx,
        layers,
        width,
        height,
        editionCount,
        editionSize,
        rarityWeights,
        imageDataArray
      );
    };

    await handleFinal();
    // iterate
    editionCount++;
  }

  await compileMetadata(
    apiUrl,
    apiKey,
    editionCount,
    editionSize,
    imageDataArray
  );

  console.log();
  console.log("#########################################");
  console.log("Welcome to Rekt City - Meet the Survivors");
  console.log("#########################################");
  console.log();
};

app.get("/", (req, res) => {
  res.send('Server in ascolto')
});
app.get("/startCreate", (req, res) => {
    startCreating()
});

app.listen(port, () => {
  console.log(`Server in ascolto su porta ${port}`);
});
