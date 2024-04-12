const ACL = require("../../models/acl/ACL");
const Group = require("../../models/acl/Group");

const getACLs = async (req, res) => {
  try {
    const data = await ACL.findAll({
      include: [Group],
    });
    res.status(200).json(data);
    //   data.map((d) => {
    //     const formatPath = d.path.replace("-", "/");
    //     return { ...d, path: formatPath };
    //   })
    // );
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createACL = async (req, res) => {
  const reqBody = req.body;
  
  const path = req.body.path;
  const formatPath = path.replace("/", "-");
  try {
    if (path === "") {
      const { pathes, groupId, canCreate, canEdit, canDelete, canRead, onlyMyBrach, onlySelf } =
        req.body;
      const entry = pathes.map((path) => {
        return {
          groupId,
          path: path.path,
          canCreate,
          canEdit,
          canDelete,
          canRead,
          onlyMyBrach,
          onlySelf
        };
      });
      await ACL.bulkCreate(entry);
    } else {
      const acl = await ACL.create({ ...reqBody, path: formatPath });
    }
    res.status(200).json({ msg: "successfully added." });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const createACLs = async (req, res) => {
  const reqBody = req.body;
  try {
    reqBody.map(async (acl) => {
      const path = acl.path;
      const formatPath = path.replace("/", "-");
      await ACL.create({ ...acl, path: formatPath });
    });
    res.status(200).json(reqBody);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const getACL = async (req, res) => {
  try {
    const acl = await ACL.findByPk(req.params.id, { include: [Group] }).then(
      function (acl) {
        if (!acl) {
          res.status(404).json({ message: "No Data Found" });
        }
        const formatPath = acl.path.replace("-", "/");
        res.status(200).json({ ...acl, path: formatPath });
      }
    );
    res.status(200).json(acl);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const fetchByGroupId = async (req, res) => {
  const { id } = req.params;
  
  try {
    const results = await ACL.findAll({
      where: { groupId: id },
      raw: true,
    });
    if (!results) {
      res.status(404).json({ message: "No Data Found" });
    } else {
      res.status(200).json(
        results.map((result) => {
          const formatPath = result.path.replace("-", "/");
          return { ...result, path: formatPath };
        })
      );
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editACL = async (req, res) => {
  const reqBody = req.body;
  
  const path = reqBody.path;
  const formatPath = path.replace("/", "-");
  const id = req.body.id;
  try {
    ACL.update({ ...reqBody, path: formatPath }, { where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

const deleteACL = async (req, res) => {
  const id = req.params.id;
  try {
    ACL.destroy({ where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = {
  getACL,
  fetchByGroupId,
  createACL,
  createACLs,
  getACLs,
  editACL,
  deleteACL,
};
