const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
    info:{
        title: '집ZOOM API',
        version: '1.0.0',
        description: '집ZOOM API입니다:)',
    },
    host: '3.35.141.211:3000',
    basePath: '/',
    securityDefinitions: {
        jwt: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    },
    security: [
        {jwt: []}
    ]
};

const options = {
    swaggerDefinition: swaggerDefinition,
    apis: ['./routes/*.js', './swagger/*'],
    
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};