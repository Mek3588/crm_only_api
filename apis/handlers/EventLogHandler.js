const { Op } = require("sequelize");
const EventLog = require("../../models/EventLog");
const Employee = require("../../models/Employee");
// const {
//   canUserRead,
//   canUserCreate,
//   canUserEdit,
//   canUserDelete,
// } = require("../../utils/Authrizations");
const User = require("../../models/acl/user");
const Contact = require("../../models/Contact");
const { eventLogResourceMap } = require("../../utils/constants");

const getEventLogs = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "eventLogs"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const { f, r, st, sc, sd } = req.query;
    const data = await EventLog.findAndCountAll({
      include: [
        {
          model: User,
          as: "user",
        },
      ],
      offset: Number(f),
      limit: Number(r),
      order: sc
        ? [[sc, sd == 1 ? "ASC" : "DESC"]]
        : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
      where: getSearch(st),
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getSearch = (st) => {
  return {
    [Op.or]: [
      { "$user.first_name$": { [Op.like]: `%${st}%` } },
      { "$user.middle_name$": { [Op.like]: `%${st}%` } },
      { "$user.last_name$": { [Op.like]: `%${st}%` } },

      {
        resourceType: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        resourceName: {
          [Op.like]: "%" + st + "%",
        },
      },
      {
        action: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};

const getEventLogByPk = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "eventLogs"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const eventLog = await EventLog.findByPk(req.params.id, { raw: true });
    const user = await User.findByPk(eventLog.userId, { raw: true });

    if (!eventLog) {
      res.status(404).json({ message: "No Data Found" });
    }
    const resource = await eventLogResourceMap[eventLog.resourceType].findByPk(
      eventLog.resourceId,
      { raw: true }
    );
    
    // const { password, activated, activation, ...others } = user;

    let otherss = null;
    if (user) {
      const { password, activated, activation, ...others } = user;
      otherss = others;
    }
    res.status(200).json({ ...eventLog, user: otherss || {}, resource });
    // res.status(200).json({ ...eventLog, user: others, resource });
    // res.status(200).json(eventLog);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getEventLogs,
  getEventLogByPk,
};
