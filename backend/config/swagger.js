const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'InterviewAce API Documentation',
      version: '1.0.0',
      description: 'Comprehensive API Documentation for InterviewAce with authentication bearer tokens.',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Input your active authorization JWT token in the format "token" directly.',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Load JSDoc comments from routes
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
