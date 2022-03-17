import swaggerJsdoc = require('swagger-jsdoc');

const options = {
    apis: ['./routes/api.js'],
    swaggerDefinition: {
        basePath: '/api',
        info: {
            description: 'Vollständige API Entwicklerdokumentation.',
            swagger: '2.0',
            title: 'Social Adventure',
            version: '1.0.0',
        }
    }
};

const specs = swaggerJsdoc(options);
export default specs;