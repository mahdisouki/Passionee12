const fixtureModel = require("../../models/match/Fixture.model");
const fixtureService = require("../../services/match/fixtureService");
const crypto = require('crypto');

const generateRandomKey = (length) => crypto.randomBytes(length).toString('hex');

const fixtureCtrl = {
  // GET All Fixtures
  getAllFixtures: async (req, res) => {
    try {
      const fixtures = await fixtureModel.find().sort({ _id: 1 });
      res.json({ data: fixtures, status: "success" });
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
      const fixtures = await fixtureModel.find({ round }).sort({ round: 1 });
      res.json({ data: fixtures, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getLastCurrentRound: async (req, res) => {
    try {
      const fixture = await fixtureModel
        .findOne({ statusshort: { $nin: ['NS', 'TBD', 'PST', 'FT'] } })
        .sort({ date: -1 });
      res.json({ data: fixture.round, date: fixture.date, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getNextRound: async (req, res) => {
    try {
      const current = await fixtureModel
        .findOne({ statusshort: { $nin: ['NS', 'TBD', 'PST', 'FT'] } })
        .sort({ date: -1 });

      if (!current) return res.status(404).json({ message: "No current round found" });

      const next = await fixtureModel
        .findOne({ round: { $gt: current.round } })
        .sort({ date: 1 });

      res.json({ data: next?.round, date: next?.date, status: "success" });
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
      const fixture = await fixtureModel.findById(req.params.id);
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
      const teamId = req.params.teamId;
      const fixtures = await fixtureModel.find({ statusshort: 'NS' }).sort({ date: 1 });

      const match = fixtures.find(match =>
        match.teamshome.id?.toString() === teamId ||
        match.teamsaway.id?.toString() === teamId
      );

      res.json({ data: match, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = fixtureCtrl;
