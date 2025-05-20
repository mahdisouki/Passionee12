const Team = require('../../models/match/Team.model');
const cloudinary = require('../../helper/cloudinaryConfig');

const teamCtrl = {
  // Create a new team
  createTeam: async (req, res) => {
    try {
      const teamData = { ...req.body };
      
      // If a file was uploaded, use the Cloudinary URL
      if (req.file) {
        teamData.logo = req.file.url;
      }

      const team = await Team.create(teamData);
      res.status(201).json({ data: team, status: "success" });
    } catch (err) {
      console.error('Error creating team:', err);
      res.status(500).json({ error: err.message });
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
    try {
      const team = await Team.findById(req.params.id);
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
      res.json({ data: team, status: "success" });
    } catch (err) {
      console.error('Error getting team:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // Update a team
  updateTeam: async (req, res) => {
    try {
      const teamData = { ...req.body };
      
      // If a new file was uploaded
      if (req.file) {
        // Delete old image from Cloudinary if exists
        const oldTeam = await Team.findById(req.params.id);
        if (oldTeam && oldTeam.logo) {
          try {
            const publicId = oldTeam.logo.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error('Error deleting old team logo from Cloudinary:', err);
          }
        }
        
        // Set new image URL
        teamData.logo = req.file.url;
      }

      const updatedTeam = await Team.findByIdAndUpdate(
        req.params.id, 
        teamData, 
        { new: true }
      );

      if (!updatedTeam) {
        return res.status(404).json({ error: "Team not found" });
      }
      res.json({ data: updatedTeam, status: "success" });
    } catch (err) {
      console.error('Error updating team:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // Delete a team
  deleteTeam: async (req, res) => {
    try {
      const team = await Team.findByIdAndDelete(req.params.id);
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }

      // Delete team logo from Cloudinary if exists
      if (team.logo) {
        try {
          const publicId = team.logo.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Error deleting team logo from Cloudinary:", err);
        }
      }
      res.json({ data: team, status: "success" });
    } catch (err) {
      console.error('Error deleting team:', err);
      res.status(500).json({ error: err.message });
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
