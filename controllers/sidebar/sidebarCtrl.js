// controllers/game.controller.js
const About = require('../../models/utils/aboutModels');
const Condition = require('../../models/utils/conditionModels');
const GameRule = require('../../models/utils/gameRuleModels');

const sidebarCtrl = {
  // About section controller
  getAbout: async (req, res) => {
    try {
      const about = await About.findOne();
      if (!about) return res.status(404).json({ message: 'About section not found' });
      res.json(about);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateAbout: async (req, res) => {
    const { content } = req.body;
    try {
      const about = await About.findOne();
      if (!about) {
        // If there's no existing "about", create one
        const newAbout = new About({ content });
        await newAbout.save();
        return res.json({ message: 'About section created successfully', about: newAbout });
      }

      // If "about" exists, update the content
      about.content = content;
      await about.save();
      res.json({ message: 'About section updated successfully', about });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Condition section controller
  getCondition: async (req, res) => {
    try {
      const condition = await Condition.findOne();
      if (!condition) return res.status(404).json({ message: 'Condition section not found' });
      res.json(condition);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateCondition: async (req, res) => {
    const { content } = req.body;
    try {
      const condition = await Condition.findOne();
      if (!condition) {
        // If there's no existing "condition", create one
        const newCondition = new Condition({ content });
        await newCondition.save();
        return res.json({ message: 'Condition section created successfully', condition: newCondition });
      }

      // If "condition" exists, update the content
      condition.content = content;
      await condition.save();
      res.json({ message: 'Condition section updated successfully', condition });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // GameRule section controller
  getGameRule: async (req, res) => {
    try {
      const gameRule = await GameRule.findOne();
      if (!gameRule) return res.status(404).json({ message: 'Game rule section not found' });
      res.json(gameRule);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateGameRule: async (req, res) => {
    const { content } = req.body;
    try {
      const gameRule = await GameRule.findOne();
      if (!gameRule) {
        // If there's no existing "gameRule", create one
        const newGameRule = new GameRule({ content });
        await newGameRule.save();
        return res.json({ message: 'Game rule section created successfully', gameRule: newGameRule });
      }

      // If "gameRule" exists, update the content
      gameRule.content = content;
      await gameRule.save();
      res.json({ message: 'Game rule section updated successfully', gameRule });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = sidebarCtrl;
