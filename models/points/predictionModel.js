const { Schema, mongoose } = require('mongoose');

const CompositionSchema = new Schema({
    players: {
        type: [String],
        required: true
    },
    jeton: {
        type: Number,
        required: true,
        default: 0
    }
});

const FormationSchema = new Schema({
    formation: {
        type: String,
        required: true
    },
    jeton: {
        type: Number,
        required: true,
        default: 0
    }
});

const ButeurSchema = new Schema({
    buteur: {
        type: String,
        required: true
    },
    jeton: {
        type: Number,
        required: true,
        default: 0
    }
});

const PasseurSchema = new Schema({
    passeur: {
        type: String,
        required: true
    },
    jeton: {
        type: Number,
        required: true,
        default: 0
    }
});

const FinalScoreSchema = new Schema({
    finalScore: {
        type: String,
        required: true
    },
    jeton: {
        type: Number,
        required: true,
        default: 0
    }
});

const PredictionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    matchId: {
        type: Schema.Types.ObjectId,
        ref: 'Fixtures',
        required: true
    },
    composition: CompositionSchema,
    formation: FormationSchema,
    buteur: ButeurSchema,
    passeur: PasseurSchema,
    finalScore: FinalScoreSchema,
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    { versionKey: false });


module.exports = mongoose.model('Prediction', PredictionSchema);
