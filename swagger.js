"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerJsdoc = require("swagger-jsdoc");
const options = {
    apis: [`${__dirname}/routes/api.js`],
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
exports.default = specs;
//# sourceMappingURL=swagger.js.map