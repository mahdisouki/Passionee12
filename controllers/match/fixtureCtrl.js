const fixtureModel = require("../../models/match/Fixture.model");
const fixtureService = require("../../services/fixtureService");
const crypto = require('crypto');

const generateRandomKey = (length) => crypto.randomBytes(length).toString('hex');

const fixtureCtrl = {
  // GET All Fixtures
  getAllFixtures: async (req, res) => {
    try {
      const { status, round, teamId, dateFrom, dateTo } = req.query;
      let query = {};

      // Filter by status
      if (status) {
        switch (status) {
          case 'played':
            query.statusshort = { $in: ['FT', 'AET', 'PEN'] }; // Finished matches
            break;
          case 'upcoming':
            query.statusshort = { $in: ['NS', 'TBD'] }; // Not started matches
            break;
          case 'live':
            query.statusshort = { $in: ['1H', 'HT', '2H', 'ET', 'P', 'BT'] }; // Live matches
            break;
          case 'postponed':
            query.statusshort = { $in: ['PST', 'CANC'] }; // Postponed/Cancelled matches
            break;
          default:
            query.statusshort = status; // Direct status match
        }
      }

      // Filter by round
      if (round) {
        query.round = round;
      }

      // Filter by team
      if (teamId) {
        query.$or = [
          { 'teamshome': teamId },
          { 'teamsaway': teamId }
        ];
      }

      // Filter by date range
      if (dateFrom || dateTo) {
        query.date = {};
        if (dateFrom) {
          query.date.$gte = new Date(dateFrom);
        }
        if (dateTo) {
          query.date.$lte = new Date(dateTo);
        }
      }

      const fixtures = await fixtureModel.find(query).sort({ date: 1 }).populate('teamshome', 'name id').populate('teamsaway', 'name id');
      res.json({ 
        data: fixtures, 
        status: "success",
        filters: {
          status,
          round,
          teamId,
          dateFrom,
          dateTo
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getAllFixtureByStatusShort: async (req, res) => {
    try {
      const status = req.params.status;
      const fixtures = await fixtureModel.find({ statusshort: status }).sort({ round: 1 });
      res.json({ data: fixtures, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getAllFixtureByRoundName: async (req, res) => {
    try {
      const round = req.params.roundName;
      const fixture = await fixtureService.getAllFixtureByRoundName(round);
      res.json({ data: fixture, status: "success round" + round });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getLastCurrentRound: async (req, res) => {
    try {
      const fixture = await fixtureService.getLastCurrentRound();
      console.log(fixture)
      res.json({ data: fixture.round, date: fixture.date, status: "success last round" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getNextRound: async (req, res) => {
    try {
      const fixture = await fixtureService.getNextRound();
      res.json({ data: fixture.round, date: fixture.date, status: "success last round" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getAllFixtureByIdTeam: async (req, res) => {
    try {
      const teamId = req.params.id;
      const fixtures = await fixtureModel.find({
        $or: [
          { "teamshome.id": teamId },
          { "teamsaway.id": teamId }
        ]
      }).sort({ date: 1 });

      res.json({ data: fixtures, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getFixtureById: async (req, res) => {
    try {
      const fixture = await fixtureModel.findById(req.params.id).populate('teamshome', 'name id').populate('teamsaway', 'name id');
      res.json({ data: fixture, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createFixture: async (req, res) => {
    try {
      const fixture = await fixtureModel.create(req.body);
      res.json({ data: fixture, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateFixture: async (req, res) => {
    try {
      const fixture = await fixtureModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ data: fixture, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteFixture: async (req, res) => {
    try {
      const fixture = await fixtureModel.findByIdAndDelete(req.params.id);
      res.json({ data: fixture, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Uses Service (Custom logic: updateScore, cleansheet, redeemPoints, etc.)
  updateScore: async (req, res) => {
    try {
      const fixture = await fixtureService.updateScore(req.params.id, req.body.equipe);
      res.json({ data: fixture, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const fixture = await fixtureService.updateStatus(req.params.id, req.body.status);
      res.json({ data: fixture, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  modifid: async (req, res) => {
    try {
      const fixtures = await fixtureModel.find();
      for (const element of fixtures) {
        element.id = generateRandomKey(24);
        await element.save();
      }
      res.json({ data: fixtures, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getNearestMatchForTeam: async (req, res) => {
    try {
      const fixture = await fixtureService.getNearestMatchForTeam(req.params.teamId);
      res.json({ data: fixture, status: "success last round" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = fixtureCtrl;
