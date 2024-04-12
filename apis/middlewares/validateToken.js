const jwt = require("jsonwebtoken");
const User = require("../../models/acl/user");
const validateToken = async(req, res, next) => {
    try {
        
        const token = req.headers.authorization.split(" ")[1];
        
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(decoded){
            
            const users = await User.findAll({where: {
                email: decoded.email
            }}, { raw: true })
            if (!users || users.length <= 0) {
                res.status(401).json({msg:"unauthorized access"});
                return;
            }
            req.user = users[0];
            res.status(200).json(req.user);

            // next();
        }else{
            res.status(401).json({msg:"unauthorized access"});

        }
    } catch (error) {
        
        res.status(401).json({msg:"unauthorized access"});
    }
}

module.exports = validateToken; 