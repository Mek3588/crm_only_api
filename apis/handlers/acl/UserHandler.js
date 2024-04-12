const User = require("../../../models/acl/user");
const jwt = require("jsonwebtoken");
const { Role, ContactStatus } = require("../../../utils/constants");
const sequelize = require("../../../utils/SequelizeUtils");
const { Op } = require("sequelize");

const { getCsrf } = require("./../Csrf.js");
const {
  handleAttempt,
  checkUserStatus,
  activateUser,
  codeSent,
} = require("../UserLoginAttemptHandler");
const {
  checkEmpty,
  isPasswordConfirmed,
  isEmailValid,
  isPhoneNoValid,
  currentUser,
  setCurrentUser,
  getCurrentUser,
  createEventLog,
} = require("../../../utils/GeneralUtils");
const { } = require("../../../utils/GeneralUtils");
const bcrypt = require("bcryptjs");
const Contact = require("../../../models/Contact");
const SalesPerson = require("../../../models/SalesPerson");
const Employee = require("../../../models/Employee");
const {
  sendActivationEmail,
  sendResetLink,
  sendWelcomeEmail,
  sendNewEmail,
} = require("../EmailServiceHandler");
const { smsServer } = require("../../../utils/EmailServer");
const ContactBranch = require("../../../models/ContactBranch");
const { default: axios } = require("axios");
const ACL = require("../../../models/acl/ACL");
const UserGroup = require("../../../models/acl/UserGroup");
const ShareHolders = require("../../../models/shareholders/Shareholder");
const { smsFunction, sendNewSms } = require("../SMSServiceHandler");
const Agent = require("../../../models/agent/Agent");
const Broker = require("../../../models/broker/Broker");
const Group = require("../../../models/acl/Group");
const { getAcls } = require("../../../utils/Authrizations");
const moment = require("moment");

const getting = async (req, res) => {
  try {
    const data = await User.findAll({ include: User });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const signupCustomer = async (req, res) => {
  try {
    const shortCode = Math.floor((Math.random() * 9 + 1) * Math.pow(10, 5));
    req.body.shortCodeExpirationDate = new Date(moment().add(1, "days"));
    req.body.role = "Customer";
    req.body.shortCode = shortCode;
    

    const signUp = await signupMethod(req);
    
    res.status(signUp.status).json({
      msg: signUp.msg ?? "",
      userToken: signUp.userToken ?? "",

    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const signup = async (req, res) => {
  try {
    
    req.body.role = "Staff";
    const signUp = await signupMethod(req);
    res.status(signUp.status).json({
      msg: signUp.msg,
      userToken: signUp.userToken ?? "",
      msg: signUp ?? ""
    });
    return await signupMethod(req);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const signupMethod = async (req) => {
  try {
    const {
      type,
      corporate_name,
      first_name,
      middle_name,
      last_name,
      email,
      gender,
      phone,
      password,
      role,
      activated,
      confirm_password,
      branchId,
      shortCodeExpirationDate,
      business_source_type,
      business_source,
      shortCode,
    } = req.body;
    const newUser = {
      corporate_name,
      first_name,
      middle_name,
      last_name,
      email,
      gender,
      phone,
      activation: true,
      userId: req.body.userId,
      password,
      confirm_password,
      role,
      activated: true,
      shortCode,
      shortCodeExpirationDate,
    };
    const checkResult = checkEmpty({
      password,
      phone,
      confirm_password,
      role,
    });
    if (checkResult.isEmpty) {
      return { status: 400, msg: checkResult.msg };
    }
    if (!isPasswordConfirmed(password, confirm_password)) {
      return {
        status: 400,
        msg: "the password and confirm password are not the same.",
      };
      // res
      //   .status(400)
      //   .json({ msg: "the password and confirm password are not the same." });
      // return;
    }
    if (!isEmailValid(email) && role !== Role.customer) {
      return {
        status: 400,
        msg: "invalid email",
        userToken: userToken,
      };
      // res.status(400).json({ msg: "invalid email" });
    }
    if (!isPhoneNoValid(phone)) {
      return {
        status: 400,
        userToken: null,
        msg: "Invalid phone No"
      };
      // res.status(400).json({ msg: "Invalid phone No" });
      // return;
    }
    const user = await User.findOne({ where: { email } });
    // const phoneNos = await Contact.findOne({ where: { primaryPhone: phone } });
    if (user) {
      return {
        status: 400,
        msg: "User already exists",
      };
      // res.status(400).json({ msg: "User already exists" });
      // return;
    }
    // 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    newUser.password = hashedPassword;

    const createdUser = await User.create(newUser);
    const token = jwt.sign(
      {
        first_name: createdUser.dataValues.first_name,
        middle_name: createdUser.dataValues.middle_name,
        last_name: createdUser.dataValues.last_name,
        email: createdUser.dataValues.email,
        gender: createdUser.dataValues.gender,
        phone: createdUser.dataValues.phone,
        role: createdUser.dataValues.role,
        activated: createdUser.dataValues.activated,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "9h",
      }
    );
    
    if (createdUser) {
      const { role, email } = createdUser;
      if (role === "Agent") {
        const agents = await Agent.findAll({ where: { primaryEmail: email } });
        if (agents)
          Agent.update(
            { accountId: createdUser.id },
            { where: { id: agents[0].id } }
          );
      } else if (role === "Broker") {
        const brokers = await Broker.findAll({
          where: { primaryEmail: email },
        });
        if (brokers)
          Broker.update(
            { accountId: createdUser.id },
            { where: { id: brokers[0].id } }
          );
      } else if (role == Role.staff) {
        
        const salesMan = await Employee.findAll({ where: { email } });

        if (salesMan.length != 0) {
          Employee.update(
            { userId: createdUser.id },
            { where: { id: salesMan[0].id } }
          );
        }
      } else if (role == "Share_holder") {
        const shareHolder = await ShareHolders.findAll({ where: { email } });
        if (shareHolder) {
          ShareHolders.update(
            { userId: createdUser.id },
            { where: { id: shareHolder[0].id } }
          );
        }
      }
      if (createdUser && createdUser.role != Role.customer) {
        // sendActivationEmail(
        //   email,
        //   first_name,
        //   password,
        //   "Welcome to Zemen Insurance",
        //   "We would like to welcome you to our crm. The credentials for accessing your account are:"
        // );
        const emailBeforeAt = email.slice(0, email.indexOf("@"));
        const emailAfterAt = email.slice(email.indexOf("@"), email.length);
        const emailMessage =
          emailBeforeAt.charAt(0) +
          emailBeforeAt.charAt(1) +
          "**" +
          emailBeforeAt.charAt(emailBeforeAt.length - 2) +
          emailBeforeAt.charAt(emailBeforeAt.length - 1) +
          emailAfterAt;
        // await sendActivationEmail(
        //   email,
        //   first_name,
        //   password,
        //   "Welcome to Zemen Insurance",
        //   createdUser.activation
        //     ? "We would like to welcome to our crm. please use https://portal.zemeninsurance.com/newSignIn to login to our system. The activation credentials for accessing your account are"
        //     : "We would like to welcome to our crm. please use https://portal.zemeninsurance.com/newSignIn to login to our system. The credentials for accessing your account are:"
        // );
        await smsFunction(
          phone,
          createdUser.activation
            ? `We would like to welcome to our crm. please use https://portal.zemeninsurance.com/newSignIn to login to our system. The activation credentials for accessing your account are - email: ${emailMessage}, password: ${password}`
            : `We would like to welcome to our crm. please use https://portal.zemeninsurance.com/newSignIn to login to our system. The credentials for accessing your account are - email: ${emailMessage}, password: ${password}`
        );
      }

      if (createdUser.role == Role.customer) {
        const message = `Welcome to Zemen CRM. Please use https://portal.zemeninsurance.com/newSignIn to login to our system. The activation code is ${createdUser.shortCode}`;
        createdUser.phone && (await sendNewSms([phone], message));
        
        // createdUser.email &&
        //   (await sendNewEmail(
        //     [createdUser.email],
        //     "",
        //     "Zemen Account Activation",
        //     message,
        //     [],
        //     ""
        //   ));
        const newContact = await Contact.findOne({
          where: { primaryEmail: email },
        });

        //
        if (newContact) {
          await Contact.update(
            { accountId: createdUser.id },
            { where: { id: newContact.id } }
          );
        } else {
          //
          const status = ContactStatus.lead;
          const corporationId = 0;
          const stage = "";
          const state = "";
          const city = "";
          // const business_source_type = "Direct";
          const address = "";
          const business_source = req.body.business_source
            ? req.body.business_source
            : "";
          const request = req.body;
          const contact = {
            type: request.type,
            userId: createdUser.id,
            companyName: request.corporate_name,
            firstName: request.first_name,
            middleName: request.middle_name,
            lastName: request.last_name,
            primaryEmail: request.email,
            primaryPhone: request.phone,
            gender: request.gender,
            stage: request.stage,
            business_source_type: business_source_type ?? "Direct",
            business_source: business_source !== "" ? business_source : "",
            status: "leads",
            deleted: false,
            branchId: request.branchId,
            accountId: createdUser.id,
          };
          

          createdContact = await Contact.create(contact);
        }
      }
      // res.status(200).json({ userToken: token });


      return {
        status: 200,
        userToken: token,
      };
    }
  } catch (error) {
    return { status: 400, msg: error.message };
    // res.status(400).json({ msg: error.message });
  }
};

const assignRole = async (req, res) => {
  const { userId, groupIds } = req.body;
  try {
    const user = await User.findByPk(userId);
    await UserGroup.destroy({ where: { userId } });
    await user.addGroups(groupIds);
    res.status(200).json(user);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const storeUser = async (req, res) => {
  try {
    
    setCurrentUser(req.body);
    if (req.user.role === Role.superAdmin) {
      return res.status(200).json([]);
    }
    const userGroups = await UserGroup.findAll({
      where: { userId: req.user.id },
    });
    
    let paths = [];
    // await userGroups.forEach(async (group, index) => {
    //   const accessControls = await ACL.findAll({
    //     raw: true,
    //     where: { groupId: group.groupId },
    //   });
    //   accessControls.forEach((accessControl) => {
    //     if (accessControl.canRead)
    //       paths.push(accessControl.path.replace("-", "/"));
    //   });
    //   if (index == userGroups.length - 1) {
    //     

    //     return res.status(200).json(paths);

    //   }
    // });
    // 
    // res.status(200).json(paths);

    await Promise.all(userGroups.map(async (group) => {
      const accessControls = await ACL.findAll({
        raw: true,
        where: { groupId: group.groupId },
      });
      accessControls.forEach((accessControl) => {
        if (accessControl.canRead)
          paths.push(accessControl.path.replace("-", "/"));
      });
    }));

    
    return res.status(200).json(paths);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};



const forgotPassword = async (req, res) => {
  try {

    const { phone } = req.body;
    const oldUser = await User.findAll({ include: User, where: { phone } });
    if (oldUser.length === 0) {
      return res
        .status(200)
        .json({ msg: "Verification code will be sent to your phone" });
    }
    const isUserBlocked = await checkUserStatus(null, phone, req.ip);
    if (isUserBlocked == true) {
      return res.status(403).json({
        msg: "Account blocked. Please try again after 5 minutes.",
      });
    }

    const shortCode = Math.floor((Math.random() * 9 + 1) * Math.pow(10, 5));
    shortCodeExpirationDate = new Date(moment().add(1, "days"));
    const content = `the short code for resetting password is ${shortCode}`;
    const salt = await bcrypt.genSalt(10);
    const hashedShortCode = await bcrypt.hash(String(shortCode), salt);
    try {
      await User.update({
        shortCode: hashedShortCode,
        shortCodeExpirationDate: shortCodeExpirationDate,
        activation: true,
      }, { where: { id: oldUser[0].id }, }
      );
      if (await codeSent(null, phone, req.ip) == false) {
        
        return res.status(400).json({ msg: "Short code has already been sent" });
      }

      const newPhone = phone.slice(-9);

      console.error("other:",);

      const response = await smsFunction(newPhone, content);
      // if (oldUser) {
      //   await sendWelcomeEmail(
      //     oldUser[0].email,
      //     `${oldUser[0].first_name} ${oldUser[0].middle_name} ${oldUser[0].last_name}`,
      //     "Reset your password",
      //     content
      //   );
      // }
      
      res.status(200).json(response);
      // res.status(200).json({ msg: "test" });
    } catch (error) {
      
      res.status(400).json({ msg: error.message });
    }
  }
  catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
}

const confirmSMS = async (req, res) => {
  const { phone, confirmationSMS } = req.body;
  try {
    const user = await User.findOne({ where: { phone } });

    const isUserBlocked = await checkUserStatus(null, phone, req.ip);
    if (isUserBlocked == true) {
      return res.status(403).json({
        msg: "Account blocked. Please try again after 5 minutes.",
      });
    }
    if (!user) {
      return res.status(400).json({ msg: "incorrect credential" });
    }

    const correctShortCode = await bcrypt.compare(
      confirmationSMS,
      user.shortCode
    );
    if (!correctShortCode) {
      await handleAttempt(null, phone, req.ip);
      res.status(400).json({ msg: "incorrect credential." });
      return;
    }
    if (moment(new Date()) >= moment(user.shortCodeExpirationDate)) {
      res.status(400).json({ msg: "Your code has expired." });
    }
    // else {
    //   // const user = await User.update({ shortCodeExpirationDate: null, }, { where: { phone } });
    // }
    console
    res.status(200).json({ confirmationSMS, id: user.id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const resetPassword = async (req, res) => {
  
  try {
    const { id, password, confirm_password, shortCode } = req.body;
    const oldUser = await User.findByPk(id);
    if (!oldUser) {
      return res.status(400).json({ msg: "Not found" });
    }
    const isUserBlocked = await checkUserStatus(null, oldUser.phone, req.ip);
    if (isUserBlocked == true) {
      return res.status(403).json({
        msg: "Account blocked. Please try again after 5 minutes.",
      });
    }
    if (password !== confirm_password) {
      return res
        .status(400)
        .json({ msg: "Password and confirm_password are not the same" });
    }
    const correctShortCode = await bcrypt.compare(shortCode, oldUser.shortCode);
    if (!correctShortCode) {
      await handleAttempt(shortCode.email, shortCode.phone, req.ip);
      res.status(400).json({ msg: "incorrect credential." });
      return;
    }
    if (moment(new Date()) >= moment(oldUser.shortCodeExpirationDate)) {
      res.status(400).json({ msg: "Your code has expired." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.update(
      {
        password: hashedPassword,
        shortCodeExpirationDate: null,
        shortCode: null,
        activation: false,
        activated: true
      },
      { where: { id } }
    );
    res.status(200).json({ msg: "Your password is reset successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const firstActivate = async (req, res) => {
  

  const { email, old_password, new_password, confirm_new_password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ msg: "incorrect credentials." });
      return;
    }
    const correctPassword = await bcrypt.compare(old_password, user.password);

    if (!correctPassword) {
      await handleAttempt(shortCode.email, shortCode.phone, req.ip);
      res.status(400).json({ msg: "incorrect credential." });
      return;
    }

    if (new_password !== confirm_new_password) {
      res
        .status(400)
        .json({ msg: "new password and confirm password don't match." });
      return;
    }
    if (moment(new Date()) >= moment(user.shortCodeExpirationDate)) {
      res.status(400).json({ msg: "Your code has expired." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);
    await User.update(
      {
        password: hashedPassword,
        activation: false,
        shortCode: null,
        shortCodeExpirationDate: null,
      },
      { where: { email } }
    );
    res.status(200).json({ msg: "Account activated successfully." });
  } catch (error) {
    
    res.status(400).json({ msg: "Account is not activated." });
  }
};

const login = async (req, res) => {
  
  let { email, password, phone, shortCode } = req.body;
  email = email.trim();
  //check if email is registered.
  try {
    //check if user can login  checkUserStatus by email, phone and Ip
    const isUserBlocked = await checkUserStatus(email, phone, req.ip);
    if (isUserBlocked == true) {
      return res.status(403).json({
        msg: "Account blocked due to repeated attempts. Please try again after 5 minutes.",
      });
    }

    let user = await User.findOne({ where: { email } });
    // check if user is found
    
    if (!user) {
      let phone = email.slice(-8);
      user = await User.findOne({
        where: { phone: { [Op.like]: `%${phone}` } },
      });
      await handleAttempt(email, phone, req.ip);

      if (!user) {
        const emailOrPhone = email ? email : phone;
        const loginAttempt = "incorrect credentials";
        const eventLog = await createEventLog(
          0,
          "Login attempt",
          emailOrPhone,
          0,
          loginAttempt
        );
        await handleAttempt(email, phone, req.ip);
        return res.status(401).json({ msg: "incorrect credentials." });
        // return;
      }
    }
    //if user is not activated
    if (!user.activated) {
      const userr = user ? user.id : 0;
      const emailOrPhone = email ? email : phone;
      const loginAttempt = "deactivated";
      const eventLog = await createEventLog(
        userr,
        "Login attempt",
        emailOrPhone,
        0,
        loginAttempt
      );
      return res.status(400).json({ msg: "You are deactivated." });
      // return;
    }
    const correctPassword = await bcrypt.compare(password, user.password);
    // incorrect password
    if (!correctPassword) {
      const userr = user ? user.id : 0;
      const emailOrPhone = email ? email : phone;
      const loginAttempt = "incorrect credentials";
      const eventLog = await createEventLog(
        userr,
        "Login attempt",
        emailOrPhone,
        0,
        loginAttempt
      );
      await handleAttempt(email, phone, req.ip);
      return res.status(400).json({ msg: "incorrect credentials." });
      // return;
    }
    if (shortCode && user.role == Role.customer) {
      if (!(user.shortCode == shortCode)) {
        return res.status(400).json({
          msg: "Incorrect activation code.",
          customerActivation: true,
        });
      } else {
        try {
          if (moment(new Date()) <= moment(user.shortCodeExpirationDate)) {
            const resp = email
              ? await User.update(
                { activation: false },
                { where: { email: email } }
              )
              : await User.update(
                { activation: false },
                { where: { phone: phone } }
              );
          } else {
            return res.status(400).json({ msg: "Activation code expired" });
          }
          const token = jwt.sign(
            {
              id: user.id,
              first_name: user.first_name,
              middle_name: user.middle_name,
              last_name: user.last_name,
              email: user.email,
              role: user.role,
              activated: user.activated,
              profile_picture: user.profile_picture,
            },
            process.env.SECRET_KEY,
            {
              expiresIn: "9h",
            }
          );



          // csrfToken = await getCsrf(res);
          // 
          // res.setHeader('X-CSRF-Token', req.cookies._csrf);
          // res.cookie('csrfToken', csrfToken, { httpOnly: true });
          return res.status(200).json({ userToken: token });
        } catch (error) {
          return res.status(400).json({
            msg: "Error activating account.",
          });
        }
      }
    }
    // if (user.activation) {
    //   const userr = user ? user.id : 0;
    //   const emailOrPhone = email ? email : phone;
    //   const loginAttempt = "First user activation";
    //   const eventLog = await createEventLog(
    //     userr,
    //     "Login attempt",
    //     emailOrPhone,
    //     0,
    //     loginAttempt
    //   );
    //   return res.status(400).json({
    //     msg: "You need to activate your account with the activation code sent to your email.",
    //     activation: true,
    //   });
    // }

    await activateUser(email, phone, req.ip);
    const token = jwt.sign(
      {
        id: user.id,
        first_name: user.first_name,
        middle_name: user.middle_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        activated: user.activated,
        profile_picture: user.profile_picture,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "9h",
      }
    );
    const userr = user && correctPassword ? user.id : 0;
    const emailOrPhone = email ? email : phone;
    const loginAttempt = user && correctPassword ? "Succeeded" : "Failed";

    const eventLog = await createEventLog(
      userr,
      "Login attempt",
      emailOrPhone,
      0,
      loginAttempt
    );
    // csrfToken = await getCsrf(res);
    // res.cookie('csrfToken', csrfToken, { httpOnly: true });
    // res.setHeader('X-CSRF-Token', csrfToken);
    
    return res
      .status(200)
      .json({ userToken: token });



    // return;
  } catch (error) {
    
    res.status(500).json({ msg: error.message });
    // return;
  }
};

const getSearch = (st) => {
  return {
    [Op.or]: [
      { first_name: { [Op.like]: `%${st}%` } },
      { middle_name: { [Op.like]: `%${st}%` } },
      { last_name: { [Op.like]: `%${st}%` } },
      { gender: { [Op.like]: `%${st}%` } },
      { role: { [Op.like]: `${st}%` } },
      { email: { [Op.like]: `%${st}%` } },
      { phone: { [Op.like]: `%${st}%` } },
    ],
  };
};

const getUsers = async (req, res) => {
  
  const { f, r, st, sc, sd, role } = req.query;
  const { showMode } = req.params;
  let data = [];
  
  try {
    if (showMode == 0) {
      let condition = {};
      if (role === Role.staff) {
        condition = {
          role: { [Op.or]: [Role.staff, "Agent", "Broker"] },
          activated: true,
        };
      }
      const includes = role === Role.staff ? [User, Group] : [User];
      data = await User.findAndCountAll({
        include: includes,
        distinct: true,
        offset: Number(f),
        limit: Number(r),
        attributes: [
          "id",
          "first_name",
          "middle_name",
          "last_name",
          "corporate_name",
          "email",
          "phone",
          "gender",
          "role",
          "activated",
          "activation",
          "profile_picture",
          "shortCode",
          "userId",
        ],
        order: [[sc || "first_name", sd == 1 ? "ASC" : "DESC"]],
        where: { ...getSearch(st), ...condition },
      });
      console.log("indasas",data)
    } else if (showMode == 1) {
      data = await User.findAndCountAll({
        include: User,
        offset: Number(f),
        limit: Number(r),
        order: [[sc || "first_name", sd == 1 ? "ASC" : "DESC"]],
        where: {
          ...getSearch(st),
          [Op.and]: [{ role: Role.staff }, { activated: true }],
        },
      });
    }
    res.status(200).json(data);
    console.log("yyyyyyy",data)

    
  } catch (error) {
    res.status(500);
  }
};

const getUserForPick = async (req, res) => {
  
  const { f, r, st, sc, sd } = req.query;
  try {
    let data = await User.findAndCountAll({
      include: [User, { model: Employee, required: true }],
      where: { activated: true },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500);
  }
};

const getCustomerUsers = async (req, res) => {
  try {
    let data = await User.findAll({
      include: [User],
      where: { role: Role.customer },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500);
  }
};

const getUsersForSharing = async (req, res) => {
  const userIds = req.body;
  try {
    if (req.user.role == "SuperAdmin" || req.user.role == "Staff") {
      const newarray = [];
      userIds.forEach((element) => {
        newarray.push(element.id);
      });
      const data = await User.findAll({
        where: { id: { [Op.notIn]: newarray } },
      });

      res.status(200).json(data);
    } else {
      res.status(401).json({ msg: "unauthorized access" });
    }
  } catch (error) {
    res.status(500);
  }
};

const accessControlLists = async (req, res) => {
  try {
    // 

    let { newPath } = req.params;
    newPath = newPath.replace("-", "/");
    //git acls
    const acls = await getAcls(req.user, newPath);
    const newAcl = {
      path: newPath,
      canRead: false,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      onlyMyBranch: false,
      onlySelf: false,
    };

    acls.forEach((accessControl) => {
      accessControl.canRead && (newAcl.canRead = true);
      accessControl.canCreate && (newAcl.canCreate = true);
      accessControl.canEdit && (newAcl.canEdit = true);
      accessControl.canDelete && (newAcl.canDelete = true);
      accessControl.onlyMyBranch && (newAcl.onlyMyBranch = true);
      accessControl.onlySelf && (newAcl.onlySelf = true);
    });

    

    res.status(200).json(newAcl);

    // const userGroups = await UserGroup.findAll({
    //   where: { userId: req.user.id },
    // });

    // userGroups.forEach(async (userGroup, index) => {
    //   const accessControl = await ACL.findOne({
    //     where: { path: newPath.replace("/", "-"), groupId: userGroup.groupId },
    //   });
    //   accessControl.canRead && (newAcl.canRead = true);
    //   accessControl.canCreate && (newAcl.canCreate = true);
    //   accessControl.canEdit && (newAcl.canEdit = true);
    //   accessControl.canDelete && (newAcl.canDelete = true);
    //   accessControl.onlyMyBranch && (newAcl.onlyMyBranch = true);
    //   accessControl.onlySelf && (newAcl.onlySelf = true);
    //   if (index == userGroups.length - 1) {
    //     
    //   }
    // });

    // const groupId = userGroups.length > 0 ? userGroups[0].groupId : 0;

    // const accessControls = await ACL.findOne({
    //   where: { path: newPath.replace("/", "-"), groupId },
    // });
    // 
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createUser = async (req, res) => {
  const {
    first_name,
    middle_name,
    last_name,
    email,
    gender,
    phone,
    password,
    role,
    activated,
    userId,
    profile_picture,
  } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const user = await User.create({
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      email: email,
      gender: gender,
      phone: phone,
      password: hashedPassword,
      role: role,
      activated: activated || true,
      userId: userId,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


const createUserFromContact = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    
    const { id } = req.body;

    const generatedPassword = String(
      Math.floor((Math.random() * 9 + 1) * Math.pow(10, 5))
    );
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);
    const contact = await Contact.findByPk(id)
    if (!contact) {
      await t.rollback();
      res.status(400).json({ msg: "Account not found" });
      return
    }
    let user
    console.log("the users area", contact)
    contact.type = "Individual"
    
    if (contact.status === "leads"){
      contact.type = "Individual"
    }
    
    if (contact.type === "Individual") {
      user = await User.create({
        first_name: contact.firstName,
        middle_name: contact.middleName,
        last_name: contact.lastName,
        email: contact.primaryEmail || null,
        gender: contact.gender,
        phone: contact.primaryPhone,
        password: hashedPassword,
        role: Role.customer,
        activated: true,
        userId: req.user.userId,
        activation: false
      },
        { transaction: t });
      }
      
    else {
      user = await User.create({
        corporate_name: contact.corporate_name,
        email: contact.primaryEmail || null,
        phone: contact.primaryPhone,
        password: hashedPassword,
        role: Role.customer,
        activated: true,
        userId: req.user.userId,
        activation: false
      },
        // { transaction: t }
        );

        

    }


    await contact.update({ accountId: user.userId });

    const { password, userId, activated, role,email, ...createdUser } = user;
    try {
      sendActivationEmail(
        email,
        email,
        generatedPassword,
        "Welcome to Zemen Insurance",
        user.activation
          ? "We would like to welcome to our crm. please use https://portal.zemeninsurance.com/newSignIn to login to our system. The activation credentials for accessing your account are"
          : "We would like to welcome to our crm. please use https://portal.zemeninsurance.com/newSignIn to login to our system. The credentials for accessing your account are:"
      );
    } catch (e) {
      await t.rollback();
      console.error("Error sending email:", e);
      return res.status(500).json({ msg: "Error sending email" });
    }


    const sms = smsFunction(
      contact.primaryPhone,
      user.activation
        ? `We would like to welcome to our crm. please use https://portal.zemeninsurance.com/newSignIn to login to our system. The activation credentials for accessing your account are - email: ${contact.primaryEmail}, password: ${generatedPassword}`
        : `We would like to welcome to our crm. please use https://portal.zemeninsurance.com/newSignIn to login to our system. The credentials for accessing your account are - email: ${contact.primaryEmail}, password: ${generatedPassword}`
    );

    if (sms == 0) {
      await t.rollback();
      console.error("Error sending SMS:");
      return res.status(500).json({ msg: "Error sending SMS" });
    }
    await t.commit();
    res.status(200).json(createdUser);
  } catch (error) {
    console.error("Error creating user:", error);

    await t.rollback();
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};




const createSystemUser = async (req, res) => {
  
  const {
    first_name,
    middle_name,
    last_name,
    email,
    gender,
    phone,
    role,

    userId,
  } = req.body;
  
  const user = await User.findOne({ where: { email } });
  // const phoneNos = await Contact.findOne({ where: { primaryPhone: phone } });
  if (user) {
    res.status(400).json({ msg: "User already exists" });
    return;
  }
  //generate password
  //add to the database, make the activation true.
  //send email
  const password = String(
    Math.floor((Math.random() * 9 + 1) * Math.pow(10, 5))
  );
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const user = await User.create({
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      email: email,
      gender: gender,
      phone: phone,
      password: hashedPassword,
      role: role,
      userId: userId,
      activated: true,
      activation: true,
    });
    
    if (user) {
      if (role == Role.customer) {
        await Contact.update(
          { accountId: user.id },
          { where: { primaryEmail: email } }
        );
      } else if (role == "Staff") {
        await Employee.update({ userId: user.id }, { where: { email: email } });
      } else if (role == "Agent") {
        
        await Agent.update(
          { accountId: user.id },
          { where: { primaryEmail: email } }
        );
      } else if (role == "Broker") {
        await Broker.update(
          { accountId: user.id },
          { where: { primaryEmail: email } }
        );
      }
      const emailBeforeAt = email.slice(0, email.indexOf("@"));
      const emailAfterAt = email.slice(email.indexOf("@"), email.length);
      const emailMessage =
        emailBeforeAt.charAt(0) +
        emailBeforeAt.charAt(1) +
        "**" +
        emailBeforeAt.charAt(emailBeforeAt.length - 2) +
        emailBeforeAt.charAt(emailBeforeAt.length - 1) +
        emailAfterAt;
      sendActivationEmail(
        email,
        first_name,
        password,
        "Welcome to Zemen Insurance",
        user.activation
          ? "We would like to welcome to our crm. please use https://portal.zemeninsurance.com/newSignIn to login to our system. The activation credentials for accessing your account are"
          : "We would like to welcome to our crm. please use https://portal.zemeninsurance.com/newSignIn to login to our system. The credentials for accessing your account are:"
      );
      smsFunction(
        phone,
        user.activation
          ? `We would like to welcome to our crm. please use https://portal.zemeninsurance.com/newSignIn to login to our system. The activation credentials for accessing your account are - email: ${emailMessage}, password: ${password}`
          : `We would like to welcome to our crm. please use https://portal.zemeninsurance.com/newSignIn to login to our system. The credentials for accessing your account are - email: ${emailMessage}, password: ${password}`
      );
    }
    res.status(200).json(user);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getUser = async (req, res) => {
  
  try {
    const user = await User.findByPk(req.params.id, {
      include: [User],
      attributes: { exclude: ["password"] },
    }).then(function (user) {
      if (!user) {
        res.status(400).json({ message: "No Data Found" });
      } else {
        res.status(200).json(user);
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSearchResults = async (req, res) => {
  const { key } = req.params;
  try {
    const user = await User.findAll({
      include: User,
      order: [["id", "ASC"]],
      where: {
        [Op.or]: [
          {
            first_name: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            middle_name: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            last_name: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            phone: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + key + "%",
            },
          },
          {
            gender: {
              [Op.like]: key + "%",
            },
          },
          {
            role: {
              [Op.like]: "%" + key + "%",
            },
          },
        ],
      },
    });
    if (!user) {
      res.status(400).json({ message: "No Data Found" });
    } else res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editUser = async (req, res) => {
  const {
    id,
    corporate_name,
    first_name,
    middle_name,
    last_name,
    email,
    gender,
    phone,
    role,
    profile_picture,
    activated,
    userId,
  } = req.body;
  
  
  const propic = req.file
    ? "uploads/employees/profile_pic/" + req.file.filename
    : profile_picture;
  try {
    if (id !== req.user.id && req.user.role != "SuperAdmin") {
      res.status(401).json({ msg: "unauthorized access" });
    } else {
      if (req.file)
        await User.update(
          {
            corporate_name,
            first_name: first_name,
            middle_name: middle_name,
            last_name: last_name,
            email: email,
            gender: gender,
            phone: phone,
            role: role,
            activated: activated,
            userId: userId,
            profile_picture: propic,
          },
          { where: { id: id } }
        );

      if (!req.file)
        await User.update(
          {
            corporate_name,
            first_name: first_name,
            middle_name: middle_name,
            last_name: last_name,
            email: email,
            gender: gender,
            phone: phone,
            role: role,
            activated: activated,
            userId: userId,
          },
          { where: { id: id } }
        );
      res.status(200).json({ id });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    
    const email = req.user.email;
    if (req.body.newPassword) {
      let user = await User.findOne({ where: { email } });
      const correctPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!correctPassword) {
        res.status(400).json({ msg: "incorrect credentials." });
        return;
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
        User.update(
          {
            password: hashedPassword,
          },
          { where: { id: user.id } }
        );
        res.status(200).json({ user });
      }
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// const deleteUser = async (req, res) => {
//   const id = req.params.id;
//   try {
//     User.destroy({ where: { id: id } });
//     UserGroup.destroy({ where: { userId: id } });
//     res.status(200).json({ id });
//   } catch (error) {
//     
//     res.status(400).json({ msg: error.message });
//   }
// };

const toggleActivation = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await User.findByPk(id);
    await User.update({ activated: !data.activated }, { where: { id: id } });
    res.status(200).json({ activated: !data.activated });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  signup,
  login,
  getting,
  getUsers,
  storeUser,
  getUser,
  getSearchResults,
  getCustomerUsers,
  createUser,
  editUser,
  changePassword,
  //deleteUser,
  getUsersForSharing,
  forgotPassword,
  resetPassword,
  getUserForPick,
  toggleActivation,
  confirmSMS,
  accessControlLists,
  createSystemUser,
  firstActivate,
  assignRole,
  signupCustomer,
  createUserFromContact
};
