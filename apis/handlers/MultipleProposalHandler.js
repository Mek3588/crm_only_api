const { Op } = require("sequelize");
const MultipleProposal = require("../../models/MultipleProposal");
// const {
//   canUserRead,
//   canUserCreate,
//   canUserEdit,
//   canUserDelete,
// } = require("../../utils/Authrizations");
const { eventResourceTypes, eventActions } = require("../../utils/constants");
const {
  createEventLog,
  getChangedFieldValues,
  getIpAddress,
} = require("../../utils/GeneralUtils");

const getMultipleProposal = async (req, res) => {
  
  try {
    // if (!(await canUserRead(req.user, "multipleProposals"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    
    const { f, r, st, sc, sd } = req.query;
    const data = await MultipleProposal.findAndCountAll({
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
      {
        requested_by: {
          [Op.like]: "%" + st + "%",
        },
      },
    ],
  };
};
//posting
const createMultipleProposal = async (req, res) => {
  const multipleProposalBody = req.body;
  try {
    // if (!(await canUserCreate(req.user, "multipleProposals"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const ducplicateCountry = await MultipleProposal.findAll({
      where: { requested_by: multipleProposalBody.requested_by },
    });
    if (ducplicateCountry.length > 0) {
      res.status(400).json({ msg: "MultipleProposal requested_by already used!" });
      return;
    }
    const multipleProposal = await MultipleProposal.create(multipleProposalBody);
    if (multipleProposal) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = await createEventLog(
        req.user.id,
        eventResourceTypes.multipleProposal,
        `${multipleProposal.requested_by} `,
        multipleProposal.id,
        eventActions.create,
        "",
        ipAddress
      );
    }
    res.status(200).json(multipleProposal);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getMultipleProposalByPk = async (req, res) => {
  try {
    // if (!(await canUserRead(req.user, "multipleProposals"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const multipleProposal = await MultipleProposal.findByPk(req.params.id, {}).then(
      function (multipleProposal) {
        if (!multipleProposal) {
          res.status(404).json({ message: "No Data Found" });
        } else if (multipleProposal) {
          let ipAddress = getIpAddress(req.ip);
          const eventLog = createEventLog(
            req.user.id,
            eventResourceTypes.multipleProposal,
            `${multipleProposal.requested_by} `,
            multipleProposal.id,
            eventActions.view,
            "",
            ipAddress
          );
          res.status(200).json(multipleProposal);
        }
      }
    );

    // res.status(200).json(multipleProposal);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editMultipleProposal = async (req, res) => {
  const multipleProposalBody = req.body;
  const id = req.params.id;

  try {
    // if (!(await canUserEdit(req.user, "multipleProposals"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    const duplicateName = await MultipleProposal.findAll({
      where: { requested_by: multipleProposalBody.requested_by },
    });
    if (duplicateName.length !== 0) {
      if (duplicateName[0].id !== multipleProposalBody.id) {
        res.status(400).json({ msg: "MultipleProposal requested_by already used!" });
        return;
      }
    }
    let oldDept = await MultipleProposal.findByPk(id, {});
    let dept = MultipleProposal.update(multipleProposalBody, {
      where: { id: id },
    });

    if (dept) {
      let newDept = await MultipleProposal.findByPk(id, {});
      let changedFieldValues = getChangedFieldValues(oldDept, newDept);
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.multipleProposal,
        newDept.requested_by,
        newDept.id,
        eventActions.edit,
        changedFieldValues,
        ipAddress
      );
    }

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteMultipleProposal = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!(await canUserDelete(req.user, "multipleProposals"))) {
    //   return res.status(401).json({ msg: "unauthorized access!" });
    // }
    let multipleProposal = await MultipleProposal.findByPk(id, {});
    let dept = await MultipleProposal.destroy({ where: { id: id } });
    if (dept) {
      let ipAddress = getIpAddress(req.ip);
      const eventLog = createEventLog(
        req.user.id,
        eventResourceTypes.multipleProposal,
        `${multipleProposal.requested_by} `,
        multipleProposal.id,
        eventActions.delete,
        "",
        ipAddress
      );
    }
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getMultipleProposal,
  createMultipleProposal,
  getMultipleProposalByPk,
  editMultipleProposal,
  deleteMultipleProposal,
};
