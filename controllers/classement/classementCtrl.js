const classementModel = require("../../models/points/classementModels");
const teamModel = require("../../models/match/Team.model"); 

const classementCtrl = {
  // Get all classements
  getAllClassements: async (req, res) => {
    try {
      const classements = await classementModel.find().sort({ rank: 1 });
      res.json({ data: classements, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get all classements by group
  getAllClassementByIdGroup: async (req, res) => {
    try {
      const group = req.params.group;
      const classements = await classementModel.find({ "group": group }).sort({ rank: 1 });
      res.json({ data: classements, status: `success for group ${group}` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Create a new classement
  createClassement: async (req, res) => {
    const { rank, team, points, goalsDiff, group, played, win, draw, loose } = req.body;
    try {
      // Fetch the team directly using teamModel
      const teamInstance = await teamModel.findOne({ name: team });

      if (!teamInstance) {
        return res.status(404).json({ error: "Team not found" });
      }

      const allStats = { played, win, draw, loose };

      const newClassement = new classementModel({
        rank,
        team: {
          id: teamInstance._id,
          name: team,
        },
        points,
        goalsDiff,
        group,
        all: allStats,
        home: allStats,
        away: allStats
      });

      // Save the new classement
      const savedClassement = await newClassement.save();
      res.json({ data: savedClassement, status: "success" });
    } catch (error) {
      console.error('Error creating classement:', error);
      res.status(500).json({ error: 'Error creating classement', status: "error" });
    }
  },

  // Get a classement by ID
  getClassementById: async (req, res) => {
    try {
      const classement = await classementModel.findById(req.params.id);
      if (!classement) {
        return res.status(404).json({ error: "Classement not found" });
      }
      res.json({ data: classement, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Update a classement
  updateClassement: async (req, res) => {
    try {
      const { rank, points, goalsDiff, played, win, draw, loose } = req.body;

      // Find the classement by ID
      const classement = await classementModel.findOne({ '_id': req.params.id });

      if (!classement) {
        return res.status(404).json({ error: "Classement not found" });
      }

      // Update the fields
      classement.rank = rank;
      classement.points = points;
      classement.goalsDiff = goalsDiff;
      classement.all.played = played;
      classement.all.win = win;
      classement.all.draw = draw;
      classement.all.loose = loose;

      // Save the updated classement
      const updatedClassement = await classement.save();

      res.json({ data: updatedClassement, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Delete a classement
  deleteClassement: async (req, res) => {
    try {
      const classement = await classementModel.findByIdAndDelete(req.params.id);
      if (!classement) {
        return res.status(404).json({ error: "Classement not found" });
      }
      res.json({ data: classement, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Initialize standings for all teams in groups A and B
  initializeStanding: async (req, res) => {
    try {
      const teamsA = await teamModel.find({ group: "A" });
      const teamsB = await teamModel.find({ group: "B" });

      // Initialize standings for each group
      for (let x = 0; x < teamsA.length; x++) {
        const team = teamsA[x];
        const newClassement = new classementModel({
          rank: x + 1, // Rank starts from 1
          team: { id: team._id, name: team.name },
          points: 0,
          goalsDiff: 0,
          group: team.group,
          all: { played: 0, win: 0, draw: 0, loose: 0 },
          home: { played: 0, win: 0, draw: 0, loose: 0 },
          away: { played: 0, win: 0, draw: 0, loose: 0 }
        });
        await newClassement.save();
      }

      for (let x = 0; x < teamsB.length; x++) {
        const team = teamsB[x];
        const newClassement = new classementModel({
          rank: x + 1, // Rank starts from 1
          team: { id: team._id, name: team.name },
          points: 0,
          goalsDiff: 0,
          group: team.group,
          all: { played: 0, win: 0, draw: 0, loose: 0 },
          home: { played: 0, win: 0, draw: 0, loose: 0 },
          away: { played: 0, win: 0, draw: 0, loose: 0 }
        });
        await newClassement.save();
      }

      res.json({ message: "Standings initialized successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = classementCtrl;
