const playerService = require("../services/match/playerService");
const fs = require("fs");

const playerCtrl = {

    getAllPlayers: async (req, res) => {
        try {
            const players = await playerService.getAllPlayers();
            res.json({ data: players, status: "success" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getAllPlayerByIdTeam: async (req, res) => {
        try {
            const teamId = req.params.id;
            const players = await playerService.getAllPlayerByIdTeam(teamId);
            res.json({ data: players, status: "success" + teamId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getAllPlayerByPosition: async (req, res) => {
        try {
            const position = req.params.position;
            const players = await playerService.getAllPlayerByPosition(position);
            res.json({ data: players, status: "success" + position });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getAllPlayerByName: async (req, res) => {
        try {
            const name = req.params.name;
            const players = await playerService.getAllPlayerByName(name);
            if (players.length === 0) {
                return res.status(404).json({ error: `No players found with the name: ${name}` });
            }
            res.json({ data: players, status: "success" + name });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    createPlayer: async (req, res) => {
        try {
            const player = await playerService.createPlayer(req.body);
            res.json({ data: player, status: "success" });
        } catch (err) {
            res.status(500).json({ error: err.message, status: "error" });
        }
    },

    getPlayerById: async (req, res) => {
        try {
            const player = await playerService.getPlayerById(req.params.id);
            res.json({ data: player, status: "success " + req.params.id });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    updatePlayer: async (req, res) => {
        try {
            const player = await playerService.updatePlayer(req.params.id, req.body);
            res.json({ data: player, status: "success" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    deletePlayer: async (req, res) => {
        try {
            const player = await playerService.deletePlayer(req.params.id);
            if (player && player.logo) {
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
