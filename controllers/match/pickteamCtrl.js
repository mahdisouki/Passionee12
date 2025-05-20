const pickteamModel = require("../../models/match/Pickteams.model");
const Player = require("../../models/match/Player.model");
const mongoose = require('mongoose');

const pickteamCtrl = {
  
  createPickteam: async (req, res) => {
    try {
      const validationErrors = await validateTeamCreation(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({ 
          message: 'Team creation validation failed', 
          errors: validationErrors 
        });
      }

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
      if (!newPlayer) {
        return res.status(404).json({ message: 'New player not found' });
      }
  
      // Get pickteam and populate players
      const pick = await pickteamModel.findOne({ userId }).populate("players.player");
      if (!pick) {
        return res.status(404).json({ message: 'Pickteam not found for user' });
      }
  
      // Ensure old player is inside the team
      const oldPlayerData = pick.players.find(p =>
        p.player && p.player._id && p.player._id.equals(playerToBeTransfert)
      );
  
      if (!oldPlayerData) {
        return res.status(400).json({ message: 'Player to transfer out is not in the user\'s pickteam' });
      }
  
      // Check position match
      if (newPlayer.position !== oldPlayerData.player.position) {
        return res.status(400).json({ message: 'Position mismatch between incoming and outgoing player' });
      }
  
//  Step 1: Remove player manually
pick.players = pick.players.filter(p => p.player._id.toString() !== playerToBeTransfert);

//  Step 2: Add the new player
pick.players.push({
  player: newPlayerId,
  transfert: true,
  rowIndex: oldPlayerData.rowIndex,
  isSubstituted: oldPlayerData.isSubstituted,
  captain: false,
  vicecaptain: false
});

//  Step 3: Track transfer
pick.playerTransfert.push({ player: playerToBeTransfert, transferType: 'out' });
pick.playerTransfert.push({ player: newPlayerId, transferType: 'in' });
  //  Step 4: Save manually
      await pick.save();
      res.status(200).json({ message: "Player transferred successfully", data:pick });
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
  swapPlayersWithinPickteam: async (req, res) => {
    const { userId } = req.params;
    const { playerAId, playerBId, round } = req.body;
  
    try {
      const pickteam = await pickteamModel.findOne({ userId, round })
        .populate("players.player");
  
      if (!pickteam) {
        return res.status(404).json({ message: "Pickteam not found" });
      }
  
      const playerA = pickteam.players.find(p => p.player._id.toString() === playerAId);
      const playerB = pickteam.players.find(p => p.player._id.toString() === playerBId);
  
      if (!playerA || !playerB) {
        return res.status(400).json({ message: "One or both players not found in pickteam" });
      }
  
      // Check if positions match
      if (playerA.player.position !== playerB.player.position) {
        return res.status(400).json({ message: "Players must be in the same position to swap" });
      }
  
      // Swap rowIndex and isSubstituted
      const tempRowIndex = playerA.rowIndex;
      const tempIsSub = playerA.isSubstituted;
  
      playerA.rowIndex = playerB.rowIndex;
      playerA.isSubstituted = playerB.isSubstituted;
  
      playerB.rowIndex = tempRowIndex;
      playerB.isSubstituted = tempIsSub;
  
      await pickteam.save();
  
      res.status(200).json({ message: "Players swapped successfully", data: pickteam });
    } catch (error) {
      res.status(500).json({ message: 'Error swapping players', error: error.message });
    }
  }  
  
};

const validateTeamCreation = async (pickteam) => {
  const errors = [];
  
  // Check total VP budget
  const totalVP = pickteam.players.reduce((sum, p) => sum + p.player.value_passionne, 0);
  if (totalVP > 100) {
    errors.push('Total VP cannot exceed 100');
  }

  // Check position limits
  const positionCounts = {
    'Goalkeeper': 0,
    'Defender': 0,
    'Midfielder': 0,
    'Attacker': 0
  };

  // Count players by position
  pickteam.players.forEach(p => {
    positionCounts[p.player.position]++;
  });

  // Validate position limits
  if (positionCounts['Goalkeeper'] > 2) errors.push('Maximum 2 goalkeepers allowed');
  if (positionCounts['Defender'] > 5) errors.push('Maximum 5 defenders allowed');
  if (positionCounts['Midfielder'] > 5) errors.push('Maximum 5 midfielders allowed');
  if (positionCounts['Attacker'] > 3) errors.push('Maximum 3 attackers allowed');

  // Check club limits
  const clubCounts = {};
  pickteam.players.forEach(p => {
    const clubId = p.player.team._id.toString();
    clubCounts[clubId] = (clubCounts[clubId] || 0) + 1;
    if (clubCounts[clubId] > 3) {
      errors.push(`Maximum 3 players allowed from ${p.player.team.name}`);
    }
  });

  return errors;
};

module.exports = pickteamCtrl;
