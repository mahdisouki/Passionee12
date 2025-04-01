const fixtureModel = require("../models/match/Fixture.model");
const pickteamModel = require("../models/match/Pickteams.model");
const userpointsModel = require("../models/points/userPointsModel");
const lineupModel = require("../models/match/lineupModels");
const userModel = require("../models/User/User.model");
const ptsattribModel = require("../models/points/pointsattributionModel");
const notificationModel = require("../models/utils/notificationModels");

exports.getAllFixtures = async () => {
    return await fixtureModel.find().sort({ _id: 1 });
};

exports.getAllFixtureByIdTeam = async (id) => {
    return await fixtureModel.find({ "teamshome.id": id }).sort({ date: 1 });
};

exports.getAllFixtureByStatusShort = async (status) => {
    return await fixtureModel.find({ "statusshort": status }).sort({ round: 1 });
};

exports.getAllFixtureByRoundName = async (round) => {
    return await fixtureModel.find({ "round": round }).sort({ round: 1 });
};

exports.createFixture = async (Fixture) => {
    return await fixtureModel.create(Fixture);
};

exports.getFixtureById = async (id) => {
    return await fixtureModel.findById(id);
};

exports.updateFixture = async (id, Fixture) => {
    return await fixtureModel.findByIdAndUpdate(id, Fixture);
};

exports.deleteFixture = async (id) => {
    return await fixtureModel.findByIdAndDelete(id);
};

exports.getLastCurrentRound = async () => {
    return await fixtureModel.findOne({ statusshort: { $nin: ['NS', 'TBD', 'PST', 'FT'] } }).sort({date: -1});
};

exports.getNextRound = async () => {
    // Get the current round
    const currentRound = await fixtureModel.findOne({ statusshort: { $nin: ['NS', 'TBD', 'PST', 'FT'] } }).sort({date: -1});

    if (!currentRound) {
        // Handle case where no current round is found
        return null;
    }

    // Find the next round after the current round
    const nextRound = await fixtureModel
        .findOne({ round: { $gt: currentRound.round } }) // Look for rounds after the current round's date
        .sort({ date: 1 }); // Sort by date in ascending order to get the nearest one

    return nextRound;
};

exports.getNearestMatchForTeam = async (teamId) => {
    let fixtures = await fixtureModel.find({ statusshort: 'NS' }).sort({ date: 1 });

    const filteredFixtures = fixtures.filter(
        match => {
            return (match.teamshome.id?.toString() === teamId) ||
                (match.teamsaway.id?.toString() === teamId)
        }
    );
    return filteredFixtures[0];
};

exports.updateScore = async (id, equipe) => {
    const fixture = await fixtureModel.findById(id);
    if (equipe == 'home') {
        fixture.goalshome.fulltime = fixture.goalshome.fulltime + 1;
    } else {
        fixture.goalsaway.fulltime = fixture.goalsaway.fulltime + 1;
    }
    return await fixture.save();
}

exports.updateStatus = async (id, content) => {
    console.log(content);
    const fixture = await fixtureModel.findById(id);

    if (content == 'FT') {
        fixture.statusshort = 'FT';
        fixture.statuslong = 'Match Finished';
        cleansheet(fixture);
        redeemPoints(fixture);
    } else if (content == 'live1') {
        console.log('live1');
        fixture.statusshort = 'live';
        fixture.statuslong = 'live';
        fixture.goalshome.fulltime = 0;
        fixture.goalsaway.fulltime = 0;
        redeemPointsTitulaires(fixture);
    } else if (content == 'live2') {
        console.log('live2');
        fixture.statusshort = 'live';
        fixture.statuslong = 'live';
    } else {
        fixture.statusshort = '1H';
        fixture.statuslong = 'Half Time';
        fixture.goalshome.halftime = fixture.goalshome.fulltime;
        fixture.goalsaway.halftime = fixture.goalsaway.fulltime;
    }
    return await fixture.save();
};

async function cleansheet(fixture) {
    if (fixture.goalshome.fulltime == 0) {
        const lineup = await lineupModel.findOne({ match_id: fixture.id });
        console.log(lineup);
        ///////////////
        if (lineup) {
            for (let x = 0; x < lineup.lineups.length; x++) {
                const teamlineup = lineup.lineups[x];
                console.log(teamlineup);
                if (teamlineup.team.name == fixture.teamsaway.name) {
                    for (let i = 0; i < teamlineup.startXI.length; i++) {
                        const player = teamlineup.startXI[i];
                        let points = 0;
                        if (player.position == 'Defender' || player.position.includes("Défenseur")) {
                            points = 3;
                        } else if (player.position == 'Midfielder' || player.position.includes("Milieu")) {
                            points = 2;
                        } else if (player.position == 'Attacker') {
                            points = 1;
                        } else if (player.position == 'Goalkeeper') {
                            points = 5
                        }
                        ;
                        const pointsattribution = await ptsattribModel.findOne({
                            match: fixture.id,
                            round: fixture.round,
                            player: player.name
                        });

                        if (!pointsattribution) {
                            const attrib = {
                                match: fixture.id,
                                round: fixture.round,
                                player: player.name,
                                points: points
                            };
                            await ptsattribModel.create(attrib);
                        } else {
                            pointsattribution.points += points;
                            await pointsattribution.save();
                        }
                    }
                }
            }
        }
        //////////////////////

    }

    if (fixture.goalsaway.fulltime == 0) {
        ///////////////

        const lineup = await lineupModel.findOne({ match_id: fixture.id });
        if (lineup) {
            console.log(lineup);
            for (let x = 0; x < lineup.lineups.length; x++) {
                const teamlineup = lineup.lineups[x];
                console.log(teamlineup);
                if (teamlineup.team.name == fixture.teamshome.name) {
                    for (let i = 0; i < teamlineup.startXI.length; i++) {
                        const player = teamlineup.startXI[i];
                        let points = 0;
                        if (player.position == 'Defender' || player.position.includes("Défenseur")) {
                            points = 3;
                        } else if (player.position == 'Midfielder' || player.position.includes("Milieu")) {
                            points = 2;
                        } else if (player.position == 'Attacker') {
                            points = 1;
                        } else if (player.position == 'Goalkeeper') {
                            points = 5
                        }
                        ;
                        const pointsattribution = await ptsattribModel.findOne({
                            match: fixture.id,
                            round: fixture.round,
                            player: player.name
                        });

                        if (!pointsattribution) {
                            const attrib = {
                                match: fixture.id,
                                round: fixture.round,
                                player: player.name,
                                points: points
                            };
                            await ptsattribModel.create(attrib);
                        } else {
                            pointsattribution.points += points;
                            await pointsattribution.save();
                        }
                    }
                }
            }

        }
        
    }

}

async function redeemPoints(fixture) {
    const roundd = fixture.round;

    const users = await userModel.find();

    //users.forEach(async (element, index) => {
    for (let x = 0; x < users.length; x++) {
        const user = users[x];
        somme = 0;
        //const picks=await pickteamModel.find({ userId: element.id , round:round});
        const picks = await pickteamModel.find({ round: roundd, userId: user.id });


        if (picks.length > 0) {
            for (let j = 0; j < picks.length; j++) {
                const pick = picks[j];
                pointsattribution = await ptsattribModel.findOne({
                    match: fixture.id,
                    round: roundd,
                    player: pick.playername
                });

                if (!pointsattribution) {
                    somme += 0;
                    console.log(somme);
                } else {
                    console.log(pointsattribution);
                    somme += pointsattribution.points;
                    console.log(somme);
                }
            }
            //});

            const userpts = await userpointsModel.findOne({ round: roundd, user: user.id });
            if (!userpts) {
                const uspts = { user: user.id, round: roundd, points: somme };
                console.log("userpts:      " + uspts);
                await userpointsModel.create(uspts);
                const message = "votre score pour la journée " + roundd + " est " + somme;
                await notificationModel.create({ message: message, recipient: user.id });
            } else {
                userpts.points += somme;
                console.log("userpts:    " + userpts)
                await userpts.save();
                const message = "votre score pour la journée " + roundd + " est " + userpts.points;
                await notificationModel.create({ message: message, recipient: user.id });
            }

        }
        ;

    }
    ;

}

async function redeemPointsTitulaires(fixture) {

    console.log(fixture);

    const round = fixture.round;
    const users = await userModel.find();

    //users.forEach(async (element, index) => {
    for (let y = 0; y < users.length; y++) {
        const user = users[y];
        somme = 0;
        //const picks=await pickteamModel.find({ userId: element.id , round:round});
        const picks = await pickteamModel.find({ round: round, userId: user.id });


        if (picks.length > 0) {
            //picks.forEach(async pick => {
            for (let j = 0; j < picks.length; j++) {
                const pick = picks[j];
                if (pick.isSubstituted == false) {
                    const lineup = await lineupModel.findOne({ journee: round, match_id: fixture.id });
                    /////////////
                    if (lineup) {
                        for (let i = 0; i < lineup.lineups.length; i++) {
                            const lin = lineup.lineups[i];

                            for (let x = 0; x < lin.startXI.length; x++) {
                                const player = lin.startXI[x];

                                if (player.name == pick.playername) {
                                    somme = somme + 3;
                                    console.log("somme  " + somme + "    pick :      " + pick.playername);

                                }

                            }
                        }
                    }
                    ///////////
                }
            }

            const userpts = await userpointsModel.findOne({ round: round, user: user.id });
            console.log("somme :      " + somme);
            if (!userpts) {

                const uspts = { user: user.id, round: round, points: somme };
                await userpointsModel.create(uspts);
            } else {
                userpts.points = userpts.points + somme;
                await userpts.save();
            }
        }
       


    }


}
