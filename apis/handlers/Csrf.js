const { isEmailValid } = require("../../utils/GeneralUtils");
const secretKey = require("../../utils/SecreteKeyGen");
const { Op } = require("sequelize");
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const getCsrf = async (req, res) => {
  try {
    // res.setHeader('x-csrf-token',await getCsrf(res))
    // res.locals.csrfToke
    const key = await req.csrfToken()
    // res.locals.csrftoken = key
    
    return key
    // if (req.method === "GET") {
    //   // Retrieve the CSRF token from the request cookies
    //   const csrfToken = req.cookies.csrfToken;
    //   return csrfToken;
    // } else {

    //   

    //   // Retrieve the CSRF token from the request body or headers
    //   const csrfToken = req.body.csrfToken || req.headers['x-csrf-token'];
    //   return csrfToken;
    // }
  } catch (error) {
    
    res.status(400).json({ error: error.message });
  }
};




const setupCSRFMiddleware = async (app) => {
  // const csrfProtect = csrf({ cookie: true });
  // app.use(cookieParser());
  // app.use(csrfProtect);
}



const validateCSRF = async (req, res, next) => {
  try {

    // 

    // Retrieve the CSRF token from the request headers or body
    const clientCsrfToken = req.headers["x-csrf-token"];
    // Retrieve the CSRF token from the user's session
    // const serverCsrfToken = req.session.csrfToken; 
    const serverCsrfToken = req.csrfToken();
    // Validate the CSRF token
    // 

    
    

    if (clientCsrfToken !== serverCsrfToken) {
      // Handle CSRF token validation error

      res.status(403).json({ msg: "CSRF validation failed " });
      return
    }
    else {
      
      await next()
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getCsrf,
  setupCSRFMiddleware,
  validateCSRF,
};
