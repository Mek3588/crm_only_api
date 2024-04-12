const {Op} = require("sequelize");
const EngineeringRecommendationSurveyRequest = require("../../../models/motor/claim/EngineeringRecommendationSurveyRequest");
const ClaimNotification = require("../../../models/motor/claim/ClaimNotification");

const getSearch = (st) => {
    return {
        [Op.or]: [
            {claimNumber: {[Op.like]: `%${st}%`}},
            {plateNumber: {[Op.like]: `%${st}%`}},
            {vehicleType: {[Op.like]: `%${st}%`}},
            {yearOfManufacture: {[Op.like]: `%${st}%`}},
    ]
};
};


const getEngineeringRecommendationSurveyRequest = async (req, res) => {
    const { f, r, st, sc, sd } = req.query;

    try {
        const data = await EngineeringRecommendationSurveyRequest.findAndCountAll({
            offset: Number(f),
            limit: Number(r),
            order: [[sc || "createdAt", sd == 1 ? "DESC" : "ASC"]],
            subQuery: false,
            where: getSearch(st),
        });

        console.log("servery",data)
        
        return res.status(200).json(data);

    }catch (error) {
       return res.status(400).json({ msg: error.message });
    }
}

const getEngineeringRecommendationSurveyRequestByPk = async (req, res) => {
    try {
        const EngineeringRecommendationSurveyRequest = await EngineeringRecommendationSurveyRequest.findByPk(req.params.id).then(function (
            EngineeringRecommendationSurveyRequest
        ) {
            if (!EngineeringRecommendationSurveyRequest) {
                res.status(404).json({ message: "No Data Found" });
            }
            res.status(200).json(EngineeringRecommendationSurveyRequest);
        });

        res.status(200).json(EngineeringRecommendationSurveyRequest);
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
}

const getEngineeringRecommendationSurveyRequestById = async (req, res) => {
    const id = req.params.id;

    try {

        const data = await EngineeringRecommendationSurveyRequest.findByPk(id);
        console.log("engineering data", data);
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json({msg: error.message});
        
    }

}

const createEngineeringRecommendationSurveyRequest = async (req, res) => {
    const surveyBody = req.body;
    console.log("serveyData",surveyBody)

    try {
        const data = await EngineeringRecommendationSurveyRequest.create(surveyBody);
        
        return res.status(200).json(data);
    }catch (error) {
        console.log("error",error.message)
        return res.status(400).json({ msg: error.message });
    }
}

const editEngineeringRecommendationSurveyRequest = async (req, res) => {
    const surveyBody = req.body;
    const id = req.params.id;

    try {
        
        EngineeringRecommendationSurveyRequest.update(
            surveyBody,

            { where: { id: id } }
        );

        res.status(200).json({ id });
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
}

const deleteEngineeringRecommendationSurveyRequest = async (req, res) => {
    const id = req.params.id;

    try {
        EngineeringRecommendationSurveyRequest.destroy({ where: { id: id } });

        res.status(200).json({ id });
    } catch (error) {
        res.status(404).json({ msg: error.message });
    }
}

module.exports = {
    getEngineeringRecommendationSurveyRequest,
    getEngineeringRecommendationSurveyRequestByPk,
    getEngineeringRecommendationSurveyRequestById,
    createEngineeringRecommendationSurveyRequest,
    editEngineeringRecommendationSurveyRequest,
    deleteEngineeringRecommendationSurveyRequest
};