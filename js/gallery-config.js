// Gallery Configuration
// To add/remove images, simply edit this file - no need to touch the main gallery code

const galleryConfig = {
    // Gallery folder path (relative to website root)
    imagePath: 'images/gallery/',
    
    // Image data - add or remove entries here
    images: [
        {
            filename: '2700rackwith3x600inserts.jpg',
            title: 'Original RANGERAX 2700 - 3x600 Target Configuration',
            description: '2700 rack with 3x600 wide removable target inserts.'
        },
        {
            filename: '700rackwith2x600inserts.jpg',
            title: 'Original RANGERAX 2700 - 2x600 Target Configuration',
            description: '2700 rack with 2x600 wide removable target inserts for spacing between shooters.'
        },
        {
            filename: '2700rackwith2x750inserts.jpg',
            title: 'Original RANGERAX 2700 - 2x750 Target Configuration',
            description: '2700 rack with 2x750 wide removable target inserts. The larger 750 wide target frames reduce the likelihood of off target shoots striking the timber frame especially if firing larger calibres.'
        },
        {
            filename: '2700RackLinkExample.jpg',
            title: 'Original RANGERAX 2700 Linking Option',
            description: 'Multiple 2700 racks can be linked together with increase spacing between targets and shooters.'
        },
        {
            filename: '600basecloseup.jpg',
            title: 'Mobile RANGERAX 600 Standalone Rack Base Closeup',
            description: 'Closeup of the 600 rack base without target frame insert.'
        },
        {
            filename: '750basecloseup.jpg',
            title: 'Mobile RANGERAX 750 Standalone Rack Base Closeup',
            description: 'Closeup of the 750 rack base without target frame insert. The larger 750 wide target frames reduce the likelihood of off target shoots striking the timber frame especially if firing larger calibres.'
        },
        {
            filename: 'customexample1.jpg',
            title: 'Custom Built Target Racks',
            description: 'Custom built target racks for a local range requiring an additional lower target area for prone shooting.'
        },
        {
            filename: '2700RacksinUse.jpg',
            title: 'Original RANGERAX 2700 in use.',
            description: 'The original 2700 racks in use at live range.'
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