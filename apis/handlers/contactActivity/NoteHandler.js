const Note = require("../../../models/contactActivity/Note");
const User = require("../../../models/acl/user");
const Contact = require("../../../models/Contact");
const ContactActivityUpdate = require("../../../models/contactActivity/ContactActivityUpdateHistory");
const {
  createEventLog,
  getIpAddress,
  getChangedFieldValues,
} = require("../../../utils/GeneralUtils");
const {
  Role,
  eventResourceTypes,
  eventActions,
} = require("../../../utils/constants");
const Opportunity = require("../../../models/Opportunity");
const CompanyContact = require("../../../models/CompanyContact");
const getNote = async (req, res) => {
  try {
    const data = await Note.findAll({
      include: [{
        model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']
      }]
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createNote = async (req, res) => {
  const noteBody = req.body;
  try {
    const note = await Note.create(noteBody);

    const foundNote = await Note.findByPk(note.id);
    const value =
      foundNote.target == "account" || foundNote.target == "lead"
        ? await Contact.findByPk(foundNote.targetId)
        : foundNote.target == "opportunity"
          ? await Opportunity.findByPk(foundNote.targetId)
          : await CompanyContact.findByPk(foundNote.targetId);
    const name =
      foundNote.target == "account" || foundNote.target == "lead"
        ? value.firstName ?? value.companyName
        : foundNote.target == "opportunity"
          ? value.subject
          : value.firstName;

    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.note,
      name,
      value.id,
      eventActions.create,
      "",
      ipAddress
    );
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getNoteByUser = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Note.findAll({
      include: [{
        model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']
      }],
      where: { userId: id },
      order: [
        ["id", "DESC"],
        ["createdDate", "ASC"],
      ],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getNoteByContact = async (req, res) => {
  const { target, id } = req.params;
  const { f, r, st, sc, sd } = req.query;


  try {
    const data = await Note.findAndCountAll({
      include: [{
        model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']
      }],
      where: { targetId: id, target },
      // order: [
      //   ["id", "DESC"],
      //   ["createdDate", "ASC"],
      // ],

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

const getNoteByPk = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id, {
      include: [{
        model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']
      }]
    }).then(
      function (Note) {
        if (!Note) {
          res.status(400).json({ message: "No Data Found" });
        } else {
          res.status(200).json(Note);
        }
      }
    );
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editNote = async (req, res) => {
  const note = req.body;
  const id = req.body.id;

  try {
    

    const savedNote = await Note.findByPk(id);
    await Note.update(note, { where: { id: id } });
    const updatedNote = await Note.findByPk(id);
    if (note.target === "account") {
      if (savedNote.note !== note.note)
        await ContactActivityUpdate.create({
          userId: req.user.id,
          contactId: savedNote.targetId,
          activity: "Note",
          attribute: "note",
          previous_status: savedNote.note,
          current_status: note.note,
        });

      //Comment updates
      if (savedNote.comment !== note.comment)
        await ContactActivityUpdate.create({
          userId: req.user.id,
          contactId: savedNote.targetId,
          activity: "Note",
          attribute: "Comment",
          previous_status: savedNote.comment,
          current_status: note.comment,
        });
    }
    const value =
      updatedNote.target == "account" || updatedNote.target == "lead"
        ? await Contact.findByPk(updatedNote.targetId)
        : updatedNote.target == "opportunity"
          ? await Opportunity.findByPk(updatedNote.targetId)
          : await CompanyContact.findByPk(updatedNote.targetId);
    const name =
      updatedNote.target == "account" || updatedNote.target == "lead"
        ? value.firstName ?? value.companyName
        : updatedNote.target == "opportunity"
          ? value.subject
          : value.firstName;

    //Note updates
    const changedFieldValues = getChangedFieldValues(savedNote, updatedNote);
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.note,
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

const deleteNote = async (req, res) => {
  const id = req.params.id;

  try {
    const foundNote = await Note.findByPk(id);
    const value =
      foundNote.target == "account" || foundNote.target == "lead"
        ? await Contact.findByPk(foundNote.targetId)
        : foundNote.target == "opportunity"
          ? await Opportunity.findByPk(foundNote.targetId)
          : await CompanyContact.findByPk(foundNote.targetId);
    const name =
      foundNote.target == "account" || foundNote.target == "lead"
        ? value.firstName ?? value.companyName
        : foundNote.target == "opportunity"
          ? value.subject
          : value.firstName;

    await Note.destroy({ where: { id: id } });
    let ipAddress = await getIpAddress(req.ip);
    const eventLog = await createEventLog(
      req.user.id,
      eventResourceTypes.note,
      name,
      value.id,
      eventActions.delete,
      "",
      ipAddress
    );
    // const foundNote = await Note.findByPk({ id: id });
    // const contact = await Contact.findByPk({ id: foundNote.targe });

    await Note.destroy({ where: { id: id } });
    // let ipAddress = await getIpAddress(req.ip);
    // const eventLog = await createEventLog(
    //   req.user.id,
    //   eventResourceTypes.contactNote,
    //   contact.firstName ?? contact.companyName,
    //   contact.id,
    //   eventActions.delete,
    //   "",
    //   ipAddress
    // );
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getNoteByEmployee = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Note.findAll({
      include: [{
        model: User, attributes: ['id', 'corporate_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'gender']
      }],
      where: { reportTo: id },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const addEmployee = async (req, res) => {
  const note = req.body;
  const id = req.body.id;

  try {
    const notes = await Note.update(note, { where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getNote,
  createNote,
  getNoteByPk,
  getNoteByUser,
  editNote,
  deleteNote,
  getNoteByContact,
  getNoteByEmployee,
  addEmployee,
};
