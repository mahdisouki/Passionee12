const teamModel = require("../../models/match/teamModels");
const { deleteObject } = require("../../shared/s3");

exports.getAllTeams = async (data) => {
  return await teamModel.find(data);
};

exports.getAllTeams = async () => {
  return await teamModel.find().sort({ createdAt: -1 });
};

exports.getTeamByName = async (team) => {
  return await teamModel.find({ "name": team });
};

exports.createTeam = async (Team) => {
  return await teamModel.create(Team);
};

exports.getTeamById = async (id) => {
  return await teamModel.findById(id);
};

exports.getTeamByName = async (team) => {
  return await teamModel.find({ "name": team });
};

exports.updateTeam = async (id, Team) => {
  return await teamModel.findByIdAndUpdate(id, Team);
};

exports.deleteTeam = async (id) => {
  const team = await teamModel.findById(id);
  deleteObject(team.logo);
  return await teamModel.findByIdAndDelete(id);
};