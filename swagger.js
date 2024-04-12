const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
let options;
try {
  const filePath = "./apis/auth.js";
  
  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    // Handle the case where the file is not found
    // Return an appropriate response or take necessary action
    return;
  }
  
   options = {
    swaggerDefinition: {
      info: {
        title: 'Express API Documentation',
        version: '1.0.0',
      },
    },
    apis: [filePath],
  };
  
  // Rest of the code goes here
  
} catch (error) {
  // Handle any errors that occurred during the execution
  console.error('An error occurred:', error);
}
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
