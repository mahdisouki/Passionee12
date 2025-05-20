const Team = require('../../models/match/Team.model');
const { deleteObject } = require('../../config/aws.config');

const teamCtrl = {
  // Create a new team
  createTeam: async (req, res) => {
    try {
      const newTeam = new Team(req.body);
      await newTeam.save();
      res.status(201).json({ message: 'Team created successfully', team: newTeam });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error creating team', error: error });
    }
  },

  // Get all teams with pagination and search
  getAllTeams: async (req, res) => {
    try {
      const { page = '1', limit = '100', search = '' } = req.query;
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);

      let query = Team.find();

      // Add search condition if provided
      if (search) {
        query = query.find({
          name: { $regex: search, $options: 'i' } // Case-insensitive search
        });
      }

      // Count total teams
      const totalTeams = await Team.countDocuments(query);

      // Apply pagination
      const teams = await query.skip((pageNum - 1) * limitNum).limit(limitNum).exec();

      res.status(200).json({
        message: 'Teams fetched successfully',
        teams,
        meta: {
          currentPage: pageNum,
          limit: limitNum,
          total: totalTeams,
          totalPages: Math.ceil(totalTeams / limitNum),
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get teams', error: error.message });
    }
  },

  // Get a single team by ID
  getTeamById: async (req, res) => {
    const { id } = req.params;
    try {
      const team = await Team.findById(id);
      if (!team) return res.status(404).json({ message: 'Team not found' });
      res.status(200).json(team);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching team', error: error.message });
    }
  },

  // Update a team
  updateTeam: async (req, res) => {
    try {
      const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      res.json({ data: team, status: "success" });
    } catch (error) {
      res.status(500).json({ message: 'Error updating team', error: error.message });
    }
  },

  // Delete a team
  deleteTeam: async (req, res) => {
    try {
      const team = await Team.findByIdAndDelete(req.params.id);
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }

      // Delete team logo from S3 if exists
      if (team.logo) {
        try {
          await deleteObject(team.logo);
        } catch (err) {
          console.error("Error deleting team logo from S3:", err);
        }
      }

      res.json({ data: team, status: "success" });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting team', error: error.message });
    }
  },

  // Get teams by country
  getTeamsByCountry: async (req, res) => {
    try {
      const teams = await Team.find({ country: req.params.country });
      res.json({ data: teams, status: "success" });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching teams by country', error: error.message });
    }
  },

  // Convert team names to references in a related collection
  convertTeamNamesToReferences: async (req, res) => {
    try {
      const teams = await Team.find({});
      const teamMap = teams.reduce((acc, team) => {
        acc[team.name] = team._id;
        return acc;
      }, {});

      console.log('Team references updated successfully');
      res.status(200).json({ message: 'Teams converted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating team references', error: error.message });
    }
  },
};

module.exports = teamCtrl;
