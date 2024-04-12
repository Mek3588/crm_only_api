const jwt = require("jsonwebtoken");
const User = require("../../models/acl/user");
const { canUserEdit } = require("./authorization");

const canUserCreate =() => async (req, res, next) => {
    try {
        
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const users = await User.findAll({
            where: {
                email: decoded.email
            }
        }, { raw: true })
        if (!users || users.length <= 0) {
            res.status(401).json({ msg: "unauthorized access" });
            return;
        }
        req.user = users[0];
        

        if (req.user.role == "SuperAdmin") {
            

            next();

        }
        else if (req.body.role == "Staff" && req.editPath == "employees") {
            

            next();
        }
        else if (req.body.role == "Customer" && req.editPath == "accounts") {
            

            next();
        }
        else if (req.body.role == "Agent" && req.editPath == "agents") {
            

            next();
        }
        else if (req.body.role == "Broker" && req.editPath == "organizations") {
            

            next();
        }
        else {
            res.status(401).json({ msg: "unauthorized access to create a user" });
        }

    } catch (error) {
        res.status(401).json({ msg: "unauthorized access" });
    }
}

module.exports = {canUserCreate}; 