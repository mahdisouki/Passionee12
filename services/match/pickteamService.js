
const pickteam = require("../../models/match/pickteamModels");
const Player = require("../../models/match/playerModels");

exports.createPickteam = async (itemsToSave) => {
    return await pickteam.create(itemsToSave);
};
// exports.createAndClonePickteam = async (itemsToSave) => {
//     try {
//         const maxRounds = 30; 

//         const createdPickteam = await pickteam.create(itemsToSave);

//         const clonedPickteams = [];

//         for (let round = 9; round <= maxRounds; round++) {
//             const newPickteam = {
//                 ...createdPickteam.toObject(), 
//                 round: "Championnat ligue - " + round, 
//                 _id: undefined, 
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//                 currentPoint:0,
//                 totalsPoint:0
//             };

//             const savedPickteam = await pickteam.create(newPickteam);
//             clonedPickteams.push(savedPickteam);
//         }

//         return {
//             message: "Pickteam created and cloned successfully for all remaining rounds.",
//             createdRound: itemsToSave.round,
//             clonedRounds: clonedPickteams.map(pick => pick.round),
//             data: clonedPickteams,
//         };
//     } catch (error) {
//         console.error(error);
//         throw new Error("Error creating and cloning pickteam: " + error.message);
//     }
// };
exports.getAllPickteams = async () => {
    return await pickteam.find();
};

exports.getPickteamWithPlayers = async () => {
    return await pickteam.aggregate([
        {
            $lookup: {
                from: 'players',
                localField: 'playername',
                foreignField: 'name',
                as: 'playerDetails'
            }
        }
    ]);
};

exports.getPickteamByIdAndRound = async (userId, round) => {
    return await pickteam.aggregate([
        {
            $match: {
                userId: userId,
                round: round
            }
        },
        {
            $unwind: "$player"
        },
        {
            $lookup: {
                from: 'players',
                let: { playerid: { $toObjectId: "$player.playerid" } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$playerid"]
                            }
                        }
                    }
                ],
                as: 'playerDetails'
            }
        },
        {
            $unwind: { path: '$playerDetails', preserveNullAndEmptyArrays: true }
        },
        {
            $lookup: {
                from: 'pointsattributions',
                let: {
                    playerid: { $toObjectId: '$player.playerid' },
                    round: '$round'
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$player', '$$playerid'] },
                                    { $eq: ['$round', '$$round'] }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalPoints: { $sum: '$points' }
                        }
                    }
                ],
                as: 'pointsAttributions'
            }
        },
        {
            $unwind: {
                path: '$pointsAttributions',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $set: {
                "playerDetails.totalPoints": {
                    $ifNull: ['$pointsAttributions.totalPoints', 0]
                },
                "playerDetails.modifiedPoints": {
                    $cond: {
                        if: { $eq: ['$player.captain', true] },
                        then: { $multiply: ['$pointsAttributions.totalPoints', 2] },
                        else: { $ifNull: ['$pointsAttributions.totalPoints', 0] }
                    }
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                userId: { $first: '$userId' },
                round: { $first: '$round' },
                currentPoint: { $first: '$currentPoint' },
                totalsPoint: {
                    $sum: {
                        $ifNull: ['$playerDetails.modifiedPoints', 0]
                    }
                },
                players: {
                    $push: {
                        rowIndex: '$player.rowIndex',
                        playerid: '$player.playerid',
                        position: '$player.position',
                        isSubstituted: '$player.isSubstituted',
                        captain: '$player.captain',
                        transfert: '$player.transfert',
                        isInjured: '$player.isInjured',
                        vicecaptain: '$player.vicecaptain',
                        redCard: '$player.redCard',
                        playerDetails: '$playerDetails'
                    }
                }
            }
        }
    ]);
};

exports.getPickteamTransertById = async (userId) => {
    try {
        const pickTeams = await pickteam.find({ userId }).populate('playerTransfert.playerid'); // assuming you want to populate playerid from players collection

        const playerDetails = [];

        for (const pickTeam of pickTeams) {
            for (const transfer of pickTeam.playerTransfert) {
                const player = await Player.findById(transfer.playerid); // Assuming playerId is the player ID in the players collection
                if (player) {
                    playerDetails.push({
                        player: player,
                        transferType: transfer.transferType
                    });
                }
            }
        }

        return playerDetails;
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

exports.getPickteamById = async (userId) => {
    return await pickteam.aggregate([
        {
            $match: { userId: userId }
        },
        {
            $unwind: '$player'
        },
        {
            $lookup: {
                from: 'players',
                let: { playerid: { $toObjectId: '$player.playerid' } },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$playerid'] } } }
                ],
                as: 'playerDetails'
            }
        },
        {
            $unwind: {
                path: '$playerDetails',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'pointsattributions',
                let: { playerid: { $toObjectId: '$player.playerid' }, round: '$round' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$player', '$$playerid'] },
                                    { $eq: ['$round', '$$round'] }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalPoints: { $sum: '$points' }
                        }
                    }
                ],
                as: 'pointsRound'
            }
        },
        {
            $unwind: {
                path: '$pointsRound',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'pointsattributions',
                let: { playerid: { $toObjectId: '$player.playerid' } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$player', '$$playerid'] }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalPoints: { $sum: '$points' }
                        }
                    }
                ],
                as: 'pointsAttributions'
            }
        },
        {
            $unwind: {
                path: '$pointsAttributions',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: '$_id',
                userId: { $first: '$userId' },
                round: { $first: '$round' },
                currentPoint: { $first: '$currentPoint' },
                totalsPoint: { $first: '$totalsPoint' },
                players: {
                    $push: {
                        rowIndex: '$player.rowIndex',
                        playerid: '$player.playerid',
                        position: '$player.position',
                        isSubstituted: '$player.isSubstituted',
                        captain: '$player.captain',
                        transfert: '$player.transfert',
                        isInjured: '$player.isInjured',
                        vicecaptain: '$player.vicecaptain',
                        redCard: '$player.redCard',
                        playerDetails: '$playerDetails',
                        totalPoints: {
                            $ifNull: ['$pointsAttributions.totalPoints', 0]
                        },
                        roundPoints: {
                            $ifNull: ['$pointsRound.totalPoints', 0]
                        }
                    }
                }
            }
        }
    ]);
};

exports.updateTotalPoints = async (userId) => {
    // Step 1: Aggregate to calculate the sum of round points
    const result = await pickteam.aggregate([
        {
            $match: { userId: userId }
        },
        {
            $unwind: '$player'
        },
        {
            $lookup: {
                from: 'pointsattributions',
                let: { playerid: { $toObjectId: '$player.playerid' }, round: '$round' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$player', '$$playerid'] },
                                    { $eq: ['$round', '$$round'] }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalPoints: { $sum: '$points' }
                        }
                    }
                ],
                as: 'pointsRound'
            }
        },
        {
            $unwind: {
                path: '$pointsRound',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: '$userId', // Group by userId to calculate total for the team
                totalPoints: { $sum: '$pointsRound.totalPoints' }
            }
        }
    ]);

    // Step 2: Update the totalPoints in the pickteam model
    if (result.length > 0) {
        const totalPoints = result[0].totalPoints || 0;

        await pickteam.updateOne(
            { userId: userId },
            { $set: { totalPoints: totalPoints } }
        );

        return { message: 'Total points updated successfully', totalPoints };
    } else {
        return { message: 'No data found for the user', totalPoints: 0 };
    }
};

exports.getUserRanks = async () => {
    return await pickteam.aggregate([
        {
            $group: {
                _id: '$userId',
                totalPoints: { $sum: '$totalsPoint' }
            }
        },
        {
            $sort: { totalPoints: -1 }
        },
        {
            $setWindowFields: {
                sortBy: { totalPoints: -1 },
                output: {
                    rank: {
                        $rank: {}
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'users',
                let: { userId: { $toObjectId: '$_id' } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$_id', '$$userId']
                            }
                        }
                    },
                    {
                        $project: {
                            username: 1,
                            name: 1,
                            logo: 1
                        }
                    }
                ],

                as: 'userDetails'
            }
        },
        {
            $unwind: {
                path: '$userDetails',
                preserveNullAndEmptyArrays: true
            }
        },
    ]);
};

exports.getUserRanksById = async (userId) => {
    return await pickteam.aggregate([
        // Stage 1: Unwind the players array
        {
            $unwind: '$player'
        },
        // Stage 2: Lookup points attributions for each player
        {
            $lookup: {
                from: 'pointsattributions',
                let: { playerid: { $toObjectId: '$player.playerid' } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$player', '$$playerid'] }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalPlayerPoints: { $sum: '$points' }
                        }
                    }
                ],
                as: 'playerPoints'
            }
        },
        // Stage 3: Replace empty player points with 0
        {
            $addFields: {
                'player.totalPoints': {
                    $ifNull: [{ $arrayElemAt: ['$playerPoints.totalPlayerPoints', 0] }, 0]
                }
            }
        },
        // Stage 4: Group by userId and sum all player points
        {
            $group: {
                _id: '$userId',
                totalPoints: { $sum: '$player.totalPoints' }
            }
        },
        // Stage 5: Sort users by total points
        {
            $sort: { totalPoints: -1 }
        },
        // Stage 6: Assign rank using $setWindowFields
        {
            $setWindowFields: {
                sortBy: { totalPoints: -1 },
                output: {
                    rank: {
                        $rank: {}
                    }
                }
            }
        },
        // Stage 7: Match specific userId to filter the result
        {
            $match: {
                _id: userId // Filter for the specific userId
            }
        }
    ]);
};

exports.deletePickteamById = async (userId) => {
    return await pickteam.deleteMany({ "userId": { $eq: userId } });
};

exports.updateSubstitution = async (id, playerData, playerToBeChanged, round) => {
    const player = await pickteam.findOneAndUpdate(
        { "player.playerid": playerData, userId: id, round: round },
        { $set: { "player.$.isSubstituted": true } },
        { new: true }
    );
    const playerToChange = await pickteam.findOneAndUpdate(
        { "player.playerid": playerToBeChanged, userId: id, round: round },
        { $set: { "player.$.isSubstituted": false } },
        { new: true }
    );
    return { message: `Players updated successfully ${player}, ${playerToChange}` };
};

exports.transferPlayer = async (userId, playerToBeTransfert, newPlayerId) => {
    const newPlayer = await Player.findById(newPlayerId);
    if (!newPlayer) throw new Error('New player not found');

    const transferred = await pickteam.findOne(
        {
            userId: userId,
            "player.playerid": playerToBeTransfert
        },
        {
            player: { $elemMatch: { playerid: playerToBeTransfert } }
        }
    );
    if (!transferred) throw new Error('Player to be transferred not found ' + playerToBeTransfert);

    await pickteam.findOneAndUpdate(
        { userId: userId },
        {
            $push: {
                playerTransfert: [
                    {
                        playerid: playerToBeTransfert,
                        transferType: 'out'
                    },
                    {
                        playerid: newPlayerId,
                        transferType: 'in'
                    }
                ]
            },
            $pull: {
                player: { playerid: playerToBeTransfert }
            }
        },
    );

    await pickteam.findOneAndUpdate(
        { userId: userId },
        {
            $push: {
                player: {
                    playerid: newPlayerId,
                    transfert: true,
                    position: newPlayer.position,
                    rowIndex: transferred.player[0].rowIndex,
                    isSubstituted: transferred.player[0].isSubstituted
                }
            }
        },
        { new: true, upsert: true }
    );

    return { message: `Player transferred successfully ${newPlayer} by ${transferred}` };

};

exports.makeCaptain = async (userId, playerId, round) => {
    await pickteam.updateMany(
        { userId: userId, "player.captain": true, round: round },
        { $set: { "player.$[].captain": false } }
    );

    return await pickteam.findOneAndUpdate(
        { userId: userId, "player.playerid": playerId, round: round },
        { $set: { "player.$.captain": true } },
        { new: true }
    );
};

exports.makeViceCaptain = async (userId, playerId) => {
    await pickteam.updateMany(
        { userId: userId, "player.vicecaptain": true, round: round },
        { $set: { "player.$[].vicecaptain": false } }
    );

    return await pickteam.findOneAndUpdate(
        { userId: userId, "player.playerid": playerId, round: round },
        { $set: { "player.$.vicecaptain": true } },
        { new: true }
    );
};
