const UserAttempt = require("../../models/UserLoginAttempt");
const { Op } = require("sequelize");

const numberOfAllowedAttempt = 2;
const activationMinutes = 1;
const checkUserStatus = async (email, phone, ip) => {
  try {
    const status = await UserAttempt.findOne({
      where: {
        [Op.or]: { email: email, phone: phone }
      },
    });
    
    // const currentDateTime = new Date();
    // const threeMinutesAgo = new Date(currentDateTime.getTime() - 3 * 60 * 1000); // Calculate 3 minutes ago
    // const oneDayAgo = new Date(currentDateTime.getTime() - 24 * 60 * 60 * 1000);


    const diff = status && status.lastAttempt ? Math.abs(Date.now() - new Date(status.lastAttempt)) : 0;
    const minutes = Math.floor(diff / (1000));
    // 
    if (diff != 0) {
      if (
        status.attemptCount > numberOfAllowedAttempt &&
        (minutes >= 180)
      ) {

        await activateUser(email, phone, ip);
        return false;
      } else {
        return status != null ? status.locked : false;
      }
    }
    else {
      return false
    }
  } catch (error) {
    
  }
};
const handleAttempt = async (email, phone, ip) => {
  try {
    

    const attempt = await UserAttempt.findOne({
      where: {
        [Op.or]: [{ email: email }, { phone: phone }],
      },
    });
    //find
    

    if (attempt) {
      const count = attempt.attemptCount + 1;
      const update = await UserAttempt.update(
        {
          attemptCount: count,
          locked: count > numberOfAllowedAttempt,
          lastAttempt: new Date(),
        },
        {
          where: {
            [Op.or]: [{ email: email }, { phone: phone },],
          },
        }
      );
    } else {
      
      await UserAttempt.create({
        email: email,
        phone: phone,
        ipAddress: ip,
        attemptCount: 1,
        lastAttempt: new Date(),
      });
    }
  } catch (error) {
    
  }
  // update count  --- // update count and block ==== return
};



const activateUser = async (email, phone, ip) => {
  try {
    const update = await UserAttempt.update(
      { attemptCount: 0, lastAttempt: new Date(), locked: 0 },
      {
        where: {
          [Op.or]: [{ email: email }, { phone: phone }],
        },
      }
    );
  } catch (error) { }
};

const activateStatusCode = async (email, phone, ip) => {
  try {
    const update = await UserAttempt.update(
      { locked: 0 },
      {
        where: {
          [Op.or]: [{ email: email }, { phone: phone }],
        },
      }
    );
  } catch (error) { }
};
const codeSent = async (email, phone, ip) => {
  try {
    if (await resendCode(email, phone, ip) == false) {
      
      return false
    }

    
    const attempt = await UserAttempt.findOne({
      where: {
        [Op.or]: [{ email: email }, { phone: phone }],
      },
    });
    //find
    

    if (attempt) {
      const count = attempt.attemptCount + 1;
      const update = await UserAttempt.update(
        {
          attemptCount: count,
          locked: count > 5,
          lastAttempt: new Date(),
        },
        {
          where: {
            [Op.or]: [{ email: email }, { phone: phone },],
          },
        }
      );
    } else {
      
      await UserAttempt.create({
        email: email,
        phone: phone,
        ipAddress: ip,
        attemptCount: 1,
        lastAttempt: new Date(),
      });
    }
  } catch (error) {
    
  }
  // update count  --- // update count and block ==== return
};

const resendCode = async (email, phone, ip) => {

  try {
    const status = await UserAttempt.findOne({
      where: {
        [Op.or]: { email: email, phone: phone }
      },
    });
    
    

    if (status == null) {
      return true
    }
    const diff = Math.abs(Date.now() - new Date(status.lastAttempt))
    // const minutes = Math.floor(diff / (1000 * 60));
    // const hour = Math.floor(diff / (24 * 60 * 60 * 1000))
    // const second = math.floor(diff /)

    const millisecondsPerSecond = 1000;
    const millisecondsPerMinute = 60 * millisecondsPerSecond;
    const millisecondsPerHour = 60 * millisecondsPerMinute;
    const millisecondsPerDay = 24 * millisecondsPerHour;

    const days = Math.floor(diff / millisecondsPerDay);
    const hours = Math.floor((diff % millisecondsPerDay) / millisecondsPerHour);
    const minutes = Math.floor((diff % millisecondsPerHour) / millisecondsPerMinute);
    const seconds = Math.floor((diff % millisecondsPerMinute) / millisecondsPerSecond);

    if (diff != 0) {
      
      
      
      
      

      
      
      
      
      

      const currentDateTime = new Date();
      const threeMinutesAgo = new Date(currentDateTime.getTime() - 3 * 60 * 1000); // Calculate 3 minutes ago
      const oneDayAgo = new Date(currentDateTime.getTime() - 24 * 60 * 60 * 1000);

      
      

      if ((new Date(status.lastAttempt) >= threeMinutesAgo && new Date(status.lastAttempt) <= currentDateTime) && status.attemptCount < 5) {

        return false // can not send
      }
      ////////
      else if (!(new Date(status.lastAttempt) >= threeMinutesAgo && new Date(status.lastAttempt) <= currentDateTime) && status.attemptCount < 5) {
        await activateStatusCode(email, phone, ip)
        return true
      }


      else if ((new Date(status.lastAttempt) >= oneDayAgo && new Date(status.lastAttempt) <= currentDateTime) && status.attemptCount < 5) {
        await activateUser(email, phone, ip);
        return false
      }
      else {
        return false
      }
    }
    else {
      return false
    }
  } catch (error) {
    
  }
};
// const getUsersByEmail = async (email) => {
//   return Users.findAll({
//     where: {
//       email,
//     },
//   });
// };
// const isUserBlocked = (user) => {
//   if (user.blockedAt != null) {
//     const diff = Math.abs(Date.now() - new Date(user.blockedAt));
//     const minutes = Math.floor(diff / (1000 * 60));

//     if (user.loginAttempts > 3 && minutes <= 20) {
//       return true;
//     }
//   }
//   return false;
// };

// const handleFailedLogin = async (user, ipAddress) => {
//   if (user.blockedAt == null) {
//     await LoginAttemptModel.create({
//       email: user.email,
//       ipAddress,
//       status: "Failed",
//     });

//     const loginAttempts = parseInt(user.loginAttempts);
//     let blockedAt = null;
//     if (loginAttempts > 2) {
//       blockedAt = Date.now();
//     }

//     await Users.update(
//       {
//         loginAttempts: loginAttempts + 1,
//         blockedAt,
//       },
//       {
//         where: {
//           email: user.email,
//         },
//       }
//     );
//   }
// };

// const generateTokens = async (userId, name, email) => {
//   const accessToken = jwt.sign(
//     { userId, name, email },
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: "1d" }
//   );
//   const refreshToken = jwt.sign(
//     { userId, name, email },
//     process.env.REFRESH_TOKEN_SECRET,
//     { expiresIn: "1d" }
//   );
//   return { accessToken, refreshToken };
// };

// const updateUserData = async (userId, refreshToken) => {
//   await Users.update(
//     {
//       refresh_token: refreshToken,
//       blockedAt: null,
//       loginAttempts: 0,
//     },
//     {
//       where: { id: userId },
//     }
//   );
// };

// const getUser = async (userId) => {
//   try {
//     return await Users.findOne({
//       where: { id: userId },
//       include: [{ model: RoleModel }],
//     });
//   } catch (error) {
//     return error;
//   }
// };

// const getUserPermissions = async (roleId) => {
//   const userPermissions = await RolePermissionModel.findAll({
//     where: {
//       roleId,
//     },
//   });

//   const permissionsArray = userPermissions.map(
//     (permission) => permission.permissionId
//   );
//   return Permission.findAll({
//     where: {
//       id: permissionsArray,
//     },
//   });
// };

// const createLoginAttempt = async (email, ipAddress, status) => {
//   await LoginAttemptModel.create({
//     email,
//     ipAddress,
//     status,
//   });
// };

// export const adminLogin = async (req, res) => {
//   try {
//     const ipAddress = await helper.getRequestIP(req);
//     const userData = await getUsersByEmail(req.body.email);

//     if (userData.length !== 1) {
//       return res.status(400).json({ msg: "Incorrect email or password" });
//     }

//     if (isUserBlocked(userData[0])) {
//       return res.status(403).json({
//         msg: "Account blocked because of repeated login attempts. Please try again after 20 minutes.",
//       });
//     }

//     const match = await bcrypt.compare(req.body.password, userData[0].password);
//     if (!match) {
//       await handleFailedLogin(userData[0], ipAddress);
//       return res.status(400).json({ msg: "Incorrect email or password" });
//     }
//     const { id, name, email, roleId } = userData[0];
//     const userId = id;
//     if (roleId == 1) {
//       return res.status(400).json({ msg: "Unauthorized user" });
//     }

//     const { accessToken, refreshToken } = await generateTokens(
//       userId,
//       name,
//       email
//     );
//     await updateUserData(userId, refreshToken);
//     const user = await getUser(userId);
//     const permissions = await getUserPermissions(roleId);
//     await createLoginAttempt(req.body.email, ipAddress, "Success");
//     res.status(200).json({ accessToken, user, permissions });
//   } catch (error) {
//     
//     res.status(500).json({ msg: "Something went wrong" });
//   }
// };

module.exports = {
  checkUserStatus,
  handleAttempt,
  activateUser,
  codeSent,
  resendCode
};
