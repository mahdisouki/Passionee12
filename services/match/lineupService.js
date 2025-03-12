

const lineupModel = require('../../models/match/lineupModels');

exports.getAllLineups = async () => {
  return await lineupModel.find().sort({ createdAt: -1 });
};

exports.createLineup = async (Lineup) => {
  return await lineupModel.create(Lineup);
};

exports.getLineupById = async (id) => {
  return await lineupModel.findById(lineupId)
    .populate('match_id') // Populate match details
    .populate('lineups.team._id') // Populate team details
    .populate('lineups.startXI._id') // Populate player details in starting XI
    .populate('lineups.substitutes._id');
};

exports.getLineupByMatchId = async (id) => {
  return await lineupModel.findOne({ match_id: id });
};


exports.updateLineup = async (id, Lineup) => {
  return await lineupModel.findByIdAndUpdate(id, Lineup);
};

exports.deleteLineup = async (id) => {
  return await lineupModel.findByIdAndDelete(id);
};