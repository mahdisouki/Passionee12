

const playerDetailModel = require("../../models/match/playerDetailModels");
const BlogModel = require("../../models/utils/blogPlayerModel");

exports.getAllPlayerDetails = async () => {
  return await playerDetailModel.find().sort({ createdAt: -1 });
};

exports.createPlayerDetail = async (PlayerDetail) => {
  return await playerDetailModel.create(PlayerDetail);
};

exports.getPlayerDetailById = async (id) => {
  try {
    const playerDetail = await playerDetailModel.findOne({ id_player: id });
    const playerBlogs = await BlogModel.find({ players: id });
    return { playerDetail, playerBlogs };
  } catch (error) {
    throw new Error("error fetching player details or blogs" + error.message);
  }
};

exports.updatePlayerDetail = async (id, PlayerDetail) => {
  return await playerDetailModel.findByIdAndUpdate(id, PlayerDetail);
};

exports.deletePlayerDetail = async (id) => {
  return await playerDetailModel.findByIdAndDelete(id);
};
