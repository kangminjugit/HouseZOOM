const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
    info:{
        title: '집ZOOM API',
        version: '1.0.0',
        description: '집ZOOM API입니다:) 로그인이 꼭 필요한 api를 다룰 때는 Authorize 버튼을 누르고 빈칸에 Bearer jwt-token을 넣으면 됩니다.(jwt-token은 유저가 로그인할 때 받은 토큰)',
    },
    host: 'http://13.125.141.137:3000',
    // host: 'localhost:3000',
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