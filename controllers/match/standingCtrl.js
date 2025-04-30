const standingModel = require("../../models/match/standingModels");

const standingCtrl = {
  // Get all standings
  getAllStandings: async (req, res) => {
    try {
      const standings = await standingModel.aggregate([
        {
          $addFields: {
            rankAsNumber: { $toInt: "$rank" }
          }
        },
        {
          $sort: { rankAsNumber: 1 }
        }
      ]);
      res.json({ data: standings, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get standings by group ID
  getAllStandingByIdGroup: async (req, res) => {
    const group = req.params.group;
    try {
      const standings = await standingModel.find({ "group": group }).sort({ rank: 1 });
      res.json({ data: standings, status: `success for group ${group}` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Create a new standing
  createStanding: async (req, res) => {
    try {
      const standing = await standingModel.create(req.body);
      res.json({ data: standing, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message, status: "error" });
    }
  },

  // Get a standing by ID
  getStandingById: async (req, res) => {
    try {
      const standing = await standingModel.findById(req.params.id);
      if (!standing) {
        return res.status(404).json({ error: "Standing not found" });
      }
      res.json({ data: standing, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Update a standing
  updateStanding: async (req, res) => {
    try {
      const updatedStanding = await standingModel.findOneAndUpdate(
        { 'team.id': req.params.id },
        { $set: req.body },
        { new: true }
      );
      if (!updatedStanding) {
        return res.status(404).json({ error: "Standing not found" });
      }
      res.json({ data: updatedStanding, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Delete a standing
  deleteStanding: async (req, res) => {
    try {
      const standing = await standingModel.findByIdAndDelete(req.params.id);
      if (!standing) {
        return res.status(404).json({ error: "Standing not found" });
      }
      res.json({ data: standing, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = standingCtrl;
