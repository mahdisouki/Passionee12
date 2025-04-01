const playerDetailModel = require("../../models/match/playerDetailModels");
const BlogModel = require("../../models/utils/blogPlayerModel");

const playerDetailCtrl = {
  getAllPlayerDetails: async (req, res) => {
    try {
      const playerDetail = await playerDetailModel.find().sort({ createdAt: -1 });
      res.json({ data: playerDetail, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createPlayerDetail: async (req, res) => {
    try {
      const playerDetail = await playerDetailModel.create(req.body);
      res.json({ data: playerDetail, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message, status: "error" });
    }
  },

  getPlayerDetailById: async (req, res) => {
    try {
      const playerDetail = await playerDetailModel.findOne({ id_player: req.params.id_player });
      const playerBlogs = await BlogModel.find({ players: req.params.id_player });

      if (!playerDetail) {
        return res.status(404).json({ error: "player not found" });
      }

      res.json({ data: { playerDetail, blogs: playerBlogs }, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updatePlayerDetail: async (req, res) => {
    try {
      const playerDetail = await playerDetailModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json({ data: playerDetail, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deletePlayerDetail: async (req, res) => {
    try {
      const playerDetail = await playerDetailModel.findByIdAndDelete(req.params.id);
      res.json({ data: playerDetail, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = playerDetailCtrl;
