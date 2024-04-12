const Branch = require("../../models/Branch");
const User = require("../../models/acl/user");
const Corporations = require("../../models/Corporation");
const { Role, ContactStatus } = require("../../utils/constants");
const {isEmailValid, isPhoneNoValid} = require("../../utils/GeneralUtils");

const fetchCorporates = async (user, status) => {
  switch (user.role) {
    case Role.admin:
      return status === "all"
        ? await Corporations.findAll({ include: [Branch, User] })
        : status === ContactStatus.prospect
        ? await Corporations.findAll({
            include: [Branch, User],
            where: { status: ContactStatus.prospect },
          })
        : await Corporations.findAll({
            include: [Branch, User],
            where: { status: ContactStatus.opportunity },
          });

    case Role.sales:
      return await Corporations.findAll({
        include: [Branch, User],
        where: { userId: user.id },
      });

    default:
      return await Corporations.findAll({
        include: [Branch, User],
        where: { userId: user.id },
      });
  }
};

const fetchProspects = async (user) => {
  switch (user.role) {
    case Role.admin:
      return await Corporations.findAll({
        include: [Branch, User],
        where: { status: ContactStatus.prospect },
      });

    case Role.sales:
      return await Corporations.findAll({
        include: [Branch, User],
        where: { userId: user.id, status: ContactStatus.prospect },
      });

    default:
      return await Corporations.findAll({
        include: [Branch, User],
        where: { userId: user.id, status: ContactStatus.prospect },
      });
  }
};

const fetchLeads = async (user) => {
  switch (user.role) {
    case Role.admin:
      return await Corporations.findAll({
        include: [Branch, User],
        where: { status: ContactStatus.lead },
      });

    case Role.sales:
      return await Corporations.findAll({
        include: [Branch, User],
        where: { userId: user.id, status: ContactStatus.lead },
      });

    default:
      return await Corporations.findAll({
        include: [Branch, User],
        where: { userId: user.id, status: ContactStatus.lead },
      });
  }
};

const fetchOppotunities = async (user) => {
  switch (user.role) {
    case Role.admin:
      return await Corporations.findAll({
        include: [Branch, User],
        where: { status: ContactStatus.opportunity },
      });

    case Role.sales:
      return await Corporations.findAll({
        include: [Branch, User],
        where: { userId: user.id, status: ContactStatus.opportunity },
      });

    default:
      return await Corporations.findAll({
        include: [Branch, User],
        where: { userId: user.id, status: ContactStatus.opportunity },
      });
  }
};

const getCorporations = async (req, res) => {
  try {
    const { status } = req.params;
    
    const data = await fetchCorporates(req.user, status);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getProspectCorporations = async (req, res) => {
  try {
    const data = await fetchProspects(req.user, { include: [Branch, User] });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getLeadCorporations = async (req, res) => {
  try {
    const data = await fetchLeads(req.user, { include: [Branch, User] });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const getOpportunityCorporations = async (req, res) => {
  try {
    const data = await fetchOppotunities(req.user, { include: [Branch, User] });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
//posting
const createCorporation = async (req, res) => {
  const corporationsBody = req.body;
  const {email,phone} = req.body
  try {
    if (!isEmailValid(corporationsBody.email)) {
      res.status(400).json({ msg: "invalid email" });
      return;
    }
    if (!isPhoneNoValid(corporationsBody.phone)) {
      res.status(400).json({ msg: "Invalid phone number" });
      return;
    }
    const getByEmail = await Corporations.findOne({ where: { email } });
    if (getByEmail == null) {
      const contact = await Corporations.create(corporationsBody);
      res.status(200).json(contact);
    } else {
      res.status(409).json({ msg: "Coporate already exists" });
    }
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const getCorporation = async (req, res) => {
  try {
    const contact = await Corporations.findByPk(req.params.id, {
      include: [Branch, User],
    }).then(function (contact) {
      if (!contact) {
        res.status(404).json({ message: "No Data Found" });
      }
      res.status(200).json(contact);
    });

    res.status(200).json(contact);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const editCorporation = async (req, res) => {
  const corporationsBody = req.body;
  const id = corporationsBody.id;
  try {
    if (!isEmailValid(corporationsBody.email)) {
      res.status(400).json({ msg: "invalid email" });
      return;
  }
  if (!isPhoneNoValid(corporationsBody.phone)){
    res.status(400).json({msg: "Invalid phone number"});
    return;
  }
    Corporations.update(corporationsBody, { where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteCorporation = async (req, res) => {
  const id = req.params.id;
  try {
    Corporations.destroy({ where: { id: id } });

    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getCorporations,
  getProspectCorporations,
  getOpportunityCorporations,
  createCorporation,
  getCorporation,
  editCorporation,
  deleteCorporation,
  getLeadCorporations,
};
