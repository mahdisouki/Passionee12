
const playerModel = require("../../models/match/playerModels");
const { deleteObject } = require("../../shared/s3");

exports.getAllPlayers = async () => {
  return await playerModel.find();
};

exports.getAllPlayerByIdTeam = async (id) => {
  return await playerModel.find({ "team.id": id });
};

exports.getAllPlayerByPosition = async (position) => {
  return await playerModel.find({ "position": position }).sort({ value_passionne: -1 })
};

exports.getAllPlayerByName = async (name) => {
  return await playerModel.find({ "name": new RegExp(name, 'i') });
};

exports.createPlayer = async (Player) => {
  return await playerModel.create(Player);
};

exports.getPlayerById = async (id) => {
  return await playerModel.findById(id);
};

exports.updatePlayer = async (id, Player) => {
  return await playerModel.findByIdAndUpdate(id, Player);
};

exports.deletePlayer = async (id) => {
  const player = await playerModel.findById(id);
  deleteObject(player.logo);
  return await playerModel.findByIdAndDelete(id);
};