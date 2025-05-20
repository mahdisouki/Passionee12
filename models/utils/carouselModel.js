const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['home', 'sponsors'],
        description: 'Type of carousel (home or sponsors)'
    },
    images: [{
        url: {
            type: String,
            required: true,
            description: 'URL of the image'
        },
        title: {
            type: String,
            description: 'Title or caption for the image'
        },
        link: {
            type: String,
            description: 'Optional link when image is clicked'
        },
        order: {
            type: Number,
            default: 0,
            description: 'Order of the image in the carousel'
        }
    }],
    isActive: {
        type: Boolean,
        default: true,
        description: 'Whether the carousel is currently active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Carousel', carouselSchema); 