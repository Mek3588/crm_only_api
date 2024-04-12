const { Op } = require("sequelize");
const DocumentCategory = require("../../models/DocumentCategory");
const User = require("../../models/acl/user");

const getSearch = (st) => {
  return {
    [Op.or]: [{ name: { [Op.like]: `%${st}%` } }],
  };
};

const getAllCategory = async (req, res) => {
  const { f, r, st, sc, sd } = req.query;
  try {
    const data = await DocumentCategory.findAndCountAll({
      include: [User],
      offset: Number(f),
      limit: Number(r),
      order:
        sc && sc == "user.name"
          ? [["user", "first_name", sd == 1 ? "ASC" : "DESC"]]
          : sc
          ? [[sc, sd == 1 ? "ASC" : "DESC"]]
          : [["createdAt", sd == 1 ? "DESC" : "ASC"]],
      where: getSearch(st),
      subQuery: false,
    });
    res.status(200).json(data);
  } catch (error) {
    
    res.status(400).json({ msg: error.message });
  }
};

//posting
const createCategory = async (req, res) => {
  const categoryBody = req.body;
  try {
    const addedCategories = await DocumentCategory.findOne({
      where: { name: { [Op.like]: categoryBody.name } },
    });
    if (addedCategories == null) {
      const category = await DocumentCategory.create(categoryBody);
      res.status(200).json(category);
    } else {
      res.status(400).json({ msg: "The category exists" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const createCategories = async (req, res) => {
  const categoryBody = req.body;
  const userId = req.user.id;
  var addedList = 0;
  var duplicate = 0;
  try {
    let promises = await categoryBody.map(async (category) => {
      let addedCategories = await DocumentCategory.findOne({
        where: { name: { [Op.like]: category.name } },
      });
      if (addedCategories == null) {
        category.userId = userId;
        try {
          let newCategories = await DocumentCategory.create(category).then(
            (e) => {
              addedList += 1;
            }
          );
        } catch (error) {
          duplicate += 1;
          res.status(400).json({ msg: error.message });
        }
      } else {
        duplicate += 1;
      }
    });
    Promise.all(promises).then(function (results) {
      let msg = "";
      if (addedList != 0) {
        msg = msg + `${addedList} document categories added`;
      }
      if (duplicate != 0) {
        
        msg = msg + ` ${duplicate} duplicate found`;
        
      }
      if (duplicate != 0) {
        res.status(400).json({ msg: msg });
      } else {
        res.status(200).json({ msg: msg });
      }
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getCategoryByPk = async (req, res) => {
  try {
    const category = await DocumentCategory.findByPk(req.params.id).then(
      (category) => {
        if (!category) {
          res.status(400).json({ message: "No Data Found" });
        } else {
          res.status(200).json(category);
        }
      }
    );
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const editCategory = async (req, res) => {
  const reqBody = req.body;
  try {
    const updatedData = await DocumentCategory.update(reqBody, {
      where: { id: reqBody.id },
    });
    res.status(200).json({ updatedData });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const id = req.params.id;

  try {
    await DocumentCategory.destroy({ where: { id: id } });
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const data = await DocumentCategory.findAll({ include: [User] });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getAllCategory,
  createCategory,
  createCategories,
  getCategoryByPk,
  editCategory,
  deleteCategory,
  getAllCategories,
};
