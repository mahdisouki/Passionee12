const MatchEvent = require("../../models/points/matchEventModel");
const PointsAttribution = require("../../models/points/pointsattributionModel");
const Pickteam = require("../../models/match/Pickteams.model");
const Player = require("../../models/match/Player.model");

// Point abbreviations for different actions
const pointAbbreviations = [
    // Points communs
    { typePoint: 'J90', actionPoint: 'Pour jouer 90 minutes', points: -1 },
    { typePoint: 'PM', actionPoint: 'Pour chaque penalty manqué', points: -10 },
    { typePoint: 'RM', actionPoint: 'Pour jouer remplacer', points: -1 },
    { typePoint: 'CC', actionPoint: 'But contre son camp', points: -11 },
    { typePoint: 'CR', actionPoint: 'Carton rouge directe', points: -25 },
    { typePoint: '2CJ', actionPoint: 'Carton rouge (2 jaunes)', points: -10 },

    // Points communs par nous meme a discuter
    { typePoint: '2BE', actionPoint: 'Pour 2 buts ou plus encaissés', points: -2 },
    { typePoint: '3BM', actionPoint: "Pour 3 buts ou plus marqués par l'équipe", points: 2 },
    { typePoint: 'CS', actionPoint: 'Clean sheet', points: 3 },

    // Gardien de but
    { typePoint: 'GPA', actionPoint: 'Pour chaque penalty arrêté (Gardien)', points: 10 },
    { typePoint: 'GPD', actionPoint: 'Pour chaque passe décisif (Gardien)', points: 30 },
    { typePoint: 'GBO', actionPoint: 'Pour chaque but marqué (Gardien)', points: 50 },

    // Défenseur
    { typePoint: 'DPD', actionPoint: 'Pour chaque passe décisif (Défenseur)', points: 5 },
    { typePoint: 'DBO', actionPoint: 'Pour chaque but marqué (Défenseur)', points: 12 },

    // Milieu de terrain
    { typePoint: 'MPD', actionPoint: 'Pour chaque passe décisif (Milieu)', points: 3 },
    { typePoint: 'MBO', actionPoint: 'Pour chaque but marqué (Milieu)', points: 8 },

    // Attaquant
    { typePoint: 'APD', actionPoint: 'Pour chaque passe décisif (Attaquant)', points: 2 },
    { typePoint: 'ABO', actionPoint: 'Pour chaque but marqué (Attaquant)', points: 6 }
];

// Helper function to update player points
const updatePlayerPoints = async (playerId, round, match, typePoint, points) => {
    // Update points in the PointsAttribution collection
    await PointsAttribution.findOneAndUpdate(
        {
            player: playerId,
            round: round,
            match: match
        },
        { $inc: { points: points } },
        { upsert: true, new: true }
    );

    // Update points in the Player collection's 'points' array
    await Player.findOneAndUpdate(
        { _id: playerId, 'points.round': round },
        {
            $inc: { 'points.$.total': points },
            $push: {
                'points.$.detail': {
                    typePoint: typePoint,
                    actionPoint: pointAbbreviations.find(p => p.typePoint === typePoint).actionPoint,
                    points: points
                }
            }
        },
        { new: true }
    );
};


// Helper function to update pickteam total points
const updatePickteamTotalPoints = async (round, match) => {
    const pickteams = await Pickteam.find({ round: round });

    for (const pickteam of pickteams) {
        let totalPoints = 0;

        for (const player of pickteam.players) {
            const points = await PointsAttribution.aggregate([
                {
                    $match: {
                        player: player.player,
                        round: round,
                        match: match
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalPoints: { $sum: '$points' }
                    }
                }
            ]);

            if (points.length > 0) {
                totalPoints += points[0].totalPoints;
            }
        }

        await Pickteam.findByIdAndUpdate(
            pickteam._id,
            { $set: { totalsPoint: totalPoints } },
            { new: true }
        );
    }
};

const matchEventCtrl = {
    // Create a goal event
    createGoalEvent: async (req, res) => {
      try {
        const { match, round, player, assist, time, goalType } = req.body;
  
        const playerDoc = await Player.findById(player);
        if (!playerDoc) return res.status(404).json({ message: "Player not found" });
  
        let typePoint;
        switch (playerDoc.position) {
          case 'Goalkeeper': typePoint = 'GBO'; break;
          case 'Defender': typePoint = 'DBO'; break;
          case 'Midfielder': typePoint = 'MBO'; break;
          case 'Attacker': typePoint = 'ABO'; break;
          default: return res.status(400).json({ message: "Invalid player position" });
        }
  
        // Create the match event
        const matchEvent = await MatchEvent.create({
          match,
          round,
          player,
          assist,
          time,
          eventType: 'goal',
          goalType: goalType || 'regular',
          typePoint: [{ typePoint, player }],
        });
  
        // Update player points
        const pointInfo = pointAbbreviations.find(p => p.typePoint === typePoint);
        if (pointInfo) {
          await updatePlayerPoints(player, round, match, typePoint, pointInfo.points);
        }
  
        // If there's an assist, update assist points
        if (assist) {
          const assistPlayer = await Player.findById(assist);
          if (assistPlayer) {
            let assistTypePoint;
            switch (assistPlayer.position) {
              case 'Goalkeeper': assistTypePoint = 'GPD'; break;
              case 'Defender': assistTypePoint = 'DPD'; break;
              case 'Midfielder': assistTypePoint = 'MPD'; break;
              case 'Attacker': assistTypePoint = 'APD'; break;
            }
  
            if (assistTypePoint) {
              const assistPointInfo = pointAbbreviations.find(p => p.typePoint === assistTypePoint);
              if (assistPointInfo) {
                await updatePlayerPoints(assist, round, match, assistTypePoint, assistPointInfo.points);
              }
            }
          }
        }
  
        // Update pickteam total points
        await updatePickteamTotalPoints(round, match);
  
        res.status(201).json(matchEvent);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  
    // Create a penalty save event
    createPenaltySaveEvent: async (req, res) => {
      try {
        const { match, round, goalkeeper, missedBy, time } = req.body;
  
        const matchEvent = await MatchEvent.create({
          match,
          round,
          player: goalkeeper,
          penaltySaveMissedby: missedBy,
          time,
          eventType: 'penalty_save',
          typePoint: [{ typePoint: 'GPA', player: goalkeeper }],
        });
  
        const pointInfo = pointAbbreviations.find(p => p.typePoint === 'GPA');
        if (pointInfo) {
          await updatePlayerPoints(goalkeeper, round, match, 'GPA', pointInfo.points);
        }
  
        if (missedBy) {
          await updatePlayerPoints(missedBy, round, match, 'PM', -10);
        }
  
        await updatePickteamTotalPoints(round, match);
  
        res.status(201).json(matchEvent);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  
    // Create a red card event
    createRedCardEvent: async (req, res) => {
      try {
        const { match, round, player, time, cardType } = req.body;
  
        const typePoint = cardType === 'direct' ? 'CR' : '2CJ';
        const points = cardType === 'direct' ? -25 : -10;
  
        const matchEvent = await MatchEvent.create({
          match,
          round,
          player,
          time,
          eventType: 'sanction',
          card: cardType === 'direct' ? 'red direct' : '2 yellow',
          typePoint: [{ typePoint, player }],
        });
  
        await updatePlayerPoints(player, round, match, typePoint, points);
  
        await updatePickteamTotalPoints(round, match);
  
        res.status(201).json(matchEvent);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  
    // Create an own goal event
    createOwnGoalEvent: async (req, res) => {
      try {
        const { match, round, player, time } = req.body;
  
        const matchEvent = await MatchEvent.create({
          match,
          round,
          player,
          time,
          eventType: 'own_goal',
          typePoint: [{ typePoint: 'CC', player }],
        });
  
        const pointInfo = pointAbbreviations.find(p => p.typePoint === 'CC');
        if (pointInfo) {
          await updatePlayerPoints(player, round, match, 'CC', pointInfo.points);
        }
  
        await updatePickteamTotalPoints(round, match);
  
        res.status(201).json(matchEvent);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  
    // Create a substitution event
    createSubstitutionEvent: async (req, res) => {
      try {
        const { match, round, playerOut, playerIn, time } = req.body;
  
        const matchEvent = await MatchEvent.create({
          match,
          round,
          substitutionPlayerOut: playerOut,
          substitutionPlayerIn: playerIn,
          time,
          eventType: 'substitution',
          typePoint: [{ typePoint: 'RM', player: playerOut }],
        });
  
        const pointInfo = pointAbbreviations.find(p => p.typePoint === 'RM');
        if (pointInfo) {
          await updatePlayerPoints(playerOut, round, match, 'RM', pointInfo.points);
        }
  
        await updatePickteamTotalPoints(round, match);
  
        res.status(201).json(matchEvent);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  
    // Get all match events
    getAllMatchEvents: async (req, res) => {
      try {
        const matchEvents = await MatchEvent.find()
          .populate('player')
          .populate('assist')
          .populate('penaltySaveMissedby')
          .populate('substitutionPlayerIn')
          .populate('substitutionPlayerOut');
  
        res.status(200).json(matchEvents);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  
    // Get match event by ID
    getMatchEventById: async (req, res) => {
      try {
        const matchEvent = await MatchEvent.findById(req.params.id)
          .populate('player')
          .populate('assist')
          .populate('penaltySaveMissedby')
          .populate('substitutionPlayerIn')
          .populate('substitutionPlayerOut');
  
        if (!matchEvent) {
          return res.status(404).json({ message: "Match event not found" });
        }
  
        res.status(200).json(matchEvent);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  
    // Get match events by match ID
    getMatchEventsByMatchId: async (req, res) => {
      try {
        const matchEvents = await MatchEvent.find({ match: req.params.matchId })
          .populate('player')
          .populate('assist')
          .populate('penaltySaveMissedby')
          .populate('substitutionPlayerIn')
          .populate('substitutionPlayerOut');
  
        res.status(200).json(matchEvents);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  
    // Update match event
    updateMatchEvent: async (req, res) => {
      try {
        const matchEvent = await MatchEvent.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );
  
        if (!matchEvent) {
          return res.status(404).json({ message: "Match event not found" });
        }
  
        res.status(200).json(matchEvent);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  
    // Delete match event
    deleteMatchEvent: async (req, res) => {
      try {
        const matchEvent = await MatchEvent.findByIdAndDelete(req.params.id);
  
        if (!matchEvent) {
          return res.status(404).json({ message: "Match event not found" });
        }
  
        res.status(200).json({ message: "Match event deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  };
  
  module.exports = matchEventCtrl;