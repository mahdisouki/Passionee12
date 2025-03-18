const Player = require("../../models/match/Player.model");
const fs = require("fs");

const playerCtrl = {
    // Get all players
    getAllPlayers: async (req, res) => {
        try {
            const players = await Player.find();
            res.json({ data: players, status: "success" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get all players by Team ID
    getAllPlayersByTeamId: async (req, res) => {
        try {
            const teamId = req.params.id;
            const players = await Player.find({ team: teamId });
            res.json({ data: players, status: "success", teamId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get all players by Position
    getAllPlayersByPosition: async (req, res) => {
        try {
            const position = req.params.position;
            const players = await Player.find({ position });
            res.json({ data: players, status: "success", position });
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
            res.json({ data: players, status: "success", name });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get a player by ID
    getPlayerById: async (req, res) => {
        try {
            const player = await Player.findById(req.params.id);
            if (!player) {
                return res.status(404).json({ error: "Player not found" });
            }
            res.json({ data: player, status: "success", playerId: req.params.id });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Create a new player
    createPlayer: async (req, res) => {
        try {
            const newPlayer = new Player(req.body);
            await newPlayer.save();
            res.status(201).json({ data: newPlayer, status: "success" });
        } catch (err) {
            res.status(500).json({ error: err.message, status: "error" });
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

            // Delete player logo if exists
            if (player.logo) {
                const logoFilePath = `${player.logo}`;
                fs.unlink(logoFilePath, (err) => {
                    if (err) {
                        console.error("Error deleting player photo file:", err);
                    }
                });
            }
            res.json({ data: player, status: "success" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};

module.exports = playerCtrl;
