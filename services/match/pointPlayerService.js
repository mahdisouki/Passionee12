const PointPlayer = require('../../models/match/pointModel');

const pointAbbreviations = [
    // Points communs
    { typePoint: 'J90', actionPoint: 'Pour jouer 90 minutes', points: 1 },
    { typePoint: 'PM', actionPoint: 'Pour chaque penalty manqué', points: -10 },
    { typePoint: 'CC', actionPoint: 'Capitaine', points: 2 },
    { typePoint: 'BO', actionPoint: 'But contre son camp', points: -11 },
    { typePoint: 'CR', actionPoint: 'Carton rouge directe', points: -25 },
    { typePoint: '2CJ', actionPoint: 'Carton rouge (2 jaunes)', points: -10 },

    // Gardien de but
    { typePoint: 'G90', actionPoint: 'Pour jouer 90 minutes (Gardien)', points: 1 },
    { typePoint: 'GCS', actionPoint: 'Clean sheet (Gardien)', points: 5 },
    { typePoint: 'GPA', actionPoint: 'Pour chaque penalty arrêté (Gardien)', points: 10 },
    { typePoint: 'GPD', actionPoint: 'Pour chaque passe décisif (Gardien)', points: 30 },
    { typePoint: 'GBO', actionPoint: 'Pour chaque but marqué (Gardien)', points: 50 },
    { typePoint: 'GPM', actionPoint: 'Pour chaque penalty manqué (Gardien)', points: -4 },
    { typePoint: 'G2B', actionPoint: 'Pour 2 buts ou plus encaissés (Gardien)', points: -2 },
    { typePoint: 'G3BM', actionPoint: 'Pour 3 buts ou plus marqués par l’équipe (Gardien)', points: 2 },

    // Défenseur
    { typePoint: 'D90', actionPoint: 'Pour jouer 90 minutes (Défenseur)', points: 1 },
    { typePoint: 'DCS', actionPoint: 'Clean sheet (Défenseur)', points: 5 },
    { typePoint: 'DPD', actionPoint: 'Pour chaque passe décisif (Défenseur)', points: 5 },
    { typePoint: 'DBO', actionPoint: 'Pour chaque but marqué (Défenseur)', points: 12 },
    { typePoint: 'D2B', actionPoint: 'Pour 2 buts ou plus encaissés (Défenseur)', points: -2 },
    { typePoint: 'D3BM', actionPoint: 'Pour 3 buts ou plus marqués par l’équipe (Défenseur)', points: 2 },

    // Milieu de terrain
    { typePoint: 'M90', actionPoint: 'Pour jouer 90 minutes (Milieu)', points: 1 },
    { typePoint: 'MCS', actionPoint: 'Clean sheet (Milieu)', points: 2 },
    { typePoint: 'MPD', actionPoint: 'Pour chaque passe décisif (Milieu)', points: 3 },
    { typePoint: 'MBO', actionPoint: 'Pour chaque but marqué (Milieu)', points: 8 },
    { typePoint: 'M2B', actionPoint: 'Pour 2 buts ou plus encaissés (Milieu)', points: -1 },
    { typePoint: 'M3BM', actionPoint: 'Pour 3 buts ou plus marqués par l’équipe (Milieu)', points: 4 },

    // Attaquant
    { typePoint: 'A90', actionPoint: 'Pour jouer 90 minutes (Attaquant)', points: 1 },
    { typePoint: 'ACS', actionPoint: 'Clean sheet (Attaquant)', points: 1 },
    { typePoint: 'APD', actionPoint: 'Pour chaque passe décisif (Attaquant)', points: 2 },
    { typePoint: 'ABO', actionPoint: 'Pour chaque but marqué (Attaquant)', points: 6 },
    { typePoint: 'A2B', actionPoint: 'Pour 2 buts ou plus encaissés (Attaquant)', points: -1 },
    { typePoint: 'A3BM', actionPoint: 'Pour 3 buts ou plus marqués par l’équipe (Attaquant)', points: 4 }
];

const pointPlayerService = {
    async createOrUpdatePoint(data) {
        const { player, points } = data;

        points.forEach(pointRound => {
            pointRound.total = 0;

            pointRound.detail.forEach(detail => {
                const pointInfo = pointAbbreviations.find(abbr => abbr.typePoint === detail.typePoint);
                if (pointInfo) {
                    detail.points = pointInfo.points;
                    detail.actionPoint = pointInfo.actionPoint;
                    pointRound.total += detail.points;
                }
            });
        });

        for (const pointRound of points) {
            const existingPointPlayer = await PointPlayer.findOne({ player, 'points.round': pointRound.round }).exec();
            if (existingPointPlayer) {
                for (const detailItem of pointRound.detail) {
                    const existingDetail = existingPointPlayer.points.find(
                        (p) => p.round === pointRound.round
                    ).detail.find((d) => d.typePoint === detailItem.typePoint);

                    if (existingDetail) {
                        console.log(`typePoint ${detailItem.typePoint} already exists. Skipping.`);
                        continue;
                    }

                    await PointPlayer.updateOne(
                        { player, 'points.round': pointRound.round },
                        { $addToSet: { 'points.$.detail': detailItem } }
                    ).exec();
                }
            } else {
                await PointPlayer.findOneAndUpdate(
                    { player },
                    { $push: { points: pointRound } },
                    { upsert: true, new: true }
                ).exec();
            }
        }

        return await PointPlayer.findOne({ player }).exec();
    },

    // Create points for a player
    async createPoint(data) {
        const { player, points } = data;

        points.forEach(pointRound => {
            pointRound.total = 0;

            pointRound.detail.forEach(detail => {
                const pointInfo = pointAbbreviations.find(abbr => abbr.typePoint === detail.typePoint);
                if (pointInfo) {
                    detail.points = pointInfo.points;
                    detail.actionPoint = pointInfo.actionPoint;
                    pointRound.total += detail.points;
                }
            });
        });

        const newPointPlayer = new PointPlayer({
            player,
            points
        });

        return await newPointPlayer.save();
    },

    // Find points by player ID and round
    async findPointsByPlayerAndRound(playerId, round) {
        return await PointPlayer.findOne({ player: playerId, 'points.round': round }).exec();
    },

    // Update player's points for a specific round
    async updatePoints(playerId, round, updatedData) {
        return await PointPlayer.findOneAndUpdate(
            { player: playerId, 'points.round': round },
            { $set: { 'points.$.detail': updatedData.detail, 'points.$.total': updatedData.total } },
            { new: true } // Return the updated document
        ).exec();
    },

    // Delete points for a player in a specific round
    async deletePoints(playerId, round) {
        return await PointPlayer.findByIdAndDelete(playerId);
        // return await PointPlayer.findOneAndUpdate(
        //     { player: playerId },
        //     { $pull: { points: { round } } },
        //     { new: true }
        // ).exec();
    },

    // Fetch all points for a specific player
    async getAllPointsForPlayer(playerId) {
        const playerPoints = await PointPlayer.find({ player: playerId }).exec();

        playerPoints.forEach(playerPoint => {
            playerPoint.points.forEach(pointRound => {
                pointRound.total = pointRound.detail.reduce((acc, detail) => {
                    return acc + (detail.points || 0);
                }, 0);
            });
        });

        return playerPoints;
    },

    // Fetch all points for a specific player
    async getAllPoints() {
        const playerPoints = await PointPlayer.find().exec();

        playerPoints.forEach(playerPoint => {
            playerPoint.points.forEach(pointRound => {
                pointRound.total = pointRound.detail.reduce((acc, detail) => {
                    return acc + (detail.points || 0);
                }, 0);
            });
        });

        return playerPoints;
    }
};

module.exports = pointPlayerService;
