// Gallery Configuration
// To add/remove images, simply edit this file - no need to touch the main gallery code

const galleryConfig = {
    // Gallery folder path (relative to website root)
    imagePath: 'images/gallery/',
    
    // Image data - add or remove entries here
    images: [
        {
            filename: 'mobilefront.jpg',
            title: 'Mobile RANGERAX - Front View',
            description: 'Front view of the portable Mobile RANGERAX target rack system, made for QPS. Designed for easy transport and quick setup at any range location.'
        },
        {
            filename: 'mobileside.jpg',
            title: 'Mobile RANGERAX - Side Profile',
            description: 'Side profile showing the sturdy construction and balanced design of the Mobile RANGERAX portable target system, made for QPS.'
        },
        {
            filename: 'mobileback.jpg',
            title: 'Mobile RANGERAX - Rear View',
            description: 'Rear view of the Mobile RANGERAX showcasing the robust timber frame construction and target mounting points. Made for QPS.'
        },
        {
            filename: 'customexample1.jpg',
            title: 'Custom Built Target Racks',
            description: 'Custom built target racks for a local range requiring an additional lower target area for prone shooting.'
        },
        {
            filename: '2700RacksinUse.jpg',
            title: 'Original RANGERAX 2700 in Use',
            description: 'The original 2700 racks in use at a live range, demonstrating their durability and professional-grade performance.'
        }
    ]
};

// Process images to create full gallery data (automatically adds path)
const galleryImages = galleryConfig.images.map(image => ({
    src: galleryConfig.imagePath + image.filename,
    title: image.title,
    description: image.description,
    filename: image.filename
}));