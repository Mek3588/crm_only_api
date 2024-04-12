const Meeting = require("../../../models/contactActivity/ContactMeeting");
const User = require("../../../models/acl/user");
const Contact = require("../../../models/Contact");
const { json, Op } = require("sequelize");
const { changeDateFormat } = require("../../../utils/GeneralUtils");
const { sendWelcomeEmail } = require("../../handlers/EmailServiceHandler");
const { smsFunction } = require("../../handlers/SMSServiceHandler");
const ContactActivityUpdate = require("../../../models/contactActivity/ContactActivityUpdateHistory");
const SharedMeeting = require("../../../models/SharedMeeting");
const { Role } = require("../../../utils/constants");
const CompanyContact = require("../../../models/CompanyContact");
const Opportunity = require("../../../models/Opportunity");
const { meetingStatus } = require("../../../utils/constants");
const { type } = require("express/lib/response");
const moment = require("moment");
const {
  createEventLog,
  getIpAddress,
  getChangedFieldValues,
} = require("../../../utils/GeneralUtils");
const {
  eventResourceTypes,
  eventActions,
} = require("../../../utils/constants");
const getAssignmentCondition = async (user) => {
  const { role, id } = user;
  let condition = {};
  if (role === Role.sales || role === Role.agent) {
    condition = { [Op.or]: [{ assignedTo: id }, { "$shares.id$": id }] };
  } else if (role === Role.branchManager) {
    let branchId = await Employee.findOne({ where: { userId: user.id } })
      .branchId;
    condition = { branchId };
  }
  return condition;
};

const getMeeting = async (req, res) => {
  

  let condition = await getAssignmentCondition(req.user);
  try {
    const data = await Meeting.findAll({
      include: [
        User,
        {
          model: User,
          as: "shares",
        },
      ],
      where: { ...condition },
      order: [["id", "DESC"]],
      subQuery: false,
    });
    
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createMeeting = async (req, res) => {
  const meetingBody = req.body;
  let {
    startDate,
    startTime,
    dueDate,
    dueTime,
    subject,
    assignedTo,
    outCome,
    type,
  } = meetingBody;
  startDate = new Date(startDate);
  startDate.setDate(startDate.getDate() + 1);
  startTime = new Date(startTime);
  startTime.setHours(startTime.getHours() + 3);
  dueDate = new Date(dueDate);
  dueDate.setDate(dueDate.getDate() + 1);
  dueTime = new Date(dueTime);
  dueTime.setHours(dueTime.getHours() + 3);

  
  try {
    const meeting = await Meeting.create(meetingBody);
    if (meeting) {
      let contact = null;
      if (meetingBody.target == "account") {
        contact = await Contact.findByPk(meetingBody.targetId);
      } else if (meetingBody.target == "companyContacts") {
        contact = await CompanyContact.findByPk(meetingBody.targetId);
      } else if (meetingBody.target == "opportunity") {
        const opportunity = await Opportunity.findByPk(meetingBody.targetId);
        contact = await Contact.findByPk(opportunity.accountId);
      }
      const user = await User.findByPk(meetingBody.assignedTo);
      //   const name =
      //     contact.type === "Inddivdual"
      //       ? +contact.first_name + " " + contact.middle_name
      //       : contact.company_name;
      const date = new Date(meetingBody.startDate);
      const meetingDate =
        date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
      const time = new Date(meetingBody.startTime);
      //   const googleMeetingDate =
      //     date.getFullYear() +
      //     "" +
      //     (date.getMonth() + 1 < 9
      //       ? "0" + (date.getMonth() + 1).toString()
      //       : (date.getMonth() + 1).toString()) +
      //     "" +
      //     (date.getDate() < 10
      //       ? "0" + date.getDate().toString()
      //       : date.getDate().toString());
      //   const gooogleMeetingTime =
      //     time.getHours() - 1 + "" + time.getMinutes() + "" + time.getSeconds();
      const meetngTime = time.getHours() + ":" + time.getMinutes();
      //   var link =
      //     `https://calendar.google.com/calendar/render?action=TEMPLATE&text=` +
      //     meeting.outCome +
      //     `&dates=` +
      //     googleMeetingDate +
      //     `T` +
      //     gooogleMeetingTime +
      //     `Z%2Fundefined`;
      //   finalMeetlink = link.replace(/ /g, "");
      //   
      contact = contact.dataValues;
      
      let name = "Customer";
      
      name =
        contact.status == "leads"
          ? contact.firstName
          : contact.type == "Corporate"
            ? contact.companyName
            : `${contact.firstName} ${contact.middleName} ${contact.lastName} `;
      const { sharedWith } = req.body;
      const toAdd =
        sharedWith &&
        sharedWith.map((element) => {
          return { meetingId: meeting.id, userId: element };
        });
      const sharedWiths = await SharedMeeting.bulkCreate(toAdd);
      const sharedUsers = await User.findAll({
        where: { id: { [Op.in]: sharedWith } },
      });
      if (user) {
        sendWelcomeEmail(
          contact.primaryEmail,
          name,
          `You have a ${type} with Zemen!`,
          `Dear ${name},
                    you will have a ${type} from  ${moment(startDate).format(
            "ll"
          )} : ${startTime.toString().slice(16, 21)} to ${moment(
            dueDate
          ).format("ll")} : ${dueTime
            .toString()
            .slice(16, 21)} with our employee
                    ${user.first_name + " " + user.middle_name} about ${meetingBody.subject
          } ${meetingBody.url ? "using this link: " + meetingBody.url : ""}.`
          // + ` To add the event to your calendar, ` + `${finalMeetlink}`
        );

        smsFunction(
          contact.primaryPhone,
          `Dear ${name}, you will have a ${type} from  ${moment(
            startDate
          ).format("ll")} : ${startTime.toString().slice(16, 21)} to ${moment(
            dueDate
          ).format("ll")} : ${dueTime
            .toString()
            .slice(16, 21)} with our employee ${user.first_name + " " + user.middle_name
          } about ${meetingBody.subject} ${meetingBody.url ? "using this link: " + meetingBody.url : ""
          }.`
        );
        sendWelcomeEmail(
          user.email,
          user.first_name + " " + user.middle_name + " " + user.last_name,
          "You have a ${type} with Zemen!",
          `Dear ${user.first_name + " " + user.middle_name + " " + user.last_name
          },
                  you will have a ${type} from  ${moment(startDate).format(
            "ll"
          )} : ${startTime.toString().slice(16, 21)} to ${moment(
            dueDate
          ).format("ll")} : ${dueTime.toString().slice(16, 21)}  with
                  ${name} about ${meetingBody.subject} ${meetingBody.url ? "using this link: " + meetingBody.url : ""
          }.`
          // + ` To add the event to your calendar, ` + `${finalMeetlink}`
        );

        smsFunction(
          user.phone,
          `Dear ${user.first_name + " " + user.middle_name + " " + user.last_name
          }, you will have a ${type} from  ${moment(startDate).format(
            "ll"
          )} : ${startTime.toString().slice(16, 21)} to ${moment(
            dueDate
          ).format("ll")} : ${dueTime
            .toString()
            .slice(16, 21)} with ${name} about ${meetingBody.subject} ${meetingBody.url ? "using this link: " + meetingBody.url : ""
          }.`
        );
      }
      sharedUsers.forEach((user) => {
        sendWelcomeEmail(
          user.email,
          user.first_name + " " + user.middle_name + " " + user.last_name,
          "You have a ${type} with Zemen!",
          `Dear ${user.first_name + " " + user.middle_name + " " + user.last_name
          },
                you will have a ${type} from  ${moment(startDate).format(
            "ll"
          )} : ${startTime.toString().slice(16, 21)} to ${moment(
            dueDate
          ).format("ll")} : ${dueTime.toString().slice(16, 21)}  with
                ${name} about ${meetingBody.subject} ${meetingBody.url ? "using this link: " + meetingBody.url : ""
          }.`
          // + ` To add the event to your calendar, ` + `${finalMeetlink}`
        );

        smsFunction(
          user.phone,
          `Dear ${user.first_name + " " + user.middle_name + " " + user.last_name
          }, you will have a ${type} from  ${moment(startDate).format(
            "ll"
          )} : ${startTime.toString().slice(16, 21)} to ${moment(
            dueDate
          ).format("ll")} : ${dueTime
            .toString()
            .slice(16, 21)} with ${name} about ${meetingBody.subject} ${meetingBody.url ? "using this link: " + meetingBody.url : ""
          }.`
        );
      });
    }
    const foundMeeting = await Meeting.findByPk(meeting.id);
    const value =
      foundMeeting.target == "account" || foundMeeting.target == "lead"
        ? await Contact.findByPk(foundMeeting.targetId)
        : foundMeeting.target == "opportunity"
          ? await Opportunity.findByPk(foundMeeting.targetId)
          : await CompanyContact.findByPk(foundMeeting.targetId);
    const name =
      foundMeeting.target == "account" || foundMeeting.target == "lead"
        ? value.firstName ?? value.companyName
        : foundMeeting.target == "opportunity"
          ? value.subject
          : value.firstName;

    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.meeting,
      name,
      value.id,
      eventActions.create,
      "",
      ipAddress
    );
    res.status(200).json(meeting);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const getMeetingByPk = async (req, res) => {
  try {
    const meeting = await Meeting.findByPk(req.params.id, {
      include: [
        User,
        {
          model: User,
          as: "shares",
          attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']
        },
      ],
      subQuery: false,
    }).then(function (Meeting) {
      if (!Meeting) {
        res.status(400).json({ message: "No Data Found" });
      } else {
        res.status(200).json(Meeting);
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getNotificationAmount = async (req, res) => {
  try {
    const { userId } = req.params;
    const date = new Date();

    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    
    let targetIdd = 0;
    req.user.role === Role.customer &&
      (targetIdd = await Contact.findOne({ userId }).id);
    
    const meetings = await Meeting.findAll({
      include: [
        {
          model: User,
          as: "shares",
          attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']
        },
        {
          model: Contact,
          as: "contact",
          include: {
            model: User,
            as: "shares",
            attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']
          },
        },
      ],
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                userId: { [Op.like]: userId }
              },
              {
                "$shares.id$": { [Op.like]: userId },
              },
              {
                assignedTo: { [Op.like]: userId },
              },
              // { targetId: targetIdd },
            ],
          },
          {
            status: { [Op.in]: ["Planned", "Postponed"] },
            // startDate: {
            //   [Op.gt]: TODAY_START,
            //   [Op.lt]: NOW,
            // },
          },
        ],
      },
      order: [["id", "DESC"]],

      subQuery: false,
    });
    const todayMeetings = [];
    meetings.forEach((meeting) => {
      const meetingDate = meeting ? meeting.startDate : null;
      
      
      const meetingStartDate = new Date(meetingDate);
      meetingStartDate.setDate(meetingStartDate.getDate() + 1);
      if (changeDateFormat(date) == changeDateFormat(new Date(meetingDate))) {
        todayMeetings.push(meeting);
      }
    });
    
    res.status(200).json(todayMeetings);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};
const editMeeting = async (req, res) => {
  const meetingBody = req.body;
  
  let {
    startDate,
    startTime,
    dueDate,
    dueTime,
    subject,
    assignedTo,
    outCome,
    type,
  } = meetingBody;
  startDate = new Date(startDate);
  startDate.setDate(startDate.getDate() + 1);
  startTime = new Date(startTime);
  dueTime = new Date(dueTime);
  dueDate = new Date(dueDate);
  startTime.setHours(startTime.getHours() + 3);
  dueDate.setDate(dueDate.getDate() + 1);
  dueTime.setHours(dueTime.getHours() + 3);
  const id = req.body.id;
  try {
    const savedMeeting = await Meeting.findByPk(id);
    const editedMeeting = await Meeting.update(meetingBody, {
      where: { id: id },
    });

    const { sharedWith } = req.body;
    const sharedUsers = await User.findAll({
      where: { id: { [Op.in]: sharedWith } },
    });
    SharedMeeting.destroy({ where: { meetingId: req.body.id } });
    const toAdd =
      sharedWith &&
      sharedWith.map((element) => {
        return { meetingId: req.body.id, userId: element };
      });
    SharedMeeting.bulkCreate(toAdd);

    //meeting Outcome history
    if (meetingBody.subject !== savedMeeting.subject)
      await ContactActivityUpdate.create({
        userId: req.user.id,
        contactId: savedMeeting.targetId,
        activity: savedMeeting.type === "task" ? "Task" : "Meeting",
        attribute: "Subject",
        previous_status: savedMeeting.subject,
        current_status: meetingBody.subject,
      });

    // //meeting Date history
    if (
      new Date(meetingBody.startDate).toISOString() !=
      new Date(savedMeeting.startDate).toISOString()
    )
      await ContactActivityUpdate.create({
        userId: req.user.id,
        contactId: savedMeeting.targetId,
        activity: savedMeeting.type === "task" ? "Task" : "Meeting",
        attribute: "Date",
        previous_status: new Date(savedMeeting.startDate).toISOString(),
        current_status: new Date(meetingBody.startDate).toISOString(),
      });

    //meeting time history
    if (
      new Date(meetingBody.startTime).toISOString() !=
      new Date(savedMeeting.startTime).toISOString()
    )
      await ContactActivityUpdate.create({
        userId: req.user.id,
        contactId: savedMeeting.targetId,
        activity: savedMeeting.type === "task" ? "Task" : "Meeting",
        attribute: "Time",
        previous_status: new Date(savedMeeting.startTime).toISOString(),
        current_status: new Date(savedMeeting.startTime).toISOString(),
      });

    //meeting status history
    if (meetingBody.status !== savedMeeting.status) {
      let contact = null;
      const { target, targetId } = meetingBody;

      if (target == "account") {
        contact = await Contact.findByPk(targetId);
      } else if (target == "opportunity") {
        const opportunity = await Opportunity.findByPk(targetId);
        contact = Contact.findByPk(opportunity.accountId);
      } else if (target == "companyContacts") {
        contact = CompanyContact.findByPk(targetId);
      }
      contact = contact.dataValues;
      let user = await User.findByPk(assignedTo);
      
      const status = meetingBody.status;
      let name = "Customer";
      name =
        contact.status == "leads"
          ? contact.firstName
          : (contact.type = "Corporate"
            ? contact.companyName
            : `${contact.firstName} ${contact.middleName} ${contact.lastName} `);
      switch (status) {
        case meetingStatus.planned:
        case meetingStatus.happened:
        case meetingStatus.postponed:
          if (user) {
            smsFunction(
              contact.primaryPhone,
              `Dear ${name}, The ${type == "meeting" ? "meeting" : "task"
              } with the subject "${subject}" is ${status} to be conducted from  ${moment(
                startDate
              ).format("ll")} : ${startTime.slice(11, 16)} to ${moment(
                dueDate
              ).format("ll")} : ${dueTime.slice(11, 16)} with our employee ${user.first_name + " " + user.middle_name + " " + user.last_name
              }.`
            );

            sendWelcomeEmail(
              contact.primaryEmail,
              name,
              `You have a ${type == "meeting" ? "meeting" : "task"
              } with Zemen!`,
              `Dear ${name}, The ${type == "meeting" ? "meeting" : "task"
              } with the subject "${subject}" is ${status} to be conducted from  ${moment(
                startDate
              ).format("ll")} : ${startTime.slice(11, 16)} to ${moment(
                dueDate
              ).format("ll")} : ${dueTime.slice(11, 16)} with our employee ${user.first_name + " " + user.middle_name + " " + user.last_name
              }.`
              // + ` To add the event to your calendar, ` + `${finalMeetlink}`
            );

            smsFunction(
              user.phone,
              `Dear ${user.first_name + " " + user.middle_name + " " + user.last_name
              }, The ${type == "meeting" ? "meeting" : "task"
              } with the subject " ${subject}" is ${status} to be conducted from  ${moment(
                startDate
              ).format("ll")} : ${startTime.slice(11, 16)} to ${moment(
                dueDate
              ).format("ll")} : ${dueTime.slice(11, 16)} with ${name}.`
            );
            sendWelcomeEmail(
              user.email,
              user.first_name + " " + user.middle_name + " " + user.last_name,
              `You have a ${type == "meeting" ? "meeting" : "task"
              } with Zemen!`,
              `Dear ${user.first_name + " " + user.middle_name + " " + user.last_name
              }, The ${type == "meeting" ? "meeting" : "task"
              } with the subject " ${subject}" is ${status} to be conducted from  ${moment(
                startDate
              ).format("ll")} : ${startTime.slice(11, 16)} to ${moment(
                dueDate
              ).format("ll")} : ${dueTime.slice(11, 16)} with ${name}.`
              // + ` To add the event to your calendar, ` + `${finalMeetlink}`
            );
          }
          sharedUsers.forEach((user) => {
            smsFunction(
              user.phone,
              `Dear ${user.first_name + " " + user.middle_name + " " + user.last_name
              }, The ${type == "meeting" ? "meeting" : "task"
              } with the subject " ${subject}" is ${status} to be conducted from  ${moment(
                startDate
              ).format("ll")} : ${startTime.slice(11, 16)} to ${moment(
                dueDate
              ).format("ll")} : ${dueTime.slice(11, 16)} with ${name}.`
            );
            sendWelcomeEmail(
              user.email,
              user.first_name + " " + user.middle_name + " " + user.last_name,
              `You have a ${type == "meeting" ? "meeting" : "task"
              } with Zemen!`,
              `Dear ${user.first_name + " " + user.middle_name + " " + user.last_name
              }, The ${type == "meeting" ? "meeting" : "task"
              } with the subject " ${subject}" is ${status} to be conducted from  ${moment(
                startDate
              ).format("ll")} : ${startTime.slice(11, 16)} to ${moment(
                dueDate
              ).format("ll")} : ${dueTime.slice(11, 16)} with ${name}.`
              // + ` To add the event to your calendar, ` + `${finalMeetlink}`
            );
          });
          break;

        case meetingStatus.cancelled:
          smsFunction(
            contact.primaryPhone,
            `Dear ${name}, The ${type == "meeting" ? "meeting" : "task"
            } with the subject " ${subject}" is cancelled`
          );
          sendWelcomeEmail(
            contact.primaryEmail,
            name,
            `You have a ${type == "meeting" ? "meeting" : "task"} with Zemen!`,
            `Dear ${name}, The ${type == "meeting" ? "meeting" : "task"
            } with the subject " ${subject}" is cancelled.`
            // + ` To add the event to your calendar, ` + `${finalMeetlink}`
          );
          smsFunction(
            user.phone,
            `Dear ${user.first_name + " " + user.middle_name + " " + user.last_name
            }, The ${type == "meeting" ? "meeting" : "task"
            } with the subject " ${subject}" is cancelled`
          );
          sendWelcomeEmail(
            user.email,
            user.first_name + " " + user.middle_name + " " + user.last_name,
            `You have a ${type == "meeting" ? "meeting" : "task"} with Zemen!`,
            `Dear ${user.first_name + " " + user.middle_name + " " + user.last_name
            }, The ${type == "meeting" ? "meeting" : "task"
            } with the subject " ${subject}" is cancelled.`
            // + ` To add the event to your calendar, ` + `${finalMeetlink}`
          );
          sharedUsers.forEach((user) => {
            smsFunction(
              user.phone,
              `Dear ${user.first_name + " " + user.middle_name + " " + user.last_name
              }, The ${type == "meeting" ? "meeting" : "task"
              } with the subject " ${subject}" is cancelled`
            );
            sendWelcomeEmail(
              user.email,
              user.first_name + " " + user.middle_name + " " + user.last_name,
              `You have a ${type == "meeting" ? "meeting" : "task"
              } with Zemen!`,
              `Dear ${user.first_name + " " + user.middle_name + " " + user.last_name
              }, The ${type == "meeting" ? "meeting" : "task"
              } with the subject " ${subject}" is cancelled.`
              // + ` To add the event to your calendar, ` + `${finalMeetlink}`
            );
          });
          break;
      }
      await ContactActivityUpdate.create({
        userId: req.user.id,
        contactId: savedMeeting.targetId,
        activity: savedMeeting.type === "task" ? "Task" : "Meeting",
        attribute: "Status",
        previous_status: savedMeeting.status,
        current_status: meetingBody.status,
      });
    }
    //meeting note history
    if (meetingBody.description !== savedMeeting.description)
      await ContactActivityUpdate.create({
        userId: req.user.id,
        contactId: savedMeeting.targetId,
        activity: savedMeeting.type === "task" ? "Task" : "Meeting",
        attribute: "Note",
        previous_status: savedMeeting.description,
        current_status: meetingBody.description,
      });
    const foundMeeting = await Meeting.findByPk(savedMeeting.id);
    
    

    const changedFieldValues = getChangedFieldValues(
      savedMeeting,
      foundMeeting
    );
    
    const value =
      foundMeeting.target == "account" || foundMeeting.target == "lead"
        ? await Contact.findByPk(foundMeeting.targetId)
        : foundMeeting.target == "opportunity"
          ? await Opportunity.findByPk(foundMeeting.targetId)
          : await CompanyContact.findByPk(foundMeeting.targetId);
    const name =
      foundMeeting.target == "account" || foundMeeting.target == "lead"
        ? value.firstName ?? value.companyName
        : foundMeeting.target == "opportunity"
          ? value.subject
          : value.firstName;

    
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.meeting,
      name,
      value.id,
      eventActions.edit,
      changedFieldValues,
      ipAddress
    );
    res.status(200).json({ id });
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

const deleteMeeting = async (req, res) => {
  const id = req.params.id;

  try {
    foundMeeting = await Meeting.findByPk(id);
    const value =
      foundMeeting.target == "account" || foundMeeting.target == "lead"
        ? await Contact.findByPk(foundMeeting.targetId)
        : foundMeeting.target == "opportunity"
          ? await Opportunity.findByPk(foundMeeting.targetId)
          : await CompanyContact.findByPk(foundMeeting.targetId);
    const name =
      foundMeeting.target == "account" || foundMeeting.target == "lead"
        ? value.firstName ?? value.companyName
        : foundMeeting.target == "opportunity"
          ? value.subject
          : value.firstName;

    await Meeting.destroy({ where: { id: id } });

    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.meeting,
      name,
      value.id,
      eventActions.delete,
      "",
      ipAddress
    );

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getMeetingByContact = async (req, res) => {
  let condition = await getAssignmentCondition(req.user);
  const { target, id, type } = req.params;
  const { f, r, st, sc, sd } = req.query;

  
  try {
    const data = await Meeting.findAndCountAll({
      include: [
        User,
        { model: User, as: "assignedUser", attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender'] },
        {
          model: User,
          as: "shares",
          attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']
        },
      ],
      where: { targetId: id, target, ...condition, type },
      offset: Number(f),
      limit: Number(r),
      order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
      // where: getSearch(st),
      subQuery: false,

    });
    
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
module.exports = {
  getMeeting,
  createMeeting,
  getMeetingByPk,
  editMeeting,
  deleteMeeting,
  getMeetingByContact,
  getNotificationAmount,
};
