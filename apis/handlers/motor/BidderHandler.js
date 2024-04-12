const { Op } = require('sequelize');
const Bidder = require('../../../models/motor/claim/Bidder');
const {
  canUserAccessOnlyBranch,
  canUserRead,
  canUserCreate,
  canUserEdit,
  canUserDelete,
  canUserAccessOnlySelf,
} = require('../../../utils/Authrizations');

const getSearch = (st) => {
    return {
        [Op.or]: [],
    };
    }

const getBidder = async (req, res) => {
    try {
        const data = await Bidder.findAndCountAll({
           
        });
        
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json({ msg: error.message });
        
    }
}

const getBidderByClaimNumber = async (req, res) => {
    const {claimNo} = req.query;
    
    try {
        const data = await Bidder.findAndCountAll({
            where: { claimNo: claimNo },
        });
        
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json({ msg: error.message });
        
    }
}

const getBidderByBidId = async (req, res) => {
    const {bidId} = req.query;
    
    try {
        const data = await Bidder.findAndCountAll({
            where: { bidId: bidId },
        });
        
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json({ msg: error.message });
        
    }
}

const createBidder = async (req, res) => {
    const bidderBody = req.body;
    
    try {
        const data = await Bidder.create(bidderBody);
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json({ msg: error.message });
        
    }
}

const editBidder = async (req, res) => {
    const { id } = req.params;
    const bidderBody = req.body;
    
    try {
        const data = await Bidder.update(bidderBody, { where: { id: id } });
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json({ msg: error.message });
        
    }
}

const deleteBidder = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Bidder.destroy({ where: { id: id } });
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json({ msg: error.message });
        
    }
}

module.exports = {
    getBidder,
    getBidderByClaimNumber,
    getBidderByBidId,
    createBidder,
    editBidder,
    deleteBidder,
};