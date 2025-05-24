const Player = require("../../models/match/Player.model");
const cloudinary = require('../../helper/cloudinaryConfig');
const Pickteam = require('../../models/match/Pickteams.model')
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
            console.error('Error getting players:', err);
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
            console.error('Error getting player:', err);
            res.status(500).json({ error: err.message });
        }
    },

    // Create a new player
    createPlayer: async (req, res) => {
        try {
            const playerData = { ...req.body };
            
            // If a file was uploaded, use the Cloudinary URL
            if (req.file) {
                playerData.logo = req.file.url;
            }

            const player = await Player.create(playerData);
            res.status(201).json({ data: player, status: "success" });
        } catch (err) {
            console.error('Error creating player:', err);
            res.status(500).json({ error: err.message });
        }
    },

    // Update a player
    updatePlayer: async (req, res) => {
        try {
            const playerData = { ...req.body };
            
            // If a new file was uploaded
            if (req.file) {
                // Delete old image from Cloudinary if exists
                const oldPlayer = await Player.findById(req.params.id);
                if (oldPlayer && oldPlayer.logo) {
                    try {
                        const publicId = oldPlayer.logo.split('/').pop().split('.')[0];
                        await cloudinary.uploader.destroy(publicId);
                    } catch (err) {
                        console.error('Error deleting old player photo from Cloudinary:', err);
                    }
                }
                
                // Set new image URL
                playerData.logo = req.file.url;
            }

            const updatedPlayer = await Player.findByIdAndUpdate(
                req.params.id, 
                playerData, 
                { new: true }
            ).populate('team');

            if (!updatedPlayer) {
                return res.status(404).json({ error: "Player not found" });
            }
            res.json({ data: updatedPlayer, status: "success" });
        } catch (err) {
            console.error('Error updating player:', err);
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

            // Delete player logo from Cloudinary if exists
            if (player.logo) {
                try {
                    const publicId = player.logo.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.error("Error deleting player photo from Cloudinary:", err);
                }
            }
            res.json({ data: player, status: "success" });
        } catch (err) {
            console.error('Error deleting player:', err);
            res.status(500).json({ error: err.message });
        }
    },
};

module.exports = playerCtrl;
