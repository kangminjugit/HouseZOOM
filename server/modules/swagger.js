const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition:{
        info:{
            title: '집ZOOM API',
            version: '1.0.0',
            description: '집ZOOM API입니다:)',
        },
        host: 'localhost:3000',
        // host: '3.35.141.211:3000',
        basePath: '/'
    },
    apis: ['./routes/*.js', './swagger/*']
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};