import swaggerJsdoc = require('swagger-jsdoc');

const options = {
    apis: [`${__dirname}/routes/api.js`],
    swaggerDefinition: {
        basePath: '/api',
        info: {
            description: 'Vollständige API Entwicklerdokumentation.',
            swagger: '2.0',
            title: 'Social Adventure',
            version: '1.0.6',
        }
    }
};


const specs = swaggerJsdoc(options);
export default specs;