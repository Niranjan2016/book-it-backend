const Category = require('../../models/Category');

async function seedCategories() {
    const categories = [
        {
            name: 'Movies',
            description: 'Latest Bollywood, Hollywood, and Regional films',
            image_url: 'https://example.com/images/movies.jpg'
        },
        {
            name: 'Live Concerts',
            description: 'Music concerts and live performances',
            image_url: 'https://example.com/images/concerts.jpg'
        },
        {
            name: 'Sports',
            description: 'Cricket, Football, and other sporting events',
            image_url: 'https://example.com/images/sports.jpg'
        },
        {
            name: 'Theatre',
            description: 'Plays, dramas, and stage performances',
            image_url: 'https://example.com/images/theatre.jpg'
        }
    ];

    try {
        await Category.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await Category.destroy({ where: {}, force: true });
        await Category.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        const createdCategories = await Category.bulkCreate(categories);
        console.log('Categories seeded successfully');
        return createdCategories;
    } catch (error) {
        console.error('Error seeding categories:', error);
        throw error;
    }
}

module.exports = seedCategories;