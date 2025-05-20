const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Passionee API Documentation",
      version: "1.0.0",
      description: "API documentation for Passionee player management",
    },
    servers: [
      {
        url: "http://localhost:5000", // Update with your actual server URL
      },
    ],
  },
  apis: ["./routes/auth/authRoutes.js","./routes/match/playerRoute.js", "./routes/match/teamRoute.js","./routes/match/fixtureRoute.js","./routes/match/pickteamRoute.js" , "./routes/utils/carouselRoute.js" ], // Paths to your route files
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
