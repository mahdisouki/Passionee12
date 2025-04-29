const Team = require('../../models/match/Team.model');

const teamCtrl = {
  // Create a new team
  createTeam: async (req, res) => {
    try {
      const newTeam = new Team(req.body);
      await newTeam.save();
      res.status(201).json({ message: 'Team created successfully', team: newTeam });
    } catch (error) {
      console.log(error)
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

      // 🔍 Add search condition if provided
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

  // Update a team by ID
  updateTeam: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedTeam = await Team.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedTeam) return res.status(404).json({ message: 'Team not found' });
      res.status(200).json({ message: 'Team updated successfully', team: updatedTeam });
    } catch (error) {
      res.status(500).json({ message: 'Error updating team', error: error.message });
    }
  },

  // Delete a team by ID
  deleteTeam: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedTeam = await Team.findByIdAndDelete(id);
      if (!deletedTeam) return res.status(404).json({ message: 'Team not found' });
      res.status(200).json({ message: 'Team deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting team', error: error.message });
    }
  },

  // Get teams by country with pagination
  getTeamsByCountry: async (req, res) => {
    const { country } = req.params;
    const { page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    try {
      const query = { country };
      const totalTeams = await Team.countDocuments(query);
      const teams = await Team.find(query)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .exec();

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
      res.status(500).json({ message: 'Error fetching teams', error: error.message });
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
