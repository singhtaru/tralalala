const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Make Metro treat .mp4 as a binary asset (the default) and ensure the
// intro video is always picked up regardless of filename casing.
module.exports = config;
