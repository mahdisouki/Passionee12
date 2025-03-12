const standingModel = require("../../models/match/standingModels");

exports.getAllStandings = async () => {
  return await standingModel.aggregate([
    {
      $addFields: {
        rankAsNumber: { $toInt: "$rank" }
      }
    },
    {
      $sort: { rankAsNumber: 1 }
    }
  ]);
};

exports.getAllStandingByIdGroup = async (group) => {
  return await standingModel.find({ "group": group }).sort({ rank: 1 });
};

exports.createStanding = async (Standing) => {
  return await standingModel.create(Standing);
};

exports.getStandingById = async (id) => {
  return await standingModel.findById(id);
};

exports.updateStanding = async (id, newStandingData) => {
  const query = { 'team.id': id };
  const data = { $set: newStandingData };
  return await standingModel.findOneAndUpdate(query, data);
};

exports.deleteStanding = async (id) => {
  return await standingModel.findByIdAndDelete(id);
};