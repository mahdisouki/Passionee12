const Carousel = require('../../models/utils/carouselModel');
const cloudinary = require('../../helper/cloudinaryConfig');

const carouselCtrl = {
    // Create a new carousel
    createCarousel: async (req, res) => {
        try {
            const { type } = req.body;
            const files = req.files;

            // Validate type
            if (!['home', 'sponsors'].includes(type)) {
                return res.status(400).json({ 
                    error: 'Invalid carousel type. Must be either "home" or "sponsors"' 
                });
            }

            // Check if carousel of this type already exists
            const existingCarousel = await Carousel.findOne({ type });
            if (existingCarousel) {
                return res.status(400).json({ 
                    error: `A carousel of type "${type}" already exists` 
                });
            }

            // Validate files
            if (!files || files.length === 0) {
                return res.status(400).json({ 
                    error: 'At least one image is required' 
                });
            }

            // Process uploaded files
            const images = files.map((file, index) => {
                // Get title and link from form data
                const title = req.body[`title_${index}`] || '';
                const link = req.body[`link_${index}`] || '';

                return {
                    url: file.url, // Cloudinary URL
                    title,
                    link,
                    order: index
                };
            });

            const carousel = new Carousel({
                type,
                images
            });

            await carousel.save();
            res.status(201).json({ 
                data: carousel, 
                status: "success",
                message: `${type} carousel created successfully` 
            });
        } catch (err) {
            console.error('Error creating carousel:', err);
            res.status(500).json({ error: err.message });
        }
    },

    // Get all carousels
    getAllCarousels: async (req, res) => {
        try {
            const carousels = await Carousel.find().sort({ type: 1 });
            res.json({ 
                data: carousels, 
                status: "success" 
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get carousel by type
    getCarouselByType: async (req, res) => {
        try {
            const { type } = req.params;
            const carousel = await Carousel.findOne({ type });
            
            if (!carousel) {
                return res.status(404).json({ 
                    error: `No carousel found for type "${type}"` 
                });
            }

            res.json({ 
                data: carousel, 
                status: "success" 
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Update carousel
    updateCarousel: async (req, res) => {
        try {
            const { type } = req.params;
            const { isActive } = req.body;
            const files = req.files;

            const carousel = await Carousel.findOne({ type });
            if (!carousel) {
                return res.status(404).json({ 
                    error: `No carousel found for type "${type}"` 
                });
            }

            // If new images are uploaded
            if (files && files.length > 0) {
                // Delete old images from Cloudinary
                for (const oldImage of carousel.images) {
                    if (oldImage.url) {
                        try {
                            const publicId = oldImage.url.split('/').pop().split('.')[0];
                            await cloudinary.uploader.destroy(publicId);
                        } catch (err) {
                            console.error('Error deleting old image from Cloudinary:', err);
                        }
                    }
                }

                // Process new images
                carousel.images = files.map((file, index) => {
                    const title = req.body[`title_${index}`] || '';
                    const link = req.body[`link_${index}`] || '';

                    return {
                        url: file.url, // Cloudinary URL
                        title,
                        link,
                        order: index
                    };
                });
            }

            // Update isActive if provided
            if (typeof isActive === 'boolean') {
                carousel.isActive = isActive;
            }

            await carousel.save();
            res.json({ 
                data: carousel, 
                status: "success",
                message: `${type} carousel updated successfully` 
            });
        } catch (err) {
            console.error('Error updating carousel:', err);
            res.status(500).json({ error: err.message });
        }
    },

    // Add image to carousel
    addImage: async (req, res) => {
        try {
            const { type } = req.params;
            const file = req.file;
            const { title, link } = req.body;

            if (!file) {
                return res.status(400).json({ 
                    error: 'No image file provided' 
                });
            }

            const carousel = await Carousel.findOne({ type });
            if (!carousel) {
                return res.status(404).json({ 
                    error: `No carousel found for type "${type}"` 
                });
            }

            // Add new image at the end
            carousel.images.push({
                url: file.url, // Cloudinary URL
                title: title || '',
                link: link || '',
                order: carousel.images.length
            });

            await carousel.save();
            res.json({ 
                data: carousel, 
                status: "success",
                message: "Image added successfully" 
            });
        } catch (err) {
            console.error('Error adding image:', err);
            res.status(500).json({ error: err.message });
        }
    },

    // Remove image from carousel
    removeImage: async (req, res) => {
        try {
            const { type } = req.params;
            const { imageUrl } = req.body;

            const carousel = await Carousel.findOne({ type });
            if (!carousel) {
                return res.status(404).json({ 
                    error: `No carousel found for type "${type}"` 
                });
            }

            // Find and remove the image
            const imageIndex = carousel.images.findIndex(img => img.url === imageUrl);
            if (imageIndex === -1) {
                return res.status(404).json({ 
                    error: "Image not found in carousel" 
                });
            }

            // Delete image from Cloudinary
            try {
                const publicId = imageUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error('Error deleting image from Cloudinary:', err);
            }

            // Remove image and reorder remaining images
            carousel.images.splice(imageIndex, 1);
            carousel.images = carousel.images.map((img, index) => ({
                ...img,
                order: index
            }));

            await carousel.save();
            res.json({ 
                data: carousel, 
                status: "success",
                message: "Image removed successfully" 
            });
        } catch (err) {
            console.error('Error removing image:', err);
            res.status(500).json({ error: err.message });
        }
    },

    // Reorder images in carousel
    reorderImages: async (req, res) => {
        try {
            const { type } = req.params;
            const { imageOrder } = req.body; // Array of image URLs in new order

            const carousel = await Carousel.findOne({ type });
            if (!carousel) {
                return res.status(404).json({ 
                    error: `No carousel found for type "${type}"` 
                });
            }

            // Create new images array with updated order
            const newImages = imageOrder.map((url, index) => {
                const image = carousel.images.find(img => img.url === url);
                if (!image) {
                    throw new Error(`Image with URL ${url} not found in carousel`);
                }
                return {
                    ...image,
                    order: index
                };
            });

            carousel.images = newImages;
            await carousel.save();

            res.json({ 
                data: carousel, 
                status: "success",
                message: "Images reordered successfully" 
            });
        } catch (err) {
            console.error('Error reordering images:', err);
            res.status(500).json({ error: err.message });
        }
    },

    // Delete carousel
    deleteCarousel: async (req, res) => {
        try {
            const { type } = req.params;
            const carousel = await Carousel.findOne({ type });
            
            if (!carousel) {
                return res.status(404).json({ 
                    error: `No carousel found for type "${type}"` 
                });
            }

            // Delete all images from Cloudinary
            for (const image of carousel.images) {
                if (image.url) {
                    try {
                        const publicId = image.url.split('/').pop().split('.')[0];
                        await cloudinary.uploader.destroy(publicId);
                    } catch (err) {
                        console.error('Error deleting image from Cloudinary:', err);
                    }
                }
            }

            await Carousel.deleteOne({ type });
            res.json({ 
                status: "success",
                message: `${type} carousel deleted successfully` 
            });
        } catch (err) {
            console.error('Error deleting carousel:', err);
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = carouselCtrl; 