const { Schema, mongoose } = require('mongoose')

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

const PointPlayerSchema = new Schema({
    player: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    points: [{
        round: { type: String, required: true },
        total: Number,
        detail: [{
            typePoint: {
                type: String,
                enum: pointAbbreviations.typePoint,
                required: true
            },
            actionPoint: String,
            points: Number,
        }]
    }]
},
    { versionKey: false });


module.exports = mongoose.model('PointPlayer', PointPlayerSchema);