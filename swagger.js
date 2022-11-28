import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const options = {
    apis: [`${dirname}/routes/api.js`],
    swaggerDefinition: {
        basePath: '/api',
        info: {
            description: 'Vollständige API Entwicklerdokumentation.',
            swagger: '2.0',
            title: 'Social Adventure',
            version: '1.0.8',
        }
    }
};
const specs = swaggerJsdoc(options);
export default specs;
//# sourceMappingURL=swagger.js.map