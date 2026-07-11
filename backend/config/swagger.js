const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

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
        url: '/api',
        description: 'Relative API Base (Auto-resolves on Vercel & localhost)',
      },
      {
        url: 'http://localhost:5000/api',
        description: 'Local Standalone Backend Server',
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
  // Ensure that routing annotations are relative to file location for serverless bundlers
  apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
