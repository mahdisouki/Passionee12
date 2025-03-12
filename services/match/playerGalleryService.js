const playerGalleryModel = require("../../models/match/playerGalleryModel");
const { deleteObject } = require("../../shared/s3");

exports.getPlayerGalleryById = async (id) => {
    return await playerGalleryModel.findById(id);
};

exports.deletePlayerGallery = async (id) => {
    const player = await playerGalleryModel.findById(id);
    deleteObject(player.logo);
    return await playerGalleryModel.findByIdAndDelete(id);
};

exports.createPlayerGallery = async (playerGallery) => {
    return await playerGalleryModel.create(playerGallery);
};

exports.setPlayerGalleryReactionById = async (reactionData) => {
    return await playerGalleryModel.create(reactionData);
};

exports.getPlayerGalleryReactionById = async (id) => {
    return await playerGalleryModel.find({ player: id });
};