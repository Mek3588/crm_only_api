const {Op} = require("sequelize");
const PoliceReport = require("../../../models/motor/claim/PoliceReport");
const ClaimNotification = require("../../../models/motor/claim/ClaimNotification");
const InjuredPeople = require("../../../models/motor/claim/InjuredPeople");


const getSearch = (st) => {
    return {
        [Op.or]: [
            {claimNumber: {[Op.like]: `%${st}%`}},
            {plateNumber: {[Op.like]: `%${st}%`}},
            {accidentDate: {[Op.like]: `%${st}%`}},
            {accidentTime: {[Op.like]: `%${st}%`}},
            {accidentRegion: {[Op.like]: `%${st}%`}},
            {accidentCity: {[Op.like]: `%${st}%`}},
            {accidentKebele: {[Op.like]: `%${st}%`}},
            {accidentSpecificLocation: {[Op.like]: `%${st}%`}},
            {accidentType: {[Op.like]: `%${st}%`}},
            {accidentCause: {[Op.like]: `%${st}%`}},
            {accidentDescription: {[Op.like]: `%${st}%`}},
            {driverFirstName: {[Op.like]: `%${st}%`}},
            {driverMiddleName: {[Op.like]: `%${st}%`}},
            {driverLastName: {[Op.like]: `%${st}%`}},
            {driverLicenseNumber: {[Op.like]: `%${st}%`}},
        ],
    };
}

const getPoliceReport = async (req, res) => {
    const { f, r, st, sc, sd, purpose } = req.query;
    
    try {
        const data = await PoliceReport.findAndCountAll({
            offset: Number(f),
            limit: Number(r),
            order: [["createdAt", "DESC"]],
        });
        
        res.status(200).json(data);
        
    } catch (error) {
        
        res.status(400).json({msg: error.message});
        
    }

}

const getPoliceReportByClaimNumber = async (req, res) => {
    const claimNo = req.params.claimNumber;
    
    try {
        const data = await PoliceReport.findOne({
            where: {claimNumber: claimNo},
        });
        
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json({msg: error.message});
        
    }
}

const getPoliceReportById = async (req, res) => {
    const id = req.params.id;
    
    try {
        const data = await PoliceReport.findOne({
            include: [
                { model: InjuredPeople }
            ],
            where: {id: id},
        });
        
        res.status(200).json(data);
        
    } catch (error) {
        
        res.status(400).json({msg: error.message});
        
    }
}

const getPoliceReportByPlateNumber = async (req, res) => {
    const {plateNumber} = req.query;
    
    try {
        const data = await PoliceReport.findAndCountAll({
            where: {plateNumber: plateNumber},
        });
        
        res.status(200).json(data);
        
    } catch (error) {
        
        res.status(400).json({msg: error.message});
        
    }
}

const createPoliceReport = async (req, res) => {
   const policeReportBody = req.body;
   let policeReport;
   let newPoliceReport;
   let injuredPeople = [];

   console.log("policeReportBody -----", policeReportBody)
    try {
        policeReport = await PoliceReport.create(policeReportBody);
        if(policeReportBody.injuredPeople && policeReportBody.injuredAnimal){
            const { injuredPeople } = { ...policeReportBody }
            const { injuredAnimal } = { ...policeReportBody }

            const injured_people = injuredPeople.map((injuredPeople) => {
                return { ...injuredPeople, 
                    policeReportId: policeReport.id }
            })
            const injured_animal = injuredAnimal.map((injuredAnimal) => {
                return { ...injuredAnimal, 
                    policeReportId: policeReport.id }
            })
            console.log("injured_people -----", injured_people)

            newPoliceReport = { ...policeReportBody, 
                injuredPeople: injured_people,
                injuredAnimal: injured_animal }
        }else if(policeReportBody.injuredPeople){
            const { injuredPeople } = { ...policeReportBody }
            const injured_people = injuredPeople.map((injuredPeople) => {
                return { ...injuredPeople, 
                    policeReportId: policeReport.id }
            })
            console.log("injured_people -----", injured_people)

            newPoliceReport = { ...policeReportBody, 
                injuredPeople: injured_people }
        }else if(policeReportBody.injuredAnimal){
            const { injuredAnimal } = { ...policeReportBody }
            const injured_animal = injuredAnimal.map((injuredAnimal) => {
                return { ...injuredAnimal, 
                    policeReportId: policeReport.id }
            })
            console.log("injured_animal -----", injured_animal)

            newPoliceReport = { ...policeReportBody, 
                injuredAnimal: injured_animal }
        }
        

        if(newPoliceReport.injuredPeople && newPoliceReport.injuredAnimal){
            injuredPeople.push(await InjuredPeople.bulkCreate(newPoliceReport.injuredPeople));
            injuredPeople.push(await InjuredPeople.bulkCreate(newPoliceReport.injuredAnimal));
        }
        else if (newPoliceReport.injuredPeople){
            injuredPeople.push(await InjuredPeople.bulkCreate(newPoliceReport.injuredPeople));
        }
        else if (newPoliceReport.injuredAnimal){
            injuredPeople.push(await InjuredPeople.bulkCreate(newPoliceReport.injuredAnimal));
        }

        console.log("newPoliceReport", newPoliceReport)

        // if(injuredPeople.length !== 0){
        //     let newPoliceReport; 
        //     let injuredPeopleIds = [];

        //     console.log("injuredPeople", injuredPeople)

        //     injuredPeopleIds = injuredPeople
        //         .flat()
        //         .filter(injuredPeople => { return injuredPeople })
        //         .map(injuredPeople => injuredPeople.id);

        //     newPoliceReport = { ...policeReportBody, 
        //         injuredPeopleId: injuredPeopleIds.join(", ") }
        //     console.log("newPoliceReport", newPoliceReport, injuredPeopleIds)

        //     policeReport = await PoliceReport.create(newPoliceReport);
        // }else{
        //     policeReport = await PoliceReport.create(policeReportBody);
        // }

        const response = {
            policeReport: policeReport,
            injuredPeople: injuredPeople
        };

        res.status(200).json(response);
    } catch (error) {
        
        res.status(400).json({msg: error.message});
        
    }
}

const updatePoliceReport = async (req, res) => {
    const policeReportBody = req.body;
    try {
        const updatePoliceReport = await PoliceReport.update(policeReportBody, {
            where: {id: policeReportBody.id},
        });
        res.status(200).json(updatePoliceReport);
    } catch (error) {
        
        res.status(400).json({msg: error.message});
        
    }
}

const deletePoliceReport = async (req, res) => {
    const {id} = req.params;
    try {
        const deletePoliceReport = await PoliceReport.destroy({
            where: {id: id},
        });
        res.status(200).json(deletePoliceReport);
    } catch (error) {
        
        res.status(400).json({msg: error.message});
        
    }
}

const getInjuredPeople = async (req, res) => {
    const {id} = req.params;
    try {
        const data = await InjuredPeople.findAndCountAll({
            where: { policeReportId: id },
        });
        
        res.status(200).json(data);
        
    } catch (error) {
        
        res.status(400).json({msg: error.message});
        
    }

}

module.exports = {
    getPoliceReport,
    getPoliceReportByClaimNumber,
    getPoliceReportById,
    getPoliceReportByPlateNumber,
    createPoliceReport,
    updatePoliceReport,
    deletePoliceReport,
    getInjuredPeople,
}