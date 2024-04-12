const Note = require("../../../models/contactActivity/Note");
const User = require("../../../models/acl/user");
const Customer = require("../../../models/Customer");
const CustomerActivityUpdate = require("../../../models/contactActivity/CustomerActivityUpdateHistory");

const getNote = async (req, res) => {
  try {
    const data = await Note.findAll({ include: [User] });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createNote = async (req, res) => {
  const noteBody = req.body;
  
  try {
    const note = await Note.create(noteBody);
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getNoteByUser = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Note.findAll({
      include: [User],
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

const getNoteByCustomer = async (req, res) => {
  const { target, id } = req.params;
  try {
    const data = await Note.findAll({
      include: [User],
      where: { targetId: id, target },
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

const getNoteByPk = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id, { include: [User] }).then(
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
    Note.update(note, { where: { id: id } });

    //Note updates
    if (note.target === "account") {
      if (savedNote.note !== note.note)
        await CustomerActivityUpdate.create({
          userId: req.user.id,
          contactId: savedNote.targetId,
          activity: "Note",
          attribute: "note",
          previous_status: savedNote.note,
          current_status: note.note,
        });

      //Comment updates
      if (savedNote.comment !== note.comment)
        await CustomerActivityUpdate.create({
          userId: req.user.id,
          contactId: savedNote.targetId,
          activity: "Note",
          attribute: "Comment",
          previous_status: savedNote.comment,
          current_status: note.comment,
        });
    }
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteNote = async (req, res) => {
  const id = req.params.id;

  try {
    Note.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getNoteByEmployee = async (req, res) => {
  
  const id = req.params.id;
  try {
    const data = await Note.findAll({
      include: [User],
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
  getNoteByCustomer,
  getNoteByEmployee,
  addEmployee,
};
