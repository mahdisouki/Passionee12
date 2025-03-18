const fixtureService = require("../../services/match/fixtureService");
const crypto = require('crypto');

const  generateRandomKey =(length) => {
    return crypto.randomBytes(length).toString('hex');
  }
const fixtureCtrl = {
    getAllFixtures: async (req, res) => {
        try {
            const fixture = await fixtureService.getAllFixtures();
            res.json({ data: fixture, status: "success" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getAllFixtureByStatusShort: async (req, res) => {
        try {
            const status = req.params.status;
            const fixture = await fixtureService.getAllFixtureByStatusShort(status);
            res.json({ data: fixture, status: "success" + status });
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
            res.json({ data: fixture.round, date: fixture.date, status: "success last round" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getNextRound: async (req, res) => {
        try {
            const fixture = await fixtureService.getNextRound();
            res.json({ data: fixture.round, date: fixture.date, status: "success next round" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getAllFixtureByIdTeam: async (req, res) => {
        try {
            const teamId = req.params.id;
            const fixture = await fixtureService.getAllFixtureByIdTeam(teamId);
            res.json({ data: fixture, status: "success" + teamId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    createFixture: async (req, res) => {
        try {
            const fixture = await fixtureService.createFixture(req.body);
            res.json({ data: fixture, status: "success" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getFixtureById: async (req, res) => {
        try {
            const fixture = await fixtureService.getFixtureById(req.params.id);
            res.json({ data: fixture, status: "success" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    updateFixture: async (req, res) => {
        try {
            const fixture = await fixtureService.updateFixture(req.params.id, req.body);
            res.json({ data: fixture, status: "success" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    deleteFixture: async (req, res) => {
        try {
            const fixture = await fixtureService.deleteFixture(req.params.id);
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

    updateScore: async (req, res) => {
        try {
            const fixture = await fixtureService.updateScore(req.params.id, req.body.equipe);
            res.json({ data: fixture, status: "success" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    modifid: async (req, res) => {
        try {
            const fixtures = await fixtureService.getAllFixtures();
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
            res.json({ data: fixture, status: "success nearest match" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};

module.exports = fixtureCtrl;
