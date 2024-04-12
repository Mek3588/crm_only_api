const { Op } = require("sequelize");
const ProposalComment = require("../../../models/proposals/ProposalComment");

const getProposalComment = async (req, res) => {
    try {
        const {  proposalId } = req.query;
        const data = await ProposalComment.findAll({
        });
        
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
    }

const getSearch = (st) => {
    return {
        [Op.or]: [
        {
            comment: {
            [Op.like]: "%" + st + "%",
            },
        },
        ],
    };
}

const createProposalComment = async (req, res) => {
    const proposalCommentBody = req.body;
    try {
        const data = await ProposalComment.create(proposalCommentBody);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
    };

const updateProposalComment = async (req, res) => {
    const proposalCommentBody = req.body;
    try {
        const data = await ProposalComment.update(proposalCommentBody, {
        where: { id: req.params.id },
        });
        res.status(200).json(data);
    }catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

const deleteProposalComment = async (req, res) => {
    const proposalCommentBody = req.body;
    try {
        const data = await ProposalComment.destroy({
        where: { id: req.params.id },
        });
        res.status(200).json(data);

    }catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

module.exports = {
    getProposalComment,
    createProposalComment,
    updateProposalComment,
    deleteProposalComment
};
