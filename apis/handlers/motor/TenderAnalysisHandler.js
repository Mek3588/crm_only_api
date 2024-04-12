const {Op} = require("sequelize");
const TenderAnalysis = require("../../../models/motor/claim/TenderAnalysis");

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
const getTenderAnalysis = async (req, res) => {
    try {
        const data = await TenderAnalysis.findAndCountAll({
            
        });
        
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json({ msg: error.message });
        
    }
}

const getTenderAnalysisByClaimNumber = async (req, res) => {
    const {claimNo} = req.query;
    
    try {
        const data = await TenderAnalysis.findAndCountAll({
            where: { claimNo: claimNo },
        });
        
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json({ msg: error.message });
        
    }
}

const getTenderAnalysisByBidId = async (req, res) => {
    const {bidId} = req.query;
    
    try {
        const data = await TenderAnalysis.findAndCountAll({
            where: { bidId: bidId },
        });
        
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json({ msg: error.message });
        
    }
}

const getTenderAnalysisByBidderId = async (req, res) => {
    const {bidderId} = req.query;
    
    try {
        const data = await TenderAnalysis.findAndCountAll({
            where: { bidderId: bidderId },
        });
        
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json({ msg: error.message });
        
    }
}

const createTenderAnalysis = async (req, res) => {
    const tenderAnalysisBody = req.body;
    
    try {
        const data = await TenderAnalysis.create(tenderAnalysisBody);
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json({ msg: error.message });
        
    }

}

const updateTenderAnalysis = async (req, res) => {
    const tenderAnalysisBody = req.body;
    
    try {
        const data = await TenderAnalysis.update(tenderAnalysisBody, { where: { id: tenderAnalysisBody.id } });
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json({ msg: error.message });
        
    }

}

const deleteTenderAnalysis = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await TenderAnalysis.destroy({ where: { id: id } });
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json({ msg: error.message });
        
    }

}

module.exports = {
    getTenderAnalysis,
    getTenderAnalysisByClaimNumber,
    getTenderAnalysisByBidId,
    getTenderAnalysisByBidderId,
    createTenderAnalysis,
    updateTenderAnalysis,
    deleteTenderAnalysis
}