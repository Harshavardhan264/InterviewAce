const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startLocalServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Local dev server running on port ${PORT}`);
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start local server:', error);
  }
};

startLocalServer();
