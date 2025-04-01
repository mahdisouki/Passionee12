const pickteamModel = require("../../models/match/Pickteams.model");
const Player = require("../../models/match/Player.model");

const pickteamCtrl = {
  
  createPickteam: async (req, res) => {
    try {
      const newPickteam = new pickteamModel(req.body);
      await newPickteam.save();
      res.status(201).json({ message: 'Pickteam created successfully', pickteam: newPickteam });
    } catch (error) {
      res.status(500).json({ message: 'Error creating pickteam', error: error.message });
    }
  },

  
  getAllPickteams: async (req, res) => {
    try {
      const pickteams = await pickteamModel.find();
      res.status(200).json({ message: 'Pickteams fetched successfully', data: pickteams });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching pickteams', error: error.message });
    }
  },

  
  getPickteamByIdAndRound: async (req, res) => {
    const { userId, round } = req.params;
    try {
      const pickteam = await pickteamModel.findOne({ userId, round }).populate("players.player").populate("playerTransfert.player");
      res.status(200).json({ message: 'Pickteam fetched successfully', data: pickteam });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching pickteam', error: error.message });
    }
  },

  
  deletePickteamById: async (req, res) => {
    const { userId } = req.params;
    try {
      await pickteamModel.deleteMany({ userId });
      res.status(200).json({ message: 'Pickteam deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting pickteam', error: error.message });
    }
  },

  
  transferPlayer: async (req, res) => {
    const { userId } = req.params;
    const { playerToBeTransfert, newPlayerId } = req.body;
    try {
      const newPlayer = await Player.findById(newPlayerId);
      const pick = await pickteamModel.findOne({ userId });
      const oldPlayerData = pick.players.find(p => p.player.toString() === playerToBeTransfert);

      await pickteamModel.updateOne(
        { userId },
        {
          $push: {
            playerTransfert: [
              { player: playerToBeTransfert, transferType: "out" },
              { player: newPlayerId, transferType: "in" },
            ]
          },
          $pull: {
            players: { player: playerToBeTransfert }
          }
        }
      );

      await pickteamModel.updateOne(
        { userId },
        {
          $push: {
            players: {
              player: newPlayerId,
              transfert: true,
              position: newPlayer.position,
              rowIndex: oldPlayerData.rowIndex,
              isSubstituted: oldPlayerData.isSubstituted,
            }
          }
        }
      );

      res.status(200).json({ message: "Player transferred successfully" });
    } catch (error) {
      res.status(500).json({ message: 'Error transferring player', error: error.message });
    }
  },

  
  makeCaptain: async (req, res) => {
    const { userId } = req.params;
    const { playerId, round } = req.body;
    try {
      await pickteamModel.updateMany(
        { userId, round },
        { $set: { "players.$[].captain": false } }
      );

      const updated = await pickteamModel.findOneAndUpdate(
        { userId, round, "players.player": playerId },
        { $set: { "players.$.captain": true } },
        { new: true }
      );

      res.status(200).json({ message: 'Captain updated successfully', data: updated });
    } catch (error) {
      res.status(500).json({ message: 'Error updating captain', error: error.message });
    }
  },

  makeViceCaptain: async (req, res) => {
    const { userId } = req.params;
    const { playerId, round } = req.body;
    try {
      await pickteamModel.updateMany(
        { userId, round },
        { $set: { "players.$[].vicecaptain": false } }
      );

      const updated = await pickteamModel.findOneAndUpdate(
        { userId, round, "players.player": playerId },
        { $set: { "players.$.vicecaptain": true } },
        { new: true }
      );

      res.status(200).json({ message: 'Vice-captain updated successfully', data: updated });
    } catch (error) {
      res.status(500).json({ message: 'Error updating vice-captain', error: error.message });
    }
  },
};

module.exports = pickteamCtrl;
