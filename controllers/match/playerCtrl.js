const Player = require("../../models/match/Player.model");
const fs = require("fs");
const { deleteObject } = require('../../config/aws.config');

const calculateSelectedBy = async (playerId) => {
    const totalPickteams = await Pickteam.countDocuments(); // Total number of teams in the competition
    const selectedPickteams = await Pickteam.countDocuments({ 'players.player': playerId }); // Teams that selected this player
    return totalPickteams > 0 ? ((selectedPickteams / totalPickteams) * 100).toFixed(1) : 0;
};
const playerCtrl = {
    // Get all players
    getAllPlayers: async (req, res) => {
        try {
            const players = await Player.find().populate('team');
            const playersWithSelectedBy = await Promise.all(players.map(async (player) => {
                const selectedBy = await calculateSelectedBy(player._id);
                return { ...player._doc, selectedBy: `${selectedBy}%` }; // Add selectedBy field to each player
            }));

            res.json({ data: playersWithSelectedBy, status: "success" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get all players by Team ID
    getAllPlayersByTeamId: async (req, res) => {
        try {
            const teamId = req.params.id;
            const players = await Player.find({ 'team._id': teamId });
            const playersWithSelectedBy = await Promise.all(players.map(async (player) => {
                const selectedBy = await calculateSelectedBy(player._id);
                return { ...player._doc, selectedBy: `${selectedBy}%` };
            }));

            res.json({ data: playersWithSelectedBy, status: "success", teamId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get all players by Position
    getAllPlayersByPosition: async (req, res) => {
        try {
            const position = req.params.position;
            const players = await Player.find({ position });
            const playersWithSelectedBy = await Promise.all(players.map(async (player) => {
                const selectedBy = await calculateSelectedBy(player._id);
                return { ...player._doc, selectedBy: `${selectedBy}%` };
            }));

            res.json({ data: playersWithSelectedBy, status: "success", position });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get all players by Name
    getAllPlayersByName: async (req, res) => {
        try {
            const name = req.params.name;
            const players = await Player.find({ name: { $regex: name, $options: 'i' } });
            if (players.length === 0) {
                return res.status(404).json({ error: `No players found with the name: ${name}` });
            }

            const playersWithSelectedBy = await Promise.all(players.map(async (player) => {
                const selectedBy = await calculateSelectedBy(player._id);
                return { ...player._doc, selectedBy: `${selectedBy}%` };
            }));

            res.json({ data: playersWithSelectedBy, status: "success", name });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get a player by ID
    getPlayerById: async (req, res) => {
        try {
            const player = await Player.findById(req.params.id).populate('team');
            if (!player) {
                return res.status(404).json({ error: "Player not found" });
            }

            // Calculate selectedBy percentage
            const selectedBy = await calculateSelectedBy(player._id);

            res.json({ data: { ...player._doc, selectedBy: `${selectedBy}%` }, status: "success", playerId: req.params.id });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Create a new player
    createPlayer: async (req, res) => {
        try {
            const player = new Player(req.body);
            await player.save();
            res.status(201).json({ data: player, status: "success" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Update a player
    updatePlayer: async (req, res) => {
        try {
            const updatedPlayer = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedPlayer) {
                return res.status(404).json({ error: "Player not found" });
            }
            res.json({ data: updatedPlayer, status: "success" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Delete a player
    deletePlayer: async (req, res) => {
        try {
            const player = await Player.findByIdAndDelete(req.params.id);
            if (!player) {
                return res.status(404).json({ error: "Player not found" });
            }

            // Delete player logo from S3 if exists
            if (player.logo) {
                try {
                    await deleteObject(player.logo);
                } catch (err) {
                    console.error("Error deleting player photo from S3:", err);
                }
            }
            res.json({ data: player, status: "success" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};

module.exports = playerCtrl;
