const crypto = require("crypto");
const generateSecretKey = async () => {
  const length = 32; // Length of the secret key in bytes
  secretKey = crypto.randomBytes(length).toString("hex");
  
  return secretKey;
};
// const secretKey = generateSecretKey();
module.exports = {
  generateSecretKey,
};
