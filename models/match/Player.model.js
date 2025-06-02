const { Schema, mongoose } = require('mongoose')

const PlayerSchema = new Schema({
    team: {
            type: Schema.Types.ObjectId,
            ref: 'Team',
            required: true
    },
    nationality: { type: String },
    dateOfBirth: { type: Date },
    debut: { type: Date },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    position: {
        type: String,
        required: true,
        enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Attacker']
    },
    logo: {
        type: String
    },
    value: {
        type: String
    },
    value_passionne: {
        type: Number
    },
    height: {
        type: String
    },
    // Match statistics
    stats: {
        matchesPlayed: { type: Number, default: 0 },
        minutesPlayed: { type: Number, default: 0 },
        goals: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        cleanSheets: { type: Number, default: 0 },
        penaltiesSaved: { type: Number, default: 0 },
        penaltiesMissed: { type: Number, default: 0 },
        redCards: { type: Number, default: 0 },
        ownGoals: { type: Number, default: 0 },
        captainGames: { type: Number, default: 0 },
        multiGoalsConceded: { type: Number, default: 0 },
        teamScoredThree: { type: Number, default: 0 }
    },
    // Individual fixture statistics
    fixtureStats: [{
        fixture: {
            type: Schema.Types.ObjectId,
            ref: 'Fixtures',
            required: true
        },
        round: {
            type: String,
            required: true
        },
        minutesPlayed: { type: Number, default: 0 },
        goals: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        cleanSheet: { type: Boolean, default: false },
        penaltySaved: { type: Boolean, default: false },
        penaltyMissed: { type: Boolean, default: false },
        redCard: { type: Boolean, default: false },
        ownGoal: { type: Boolean, default: false },
        wasCaptain: { type: Boolean, default: false },
        multiGoalsConceded: { type: Boolean, default: false },
        teamScoredThree: { type: Boolean, default: false },
        points: { type: Number, default: 0 },
        pointDetails: [{
            typePoint: String,
            actionPoint: String,
            points: Number
        }]
    }],
    // Points tracking
    points: [{
        round: String,
        total: Number,
        detail: [{
            typePoint: String,
            actionPoint: String,
            points: Number
        }]
    }],
    // Availability and status
    availabilityStatus: {
        type: String,
        enum: ['available', 'willNotPlay', 'uncertain'],
        default: 'available'
    },
    availabilityReason: {
        type: String,
        required: function() {
            return this.availabilityStatus !== 'available';
        }
    },
    mvp: {
        type: Boolean,
        default: false
    },
    isInjured: {
        type: Boolean,
        default: false
    },
    redCard: {
        type: Boolean,
        default: false
    }
}, { 
    versionKey: false
});

// Static method to check if a player is owned by a specific user in a round
PlayerSchema.statics.isOwnedByUser = async function(playerId, userId, round) {
    const Pickteam = mongoose.model('Pickteam');
    return await Pickteam.exists({
        userId: userId,
        round: round,
        'players.player': playerId
    });
};

// Static method to update player value based on selection count
PlayerSchema.statics.updatePlayerValue = async function(playerId) {
    const Pickteam = mongoose.model('Pickteam');
    const totalTeams = await Pickteam.countDocuments();
    const selectedCount = await Pickteam.countDocuments({ 'players.player': playerId });
    
    const player = await this.findById(playerId);
    if (!player) return null;

    // Price adjustment logic
    if (selectedCount > 400) {
        player.value_passionne += 0.1;
    } else if (selectedCount < 200) {
        player.value_passionne = Math.max(3, player.value_passionne - 0.1);
    }

    await player.save();
    return player;
};

// Static method to get player selection percentage
PlayerSchema.statics.getSelectionPercentage = async function(playerId) {
    const Pickteam = mongoose.model('Pickteam');
    const totalTeams = await Pickteam.countDocuments();
    const selectedCount = await Pickteam.countDocuments({ 'players.player': playerId });
    
    return totalTeams > 0 ? ((selectedCount / totalTeams) * 100).toFixed(1) : 0;
};

module.exports = mongoose.model('Player', PlayerSchema);