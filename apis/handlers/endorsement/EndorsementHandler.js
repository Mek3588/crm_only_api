const Endorsement = require("../../../models/endorsement/Endorsement");
const { Op } = require("sequelize");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const { eventResourceTypes, eventActions, EndorsementFiles, vehicleTypes } = require("../../../utils/constants");
const {
    createEventLog,
    getChangedFieldValues,
    getIpAddress,
    printPdf,
    generateNumber
} = require("../../../utils/GeneralUtils");
const CoverRate = require("../../../models/CoverRate");
const Proposal = require("../../../models/proposals/Proposal");
const Quotation = require("../../../models/Quotation");
const Addons = require("../../../models/motor/Addons");
const Country = require("../../../models/Country");
const TerritorialExtension = require("../../../models/TerritorialExtension");
const MotorProposal = require("../../../models/proposals/MotorProposal");
const { MotorCoverType, goods_carrying } = require("../../../utils/constants");
const Policy = require("../../../models/Policy");
const Contact = require("../../../models/Contact");
const Branch = require("../../../models/Branch");
const EndorsementFilesPath = require("../../../models/endorsement/EndorsementFilesPath");
const Vehicle = require("../../../models/motor/Vehicle");
const FinanceData = require("../../../models/FinanceData");

// const fs = require('fs');
const htmlToDocx = require('html-docx-js');
const LimitedCoverRate = require("../../../models/motor/LimitedCoverRate");

const getSearch = (st) => {
    return {
        [Op.or]: [
            // { name: { [Op.like]: `%${st}%` } },
            // { shortCode: { [Op.like]: `%${st}%` } },
            // { description: { [Op.like]: `%${st}%` } },
        ],
    };
};

const getEndorsement = async (req, res) => {
    const { f, r, st, sc, sd } = req.query;
    try {
        const data = await Endorsement.findAndCountAll({
            offset: Number(f),
            limit: Number(r),
            order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
            // where: getSearch(st),
            // include: [CoverRate]
        });

        res.status(200).json(data);
    } catch (error) {

        res.status(400).json({ msg: error.message });
    }
};



const getEndorsementByProposalId = async (req, res) => {
    const { f, r, st, sc, sd } = req.query;
    try {
        const proposal = await Proposal.findByPk(id, { include: [Quotation] })
        if (proposal == null) {
            res.status(400).json({ message: "Proposal not found!!!" });
        }
        // proposal.quotation.CoverRate.
        const data = await Endorsement.findAndCountAll({
            offset: Number(f),
            limit: Number(r),
            order: [[sc || "createdAt", sd == 1 ? "ASC" : "DESC"]],
            where: getSearch(st),
            include: []
        });

        res.status(200).json(data);
    } catch (error) {

        res.status(400).json({ msg: error.message });
    }
};

const getAllEndorsements = async (req, res) => {
    try {
        const data = await Endorsement.findAndCountAll();
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

//posting
const createEndorsement = async (req, res) => {
    const endorsementBody = req.body;
    try {

        // const duplicateEndorsementName = await Endorsement.findAll({
        //     where: { name: endorsementBody.name },
        // });
        // if (duplicateEndorsementName.length > 0) {
        //     res.status(400).json({ msg: "Endorsement already registered!" });
        //     return;
        // }
        endorsementBody.userId = req.user.id
        endorsementBody.filePath = EndorsementFiles[endorsementBody.fileName];

        const endorsement = await Endorsement.create(endorsementBody);
        if (endorsement) {
            await createEventLog(
                req.user.id,
                eventResourceTypes.endorsement,
                `${endorsement.name}`,
                endorsement.id,
                eventActions.create,
                "",
                getIpAddress(req.ip)
            );
        }
        res.status(200).json(endorsement);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

const getAllFile = async (req, res) => {
    try {
        const key = Object.keys(EndorsementFiles)
        res.status(200).json({ endorsements: key });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
}


// const createEndorsements = async (req, res) => {
//     const endorsementBody = req.body;
//     const endorsement = [];
//     var duplicate = [];
//     var incorrect = [];
//     var lineNumber = 2;
//     try {
//         if (!(await canUserCreate(req.user, "endorsements"))) {
//             return res.status(401).json({ msg: "unauthorized access!" });
//         }

//         var promises = endorsementBody.map(async (element) => {
//             const duplicateName = await Endorsement.findAll({
//                 where: { name: element.name },
//             });
//             if (duplicateName.length > 0) {
//                 duplicate.push(lineNumber);
//             } else if (duplicateName.length == 0) {
//                 // endorsement.push(await Endorsement.create(element));
//                 try {
//                     await Endorsement.create(element);
//                     addedEndorsements += 1;
//                 } catch (error) {
//                     incorrect.push(lineNumber);
//                 }
//             }
//             lineNumber = lineNumber + 1;
//         });
//         Promise.all(promises).then(function (results) {
//             let msg = "";
//             if (addedEndorsements != 0) {
//                 msg = msg + `${addedEndorsements} countries added`;
//             }
//             if (incorrect.length != 0) {
//                 msg = msg + ` line ${incorrect} has incorrect values`;
//             }
//             if (duplicate != 0) {
//                 msg = msg + ` ${duplicate} duplicate found`;
//             }
//             if (duplicate.length != 0 || incorrect.length != 0) {
//                 res.status(400).json({ msg: msg });
//             } else {
//                 res.status(200).json({ msg: msg });
//             }
//         });
//         // const endorsement = await Endorsement.create(endorsementBody);
//         // res.status(200).json(endorsement);
//     } catch (error) {
//         res.status(400).json({ msg: error.message });
//     }
// };

const getEndorsementByPk = async (req, res) => {
    try {
        const endorsement = await Endorsement.findByPk(req.params.id).then(function (
            endorsement
        ) {
            if (!endorsement) {
                res.status(404).json({ message: "No Data Found" });
            }
            res.status(200).json(endorsement);
        });

        res.status(200).json(endorsement);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// const getEndorsementByName = async (req, res) => {
//     try {
//         

//         const endorsement = await Endorsement.findOne({ where: { name: req.params.name } });
//         
//         res.status(200).json(endorsement.id);
//     } catch (error) {
//         res.status(400).json({ msg: error.message });
//     }
// };

const editEndorsement = async (req, res) => {
    const reqBody = req.body;
    const id = req.params.id;
    try {
        let oldEndorsement = await Endorsement.findByPk(id, {});
        reqBody.filePath = EndorsementFiles[reqBody.fileName];
        let updated = await Endorsement.update(reqBody, { where: { id: id } });

        if (updated) {
            let newEndorsement = await Endorsement.findByPk(id, {});
            let changedFieldValues = getChangedFieldValues(oldEndorsement, newEndorsement)
            await createEventLog(
                req.user.id,
                eventResourceTypes.endorsement,
                `${oldEndorsement.endorsement}`,
                newEndorsement.id,
                eventActions.edit,
                changedFieldValues,
                getIpAddress(req.ip)
            );

        }

        res.status(200).json({ id });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

const deleteEndorsement = async (req, res) => {
    const id = req.params.id;
    try {
        let endorsement = await Endorsement.findByPk(id);
        let deleted = await Endorsement.destroy({ where: { id: id } });
        if (deleted) {
            await createEventLog(
                req.user.id,
                eventResourceTypes.endorsement,
                `${endorsement.name}`,
                endorsement.id,
                eventActions.delete,
                "",
                getIpAddress(req.ip)
            );
        }
        res.status(200).json({ id });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

const generateEndorsementNumber = async (branchId) => {
    let endorsementNo
    let lastEndorsement = await EndorsementFilesPath.findOne({ order: [["id", "DESC"]], where: { isWarranty: null } });
    if (lastEndorsement == null || !lastEndorsement.endorsementNo) {
        const branch = await Branch.findByPk(branchId);
        const branchAbr = branch.short_code.toUpperCase()
        endorsementNo = `ZI/${branchAbr}/MTR/0000/${new Date().getMonth() + 1
            }/${new Date().getFullYear().toString().slice(2)}`;

    }
    else {
        endorsementNo = await generateNumber(lastEndorsement.endorsementNo)
        


    }
    
    return endorsementNo
}


const createEndorsementByProposal = async (proposalId, policyNo, policyId, status) => {
    try {
        var check = moment();
        const day = check.format('DD') // => ('Monday' , 'Tuesday' ----)
        const month = check.format('MMMM') // => ('January','February.....)
        const year = check.format('YYYY') // => ('2012','2013' ...)  
        
        const monthAndYear = `${month},${year}`
        const proposal = await Proposal.findByPk(proposalId, {
            include: [
                {
                    model: MotorProposal,
                    include:
                        [{
                            model: Quotation,
                            include:
                                [{
                                    model: Addons,
                                    include: [
                                        { model: TerritorialExtension, as: "territorialExtension" },
                                        { model: CoverRate, as: "coverRate" },
                                    ],
                                },
                                { model: Vehicle },
                                { model: FinanceData }

                                ]
                        },
                        ]
                }, { model: Policy },
                { model: Contact, include: { model: Branch } }]
        })

        const policy = await Policy.findOne({
            where: { proposalId: proposal.id}
        })


        // `ZI/${proposal.contact.branch.short_code}/MPR/${new Date().getMonth() + 1}/${new Date().getFullYear().toString().slice(2)}`;
        const name = proposal.contact
            ? proposal.contact.type == "Corporate"
                ? proposal.contact.companyName
                : proposal.contact.type == "Join Individual"
                    ? proposal.contact.joinIndividualName
                    : proposal.contact.type == "Individual"
                        ? proposal.contact.firstName + " " + proposal.contact.middleName + " " + proposal.contact.lastName ?? ''
                        : ""
            : ""

        // 
        const effective = moment(proposal.effectiveFrom);

        const effectiveFromDay = effective.format('dddd') // => ('Monday' , 'Tuesday' ----)
        const effectiveFromMonth = effective.format('MMMM') // => ('January','February.....)
        const effectiveFromYear = effective.format('YYYY') // => ('2012','2013' ...)  
        const effectiveFromMonthYear = `${effectiveFromMonth},${effectiveFromYear}`


        const separated = proposal.motor_proposal.quotation.duration.split(" ");
        const number = separated[0];
        const secondWord = separated[1];
        const firstLetter = secondWord.charAt(0).toLowerCase();
        

        // const effectiveToDuration = moment(proposal.motor_proposal.quotation.duration)
        const effectiveToDuration = moment(proposal.effectiveFrom)

        const added = effectiveToDuration.add(number, firstLetter)
        const effectiveTo = moment(added)
        const effectiveToDay = effectiveTo.format('DD') // => ('Monday' , 'Tuesday' ----)
        const effectiveToMonth = effectiveTo.format('MMMM') // => ('January','February.....)
        const effectiveToYear = effectiveTo.format('YYYY') // => ('2012','2013' ...)  

        const effectiveToMonthYear = `${effectiveToMonth},${effectiveToYear}`

        // Effective end date
        const effectiveToDate = moment(proposal.effectiveFrom).subtract(1, 'days').add(1, "years");
        const effectiveToEndYear = effectiveToDate.format("YYYY")
        const effectiveToEndMonth = effectiveToDate.format("MMMM")
        const effectiveToEndDay = effectiveToDate.format("DD")

        const effectiveYear = moment(proposal.effectiveFrom).format("YYYY")
        const effectiveMonth = moment(proposal.effectiveFrom).format("MMMM")
        const effectiveDay = moment(proposal.effectiveFrom).format("DD")

        
        // const pol = await Proposal
        if (proposal && proposal.motor_proposal.quotation && proposal.motor_proposal.quotation.addons) {
            console.log("addons ==", proposal.motor_proposal.quotation.addons);

            await Promise.all(
                proposal.motor_proposal.quotation.addons.map(async (e) => {
                    

                    if (e?.coverRate?.coverType == MotorCoverType.ownDamage) {
                        const fileName = MotorCoverType.ownDamage   

                    }
                    if (e?.coverRate?.coverType == MotorCoverType.thirdParty) {
                        const fileName = MotorCoverType.thirdParty

                    }
                    if (e?.coverRate?.coverType == MotorCoverType.comprehensive) {
                        const fileName = MotorCoverType.comprehensive

                    }
                    if (e?.coverRate?.coverType == MotorCoverType.territorialExtension) {
                        const fileName = MotorCoverType.territorialExtension
                        let endorsementNo = await generateEndorsementNumber(proposal.contact.branchId)
                        const html = fs.readFileSync(path.join(__dirname, "./../../../templates/endorsement/own_damage/Territorial-Extension-Endorsement.html"),
                            "utf8"
                        );

                        const filePath = "/print_files/" + Date.now() + ".pdf";
                        const territorialExtension = {
                            endorsementNo: endorsementNo,
                            fullName: name,
                            policyNo: policyNo,
                            place: e.territorialExtension.country,
                            coverType: e?.coverRate?.coverType,
                            effectiveFromDay: effectiveFromDay,
                            effectiveFromMonth: effectiveFromMonth,
                            effectiveFromYear: effectiveFromYear,
                            effectiveFromMonthYear: effectiveFromMonthYear,
                            effectiveToMonthYear: effectiveToMonthYear,
                            effectiveToDay: effectiveToDay,

                            // effectiveToDay: effectiveToDay,
                            // effectiveToMonth: effectiveToMonth,
                            // effectiveToYear: effectiveToYear,
                            // from: `${effectiveFromDay},${effectiveFromMonthYear}`,
                            // to: `${effectiveToDay},${effectiveToYear}`,

                            makeOfVehicle: proposal.motor_proposal.quotation.vehicle.makeOfVehicle,
                            vehicleType: proposal.motor_proposal.quotation.vehicle_type,
                            plateNumber: proposal.motor_proposal.plateNumber,
                            chassisNo: proposal.motor_proposal.chassisNo,
                            engineNo: proposal.motor_proposal.engineNo,
                            cc: proposal.motor_proposal.quotation.cc,
                            yearOfManufacture: proposal.motor_proposal.quotation.manufactured_date,//.substring(0, 10),
                            // purpose: proposal.motor_proposal.quotation.purpose,
                            // carryingCapacity: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? proposal.motor_proposal.quotation.carrying_capacity : null,
                            // goods: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? null : proposal.motor_proposal.quotation.carrying_capacity,
                            sumInsured: proposal.motor_proposal.quotation.sumInsured,
                            additionalPremium: e.addonPremium,
                            signedIn: proposal.contact.branch.city,
                            stamp: 5,
                            monthAndYear: monthAndYear,
                            day: day,
                            status: status == "draft" ? true : false,


                            effectiveToYear: effectiveToEndYear,
                            effectiveToMonth: effectiveToEndMonth,
                            effectiveToDay: effectiveToEndDay,

                            effectiveYear: effectiveYear,
                            effectiveMonth: effectiveMonth,
                            effectiveDay: effectiveDay,

                            // endYear: moment(proposal.effectiveFrom).add(1, 'years').format('YYYY'),
                            // endMonth: moment(proposal.effectiveFrom).format("MMMM"),
                            // endDay: (moment(proposal.effectiveFrom).format("DD")).toString() - 1,

                        }
                        // const htmlContent = fs.readFileSync(path.join(__dirname, "./territorialExtensionEndorsement.html"),
                        //     "utf8"
                        // );
                        // // const htmlContent = fs.readFileSync('./territorialExtensionEndorsement.html', 'utf-8');

                        // // Convert HTML to DOCX
                        // const docxBuffer = await htmlToDocx.asBlob(htmlContent);

                        // // Write the DOCX content to a new file
                        // fs.writeFileSync('output.docx', docxBuffer);


                        //print data
                        var document = {
                            html: html,
                            data: territorialExtension,
                            path: "." + filePath,
                            type: "",
                        };
                        await printPdf(document).then(async (e) => {
                            await EndorsementFilesPath.create({

                                endorsementNo, filePath, fileName, policyId
                            })
                        })
                    }
                    if (e?.coverRate?.coverType == MotorCoverType.bsg) {
                        const fileName = MotorCoverType.bsg
                        let endorsementNo = await generateEndorsementNumber(proposal.contact.branchId)
                        const html = fs.readFileSync(path.join(__dirname, "./../../../templates/endorsement/bsg/bsg-Endorsement.html"),
                            "utf8"
                        );

                        const bsg = {
                            endorsementNo: endorsementNo,
                            fullName: name,
                            policyNo: policyNo,
                            effectiveFrom: new Date(),
                            effectiveTo: new Date(),
                            makeOfVehicle: proposal.motor_proposal.quotation.vehicle.makeOfVehicle,
                            vehicleType: proposal.motor_proposal.quotation.vehicle_type,
                            plateNumber: proposal.motor_proposal.plateNumber,
                            chassisNo: proposal.motor_proposal.chassisNo,
                            engineNo: proposal.motor_proposal.engineNo,
                            cc: proposal.motor_proposal.quotation.cc,
                            yearOfManufacture: proposal.motor_proposal.quotation.manufactured_date,//.substring(0, 10),
                            coverUptoDay: effectiveToDay,
                            coverUptoMonthAndYear: effectiveToMonthYear,
                            coverFromDay: effectiveFromDay,
                            coverFromMonthAndYear: effectiveFromMonthYear,
                            // purpose: proposal.motor_proposal.quotation.purpose,
                            // carryingCapacity: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? proposal.motor_proposal.quotation.carrying_capacity : null,
                            // goods: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? null : proposal.motor_proposal.quotation.carrying_capacity,
                            sumInsured: proposal.motor_proposal.quotation.sumInsured,
                            additionalPremium: e.addonPremium,
                            stamp: 5,

                            signedIn: proposal.contact.branch.city,
                            monthAndYear: monthAndYear,
                            day: day,
                            status: status == "draft" ? true : false,


                            effectiveToYear: effectiveToEndYear,
                            effectiveToMonth: effectiveToEndMonth,
                            effectiveToDay: effectiveToEndDay,

                            effectiveYear: effectiveYear,
                            effectiveMonth: effectiveMonth,
                            effectiveDay: effectiveDay,
                            // endYear: moment(proposal.effectiveFrom).add(1, 'years').format('YYYY'),
                            // endMonth: moment(proposal.effectiveFrom).format("MMMM"),
                            // endDay: (moment(proposal.effectiveFrom).format("DD")).toString() - 1,


                            // yearOfPurchased: proposal.motor_proposal.yearOfPurchased,
                            // typeOfBody: proposal.motor_proposal.typeOfBody,


                        }

                        const filePath = "/print_files/" + Date.now() + ".pdf";

                        //print data
                        var document = {
                            html: html,
                            data: bsg,
                            path: "." + filePath,
                            type: "",
                        };
                        await printPdf(document).then(async (e) => {
                            await EndorsementFilesPath.create({
                                endorsementNo, filePath, fileName, policyId
                            })
                        })

                        // end.push(filePath);

                    }
                    if (e?.coverRate?.coverType == "Daily cash allowance") {
                        console.log("in ti dsndkfns")
                        const fileName = MotorCoverType.dailyCash
                        let endorsementNo = await generateEndorsementNumber(proposal.contact.branchId)
                        const html = fs.readFileSync(path.join(__dirname, "./../../../templates/endorsement/own_damage/DailyCashEndorsmentTemplate.html"),
                            "utf8"
                        );

                        const dailyCash = {
                            endorsementNo: endorsementNo,
                            fullName: name,
                            policyNo: policyNo,
                            effectiveFrom: new Date(),
                            effectiveTo: new Date(),
                            dailyCashAllowance: e.dailyCash_benefit,
                            numberOfDays: e.dailyCash_duration,
                            makeOfVehicle: proposal.motor_proposal.quotation.vehicle.makeOfVehicle,
                            vehicleType: proposal.motor_proposal.quotation.vehicle_type,
                            plateNumber: proposal.motor_proposal.plateNumber,
                            chassisNo: proposal.motor_proposal.chassisNo,
                            engineNo: proposal.motor_proposal.engineNo,
                            cc: proposal.motor_proposal.quotation.cc,
                            yearOfManufacture: proposal.motor_proposal.quotation.manufactured_date,//.substring(0, 10),
                            sumInsured: proposal.motor_proposal.quotation.sumInsured,

                            // yearOfManufacture: proposal.motor_proposal.quotation.manufactured_date, ////
                            // purpose: proposal.motor_proposal.quotation.purpose,
                            // carryingCapacity: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? proposal.motor_proposal.quotation.carrying_capacity : null,
                            // goods: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? null : proposal.motor_proposal.quotation.carrying_capacity,

                            additionalPremium: e.addonPremium,
                            signedIn: proposal.contact.branch.city,
                            stamp: 5,
                            monthAndYear: monthAndYear,
                            day: day,
                            status: status == "draft" ? true : false,
                            effectiveToYear: effectiveToEndYear,
                            effectiveToMonth: effectiveToEndMonth,
                            effectiveToDay: effectiveToEndDay,

                            effectiveYear: effectiveYear,
                            effectiveMonth: effectiveMonth,
                            effectiveDay: effectiveDay,




                            // yearOfPurchased: proposal.motor_proposal.yearOfPurchased,
                            // typeOfBody: proposal.motor_proposal.typeOfBody,


                        }

                        const filePath = "/print_files/" + Date.now() + ".pdf";

                        //print data
                        var document = {
                            html: html,
                            data: dailyCash,
                            path: "." + filePath,
                            type: "",
                        };
                        await printPdf(document).then(async (e) => {
                            await EndorsementFilesPath.create({
                                endorsementNo, filePath, fileName, policyId
                            })
                        })

                    }
                    if (e?.coverRate?.coverType == MotorCoverType.flood) {
                        const fileName = MotorCoverType.flood

                        // const html = fs.readFileSync(path.join(__dirname, "./../../../templates/endorsement/flood.html"),
                        //     "utf8"
                        // );
                        // 
                        // const flood = {
                        //     endorsementNo: endorsementNo,
                        //     fullName: name,
                        //     policyNo: policyNo,
                        //     effectiveFrom: new Date(),
                        //     effectiveTo: new Date(),
                        //     makeOfVehicle: proposal.motor_proposal.quotation.vehicle.makeOfVehicle,
                        //     vehicleType: proposal.motor_proposal.quotation.vehicle_type,
                        //     plateNumber: proposal.motor_proposal.plateNumber,
                        //     chassisNo: proposal.motor_proposal.chassisNo,
                        //     engineNo: proposal.motor_proposal.engineNo,
                        //     cc: proposal.motor_proposal.quotation.cc,
                        //     yearOfManufacture: proposal.motor_proposal.quotation.manufactured_date,
                        //     // purpose: proposal.motor_proposal.quotation.purpose,
                        //     // carryingCapacity: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? proposal.motor_proposal.quotation.carrying_capacity : null,
                        //     // goods: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? null : proposal.motor_proposal.quotation.carrying_capacity,
                        //     sumInsured: proposal.motor_proposal.quotation.sumInsured,
                        //     additionalPremium: e.addonPremium,
                        //     stamp: 5,
                        //     signedIn: proposal.contact.branch.city,

                        //     monthAndYear: monthAndYear,
                        //     day: day

                        //     // yearOfPurchased: proposal.motor_proposal.yearOfPurchased,
                        //     // typeOfBody: proposal.motor_proposal.typeOfBody,


                        // }

                        // const filePath = "/print_files/" + Date.now() + ".pdf";

                        // //print data
                        // var document = {
                        //     html: html,
                        //     data: flood,
                        //     path: "." + filePath,
                        //     type: "",
                        // };
                        // await printPdf(document).then(async (e) => {
                        //     await EndorsementFilesPath.create({
                        //         endorsementNo, filePath, fileName, policyId
                        //     })
                        // })

                    }
                    if (e?.coverRate?.coverType == MotorCoverType.fireAndTheft) {
                        const fileName = MotorCoverType.fireAndTheft

                    }
                    if (e?.coverRate?.coverType == MotorCoverType.fireOnly) {
                        const fileName = MotorCoverType.fireOnly

                    }
                    if (e?.coverRate?.coverType == MotorCoverType.theftOnly) {
                        const fileName = MotorCoverType.theftOnly

                    }
                    if (e?.coverRate?.coverType == MotorCoverType.comprehensive_tp) {
                        const fileName = MotorCoverType.comprehensive_tp
                        let endorsementNo = await generateEndorsementNumber(proposal.contact.branchId)
                        const html = fs.readFileSync(path.join(__dirname, "./../../../templates/endorsement/own_damage/Comprehensive-TP-Endorsement.html"),
                            "utf8"
                        );

                        const comprehensive_tp = {
                            endorsementNo: endorsementNo,
                            fullName: name,
                            policyNo: policyNo,
                            effectiveFrom: new Date(),
                            effectiveTo: new Date(),
                            makeOfVehicle: proposal.motor_proposal.quotation.vehicle.makeOfVehicle,
                            vehicleType: proposal.motor_proposal.quotation.vehicle_type,
                            plateNumber: proposal.motor_proposal.plateNumber,
                            chassisNo: proposal.motor_proposal.chassisNo,
                            engineNo: proposal.motor_proposal.engineNo,
                            cc: proposal.motor_proposal.quotation.cc,
                            yearOfManufacture: proposal.motor_proposal.quotation.manufactured_date,//.substring(0, 10),
                            // purpose: proposal.motor_proposal.quotation.purpose,
                            // carryingCapacity: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? proposal.motor_proposal.quotation.carrying_capacity : null,
                            // goods: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? null : proposal.motor_proposal.quotation.carrying_capacity,
                            sumInsured: proposal.motor_proposal.quotation.sumInsured,
                            additionalPremium: e.addonPremium,
                            stamp: 5,
                            signedIn: proposal.contact.branch.city,
                            monthAndYear: monthAndYear,
                            day: day,
                            status: status == "draft" ? true : false,

                            effectiveToYear: effectiveToEndYear,
                            effectiveToMonth: effectiveToEndMonth,
                            effectiveToDay: effectiveToEndDay,

                            effectiveYear: effectiveYear,
                            effectiveMonth: effectiveMonth,
                            effectiveDay: effectiveDay,
                        }

                        const filePath = "/print_files/" + Date.now() + ".pdf";

                        // Print data
                        let document = {
                            html: html,
                            data: comprehensive_tp,
                            path: "." + filePath,
                            type: "",
                        };
                        await printPdf(document).then(async (e) => {
                            await EndorsementFilesPath.create({
                                endorsementNo, filePath, fileName, policyId
                            })
                        })


                    }

                    if (e?.coverRate?.coverType == MotorCoverType.yellow_card) {
                        const fileName = MotorCoverType.yellow_card
                        let endorsementNo = await generateEndorsementNumber(proposal.contact.branchId)
                        const html = fs.readFileSync(path.join(__dirname, "./../../../templates/endorsement/own_damage/YellowCard.html"),
                            "utf8"
                        );

                        const yellow_card = {
                            endorsementNo: endorsementNo,
                            fullName: name,
                            policyNo: policyNo,
                            effectiveFrom: new Date(),
                            effectiveTo: new Date(),
                            makeOfVehicle: proposal.motor_proposal.quotation.vehicle.makeOfVehicle,
                            vehicleType: proposal.motor_proposal.quotation.vehicle_type,
                            plateNumber: proposal.motor_proposal.plateNumber,
                            chassisNo: proposal.motor_proposal.chassisNo,
                            engineNo: proposal.motor_proposal.engineNo,
                            cc: proposal.motor_proposal.quotation.cc,
                            yearOfManufacture: proposal.motor_proposal.quotation.manufactured_date,//.substring(0, 10),
                            // purpose: proposal.motor_proposal.quotation.purpose,
                            // carryingCapacity: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? proposal.motor_proposal.quotation.carrying_capacity : null,
                            // goods: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? null : proposal.motor_proposal.quotation.carrying_capacity,
                            sumInsured: proposal.motor_proposal.quotation.sumInsured,
                            additionalPremium: e.addonPremium,
                            stamp: 5,
                            signedIn: proposal.contact.branch.city,
                            monthAndYear: monthAndYear,
                            day: day,
                            status: status == "draft" ? true : false,

                            effectiveToYear: effectiveToEndYear,
                            effectiveToMonth: effectiveToEndMonth,
                            effectiveToDay: effectiveToEndDay,

                            effectiveYear: effectiveYear,
                            effectiveMonth: effectiveMonth,
                            effectiveDay: effectiveDay,
                        }

                        const filePath = "/print_files/" + Date.now() + ".pdf";

                        // Print data
                        let document = {
                            html: html,
                            data: yellow_card,
                            path: "." + filePath,
                            type: "",
                        };
                        await printPdf(document).then(async (e) => {
                            await EndorsementFilesPath.create({
                                endorsementNo, filePath, fileName, policyId
                            })
                        })
                    }

                    if (e?.coverRate?.coverType == MotorCoverType.ignition_key) {
                        const fileName = MotorCoverType.ignition_key
                        let endorsementNo = await generateEndorsementNumber(proposal.contact.branchId)
                        const html = fs.readFileSync(path.join(__dirname, "./../../../templates/endorsement/IgnitionKey.html"),
                            "utf8"
                        );

                        const ignition_key = {
                            endorsementNo: endorsementNo,
                            fullName: name,
                            policyNo: policyNo,
                            maxAmount:  e.ignition_sum_insured,
                            // portionLoss: ,
                            from: effective,
                            to: effectiveToDuration,
                            additionalPremium: e.addonPremium,
                            signedIn: proposal.contact.branch.city,
                            monthAndYear: monthAndYear,
                            day: day,
                            status: status == "draft" ? true : false,
                            effectiveToYear: effectiveToEndYear,
                            effectiveToMonth: effectiveToEndMonth,
                            effectiveToDay: effectiveToEndDay,

                            effectiveYear: effectiveYear,
                            effectiveMonth: effectiveMonth,
                            effectiveDay: effectiveDay,

                        }

                        const filePath = "/print_files/" + Date.now() + ".pdf";

                        //print data
                        var document = {
                            html: html,
                            data: ignition_key,
                            path: "." + filePath,
                            type: "",
                        };
                        await printPdf(document).then(async (e) => {
                            await EndorsementFilesPath.create({
                                endorsementNo, filePath, fileName, policyId
                            })
                        })

                    }
                    if (e?.coverRate?.coverType == MotorCoverType.TP_limit_extension) {
                        const fileName = MotorCoverType.TP_limit_extension
                        let endorsementNo = await generateEndorsementNumber(proposal.contact.branchId)
                        const html = fs.readFileSync(path.join(__dirname, "./../../../templates/endorsement/third_party/tpLimitedExtension.html"),
                            "utf8"
                        );

                        const filePath = "/print_files/" + Date.now() + ".pdf";
                        const territorialExtension = {
                            endorsementNo: endorsementNo,
                            fullName: name,
                            policyNo: policyNo,
                            propertyDamage: e.property_limit_extension_amount,

                            coverUptoDay: effectiveTo,

                            coverUptoMonthAndYear: effectiveToMonthYear,
                            coverFromDay: effectiveFromDay,
                            coverFromMonthAndYear: effectiveFromMonthYear,
                            additionalPremium: e.addonPremium,
                            signedIn: proposal.contact.branch.city,
                            stamp: 5,
                            monthAndYear: monthAndYear,
                            day: day,
                            status: status == "draft" ? true : false,
                            effectiveToYear: effectiveToEndYear,
                            effectiveToMonth: effectiveToEndMonth,
                            effectiveToDay: effectiveToEndDay,

                            effectiveYear: effectiveYear,
                            effectiveMonth: effectiveMonth,
                            effectiveDay: effectiveDay,

                        }
                        //print data
                        var document = {
                            html: html,
                            data: territorialExtension,
                            path: "." + filePath,
                            type: "",
                        };
                        await printPdf(document).then(async (e) => {
                            await EndorsementFilesPath.create({
                                endorsementNo, filePath, fileName, policyId
                            })
                        })
                    }
                })
            )


        }



        return
    }
    catch (error) {
        
        return -1
    }
}


const UpdateEndorsementByProposal = async (proposalId, policyNo, policyId, status) => {
    try {


        var check = moment();
        const day = check.format('DD') // => ('Monday' , 'Tuesday' ----)
        const month = check.format('MMMM') // => ('January','February.....)
        const year = check.format('YYYY') // => ('2012','2013' ...)  
        const monthAndYear = `${month},${year}`
        const proposal = await Proposal.findByPk(proposalId, {
            include: [
                {
                    model: MotorProposal,
                    include:
                        [{
                            model: Quotation,
                            include:
                                [{
                                    model: Addons,
                                    include: [
                                        { model: TerritorialExtension, as: "territorialExtension" },
                                        { model: CoverRate, as: "coverRate" },


                                    ],
                                },
                                { model: Vehicle },
                                { model: FinanceData }

                                ]
                        },
                        ]
                }, { model: Policy, include: [EndorsementFilesPath] },
                { model: Contact, include: { model: Branch } }]
        })
        let end = []
        const name = proposal.contact
            ? proposal.contact.type == "Corporate"
                ? proposal.contact.companyName
                : proposal.contact.type == "Join Individual"
                    ? proposal.contact.joinIndividualName
                    : proposal.contact.type == "Individual"
                        ? proposal.contact.firstName + " " + proposal.contact.middleName + " "
                        : ""
            : ""

        // 
        // 

        const effective = moment(proposal.effectiveFrom);

        const effectiveFromDay = effective.format('dddd') // => ('Monday' , 'Tuesday' ----)
        const effectiveFromMonth = effective.format('MMMM') // => ('January','February.....)
        const effectiveFromYear = effective.format('YYYY') // => ('2012','2013' ...)  
        const effectiveFromMonthYear = `${effectiveFromMonth},${effectiveFromYear}`


        const separated = proposal.motor_proposal.quotation.duration.split(" ");
        const number = separated[0];
        const secondWord = separated[1];
        const firstLetter = secondWord.charAt(0).toLowerCase();
        const effectiveToDuration = effective
        const added = effectiveToDuration.add(number, firstLetter).format("DD/MM/YYYY")

        const effectiveTo = added
        const effectiveToDay = moment(new Date(effectiveTo)).format('DD') // => ('Monday' , 'Tuesday' ----)
        const effectiveToMonth = moment(new Date(effectiveTo)).format('MMMM') // => ('January','February.....)
        const effectiveToYear = moment(new Date(effectiveTo)).format('YYYY') // => ('2012','2013' ...)  
        const effectiveToMonthYear = `${Number(effectiveToMonth)+1},${effectiveToYear}`

        const effectiveToDate = moment(proposal.effectiveFrom).subtract(1, 'days').add(1, "years");
        const effectiveToEndYear = effectiveToDate.format("YYYY")
        const effectiveToEndMonth = effectiveToDate.format("MMMM")
        const effectiveToEndDay = effectiveToDate.format("DD")

        const effectiveYear = moment(proposal.effectiveFrom).format("YYYY")
        const effectiveMonth = moment(proposal.effectiveFrom).format("MMMM")
        const effectiveDay = moment(proposal.effectiveFrom).format("DD")

        

        // const pol = await Proposal
        if (proposal && proposal.motor_proposal.quotation && proposal.motor_proposal.quotation.addons) {
            const endorsement = await EndorsementFilesPath.findAll({ where: { policyId: policyId } })
            // 
            const findEndorsementNo = (endorsement, coverType) => {
                const foundObject = endorsement.find(obj => obj.fileName === coverType);
                return foundObject ? foundObject.endorsementNo : null;
            };
            await Promise.all(
                proposal.motor_proposal.quotation.addons.map(async (e) => {

                    // 
                    if (e?.coverRate?.coverType == MotorCoverType.ownDamage) {
                        const fileName = MotorCoverType.ownDamage

                    }
                    if (e?.coverRate?.coverType == MotorCoverType.thirdParty) {
                        const fileName = MotorCoverType.thirdParty

                    }
                    if (e?.coverRate?.coverType == MotorCoverType.comprehensive) {

                        const fileName = MotorCoverType.comprehensive_tp
                        const endorsementNo = await findEndorsementNo(endorsement, fileName)

                        const html = fs.readFileSync(path.join(__dirname, "./../../../templates/endorsement/own_damage/Comprehensive-TP-Endorsement.html"),
                            "utf8"
                        );

                        const comprehensive_tp = {
                            endorsementNo: endorsementNo,
                            fullName: name,
                            policyNo: policyNo,
                            effectiveFrom: new Date(),
                            effectiveTo: new Date(),
                            makeOfVehicle: proposal.motor_proposal.quotation.vehicle.makeOfVehicle,
                            vehicleType: proposal.motor_proposal.quotation.vehicle_type,
                            plateNumber: proposal.motor_proposal.plateNumber,
                            chassisNo: proposal.motor_proposal.chassisNo,
                            engineNo: proposal.motor_proposal.engineNo,
                            cc: proposal.motor_proposal.quotation.cc,
                            yearOfManufacture: proposal.motor_proposal.quotation.manufactured_date,//.substring(0, 10),
                            // purpose: proposal.motor_proposal.quotation.purpose,
                            // carryingCapacity: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? proposal.motor_proposal.quotation.carrying_capacity : null,
                            // goods: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? null : proposal.motor_proposal.quotation.carrying_capacity,
                            sumInsured: proposal.motor_proposal.quotation.sumInsured,
                            additionalPremium: e.addonPremium,
                            stamp: 5,
                            signedIn: proposal.contact.branch.city,
                            monthAndYear: monthAndYear,
                            day: day,
                            status: status == "draft" ? true : false,

                            effectiveToYear: effectiveToEndYear,
                            effectiveToMonth: effectiveToEndMonth,
                            effectiveToDay: effectiveToEndDay,

                            effectiveYear: effectiveYear,
                            effectiveMonth: effectiveMonth,
                            effectiveDay: effectiveDay,
                        }

                        const filePath = "/print_files/" + Date.now() + ".pdf";

                        // Print data
                        let document = {
                            html: html,
                            data: comprehensive_tp,
                            path: "." + filePath,
                            type: "",
                        };
                        await EndorsementFilesPath.update(
                            { filePath: filePath },
                            { where: { policyId: policyId, endorsementNo: endorsementNo, fileName: fileName } }
                        )



                    }
                    if (e?.coverRate?.coverType == MotorCoverType.territorialExtension) {
                        const fileName = MotorCoverType.territorialExtension
                        const endorsementNo = await findEndorsementNo(endorsement, fileName)
                        const html = fs.readFileSync(path.join(__dirname, "./../../../templates/endorsement/own_damage/Territorial-Extension-Endorsement.html"),
                            "utf8"
                        );


                        const filePath = "/print_files/" + Date.now() + ".pdf";

                        const territorialExtension = {
                            endorsementNo: endorsementNo,
                            fullName: name,
                            policyNo: policyNo,
                            place: e.territorialExtension.country,
                            coverType: e?.coverRate?.coverType,
                            effectiveFromDay: effectiveFromDay,
                            effectiveFromMonth: effectiveFromMonth,
                            effectiveFromYear: effectiveFromYear,
                            effectiveFromMonthYear: effectiveFromMonthYear,
                            effectiveToMonthYear: effectiveToMonthYear,
                            effectiveToDay: effectiveToDay,

                            // effectiveToDay: effectiveToDay,
                            // effectiveToMonth: effectiveToMonth,
                            // effectiveToYear: effectiveToYear,
                            // from: `${effectiveFromDay},${effectiveFromMonthYear}`,
                            // to: `${effectiveToDay},${effectiveToYear}`,

                            makeOfVehicle: proposal.motor_proposal.quotation.vehicle.makeOfVehicle,
                            vehicleType: proposal.motor_proposal.quotation.vehicle_type,
                            plateNumber: proposal.motor_proposal.plateNumber,
                            chassisNo: proposal.motor_proposal.chassisNo,
                            engineNo: proposal.motor_proposal.engineNo,
                            cc: proposal.motor_proposal.quotation.cc,
                            yearOfManufacture: proposal.motor_proposal.quotation.manufactured_date,//.substring(0, 10),
                            // purpose: proposal.motor_proposal.quotation.purpose,
                            // carryingCapacity: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? proposal.motor_proposal.quotation.carrying_capacity : null,
                            // goods: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? null : proposal.motor_proposal.quotation.carrying_capacity,
                            sumInsured: proposal.motor_proposal.quotation.sumInsured,
                            additionalPremium: e.addonPremium,
                            signedIn: proposal.contact.branch.city,
                            stamp: 5,
                            monthAndYear: monthAndYear,
                            day: day,
                            status: status == "draft" ? true : false,


                            effectiveToYear: effectiveToEndYear,
                            effectiveToMonth: effectiveToEndMonth,
                            effectiveToDay: effectiveToEndDay,

                            effectiveYear: effectiveYear,
                            effectiveMonth: effectiveMonth,
                            effectiveDay: effectiveDay,

                        }
                        // const htmlContent = fs.readFileSync(path.join(__dirname, "./territorialExtensionEndorsement.html"),
                        //     "utf8"
                        // );
                        // // const htmlContent = fs.readFileSync('./territorialExtensionEndorsement.html', 'utf-8');

                        // // Convert HTML to DOCX
                        // const docxBuffer = await htmlToDocx.asBlob(htmlContent);

                        // // Write the DOCX content to a new file
                        // fs.writeFileSync('output.docx', docxBuffer);


                        //print data
                        var document = {
                            html: html,
                            data: territorialExtension,
                            path: "." + filePath,
                            type: "",
                        };
                        await printPdf(document).then(async (e) => {

                            await EndorsementFilesPath.update(
                                { filePath: filePath },
                                { where: { policyId: policyId, endorsementNo: endorsementNo, fileName: fileName } }
                            )
                        })
                    }
                    if (e?.coverRate?.coverType == MotorCoverType.bsg) {
                        const fileName = MotorCoverType.bsg
                        const endorsementNo = await findEndorsementNo(endorsement, fileName)

                        const html = fs.readFileSync(path.join(__dirname, "./../../../templates/endorsement/bsg/bsg-Endorsement.html"),
                            "utf8"
                        );

                        const bsg = {
                            endorsementNo: endorsementNo,
                            fullName: name,
                            policyNo: policyNo,
                            effectiveFrom: new Date(),
                            effectiveTo: new Date(),
                            makeOfVehicle: proposal.motor_proposal.quotation.vehicle.makeOfVehicle,
                            vehicleType: proposal.motor_proposal.quotation.vehicle_type,
                            plateNumber: proposal.motor_proposal.plateNumber,
                            chassisNo: proposal.motor_proposal.chassisNo,
                            engineNo: proposal.motor_proposal.engineNo,
                            cc: proposal.motor_proposal.quotation.cc,
                            yearOfManufacture: proposal.motor_proposal.quotation.manufactured_date,//.substring(0, 10),
                            coverUptoDay: effectiveToDay,
                            coverUptoMonthAndYear: effectiveToMonthYear,
                            coverFromDay: effectiveFromDay,
                            coverFromMonthAndYear: effectiveFromMonthYear,
                            // purpose: proposal.motor_proposal.quotation.purpose,
                            // carryingCapacity: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? proposal.motor_proposal.quotation.carrying_capacity : null,
                            // goods: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? null : proposal.motor_proposal.quotation.carrying_capacity,
                            sumInsured: proposal.motor_proposal.quotation.sumInsured,
                            additionalPremium: e.addonPremium,
                            stamp: 5,

                            signedIn: proposal.contact.branch.city,
                            monthAndYear: monthAndYear,
                            day: day,
                            status: status == "draft" ? true : false,


                            effectiveToYear: effectiveToEndYear,
                            effectiveToMonth: effectiveToEndMonth,
                            effectiveToDay: effectiveToEndDay,

                            effectiveYear: effectiveYear,
                            effectiveMonth: effectiveMonth,
                            effectiveDay: effectiveDay,
                            // endYear: moment(proposal.effectiveFrom).add(1, 'years').format('YYYY'),
                            // endMonth: moment(proposal.effectiveFrom).format("MMMM"),
                            // endDay: (moment(proposal.effectiveFrom).format("DD")).toString() - 1,


                            // yearOfPurchased: proposal.motor_proposal.yearOfPurchased,
                            // typeOfBody: proposal.motor_proposal.typeOfBody,

                        }

                        const filePath = "/print_files/" + Date.now() + ".pdf";

                        //print data
                        var document = {
                            html: html,
                            data: bsg,
                            path: "." + filePath,
                            type: "",
                        };
                        await printPdf(document).then(async (e) => {
                            await EndorsementFilesPath.update(
                                { filePath: filePath },
                                { where: { policyId: policyId, endorsementNo: endorsementNo, fileName: fileName } }
                            )
                        })


                    }
                    if (e?.coverRate?.coverType == MotorCoverType.dailyCash) {
                        const fileName = MotorCoverType.dailyCash
                        const endorsementNo = await findEndorsementNo(endorsement, fileName)
                        const html = fs.readFileSync(path.join(__dirname, "./../../../templates/endorsement/DailyCashAllowanceEndorsement.html"),
                            "utf8"
                        );

                        const dailyCash = {
                            endorsementNo: endorsementNo,
                            fullName: name,
                            policyNo: policyNo,
                            effectiveFrom: new Date(),
                            effectiveTo: new Date(),
                            dailyCashAllowance: e.dailyCash_benefit,
                            numberOfDays: e.dailyCash_duration,
                            makeOfVehicle: proposal.motor_proposal.quotation.vehicle.makeOfVehicle,
                            vehicleType: proposal.motor_proposal.quotation.vehicle_type,
                            plateNumber: proposal.motor_proposal.plateNumber,
                            chassisNo: proposal.motor_proposal.chassisNo,
                            engineNo: proposal.motor_proposal.engineNo,
                            cc: proposal.motor_proposal.quotation.cc,
                            yearOfManufacture: proposal.motor_proposal.quotation.manufactured_date,//.substring(0, 10),
                            sumInsured: proposal.motor_proposal.quotation.sumInsured,

                            // yearOfManufacture: proposal.motor_proposal.quotation.manufactured_date, ////
                            // purpose: proposal.motor_proposal.quotation.purpose,
                            // carryingCapacity: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? proposal.motor_proposal.quotation.carrying_capacity : null,
                            // goods: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? null : proposal.motor_proposal.quotation.carrying_capacity,

                            additionalPremium: e.addonPremium,
                            signedIn: proposal.contact.branch.city,
                            stamp: 5,
                            monthAndYear: monthAndYear,
                            day: day,
                            status: status == "draft" ? true : false,
                            effectiveToYear: effectiveToEndYear,
                            effectiveToMonth: effectiveToEndMonth,
                            effectiveToDay: effectiveToEndDay,

                            effectiveYear: effectiveYear,
                            effectiveMonth: effectiveMonth,
                            effectiveDay: effectiveDay,




                        }

                        const filePath = "/print_files/" + Date.now() + ".pdf";

                        //print data
                        var document = {
                            html: html,
                            data: dailyCash,
                            path: "." + filePath,
                            type: "",
                        };
                        await printPdf(document).then(async (e) => {
                            await EndorsementFilesPath.update(
                                { filePath: filePath },
                                { where: { policyId: policyId, endorsementNo: endorsementNo, fileName: fileName } }
                            )
                        })

                    }
                    if (e?.coverRate?.coverType == MotorCoverType.flood) {
                        const fileName = MotorCoverType.flood

                        // const html = fs.readFileSync(path.join(__dirname, "./../../../templates/endorsement/flood.html"),
                        //     "utf8"
                        // );
                        // 
                        // const flood = {
                        //                                 endorsementNo: await findEndorsementNo(endorsement, fileName),

                        //     fullName: name,
                        //     policyNo: policyNo,
                        //     effectiveFrom: new Date(),
                        //     effectiveTo: new Date(),
                        //     makeOfVehicle: proposal.motor_proposal.quotation.vehicle.makeOfVehicle,
                        //     vehicleType: proposal.motor_proposal.quotation.vehicle_type,
                        //     plateNumber: proposal.motor_proposal.plateNumber,
                        //     chassisNo: proposal.motor_proposal.chassisNo,
                        //     engineNo: proposal.motor_proposal.engineNo,
                        //     cc: proposal.motor_proposal.quotation.cc,
                        //     yearOfManufacture: proposal.motor_proposal.quotation.manufactured_date.substring(0, 10),
                        //     // purpose: proposal.motor_proposal.quotation.purpose,
                        //     // carryingCapacity: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? proposal.motor_proposal.quotation.carrying_capacity : null,
                        //     // goods: goods_carrying.include(proposal.motor_proposal.quotation.vehicle_type) == -1 ? null : proposal.motor_proposal.quotation.carrying_capacity,
                        //     sumInsured: proposal.motor_proposal.quotation.sumInsured,
                        //     additionalPremium: e.addonPremium,
                        //     stamp: 5,
                        //     signedIn: proposal.contact.branch.city,

                        //     monthAndYear: monthAndYear,
                        //     day: day

                        //     // yearOfPurchased: proposal.motor_proposal.yearOfPurchased,
                        //     // typeOfBody: proposal.motor_proposal.typeOfBody,


                        // }

                        // const filePath = "/print_files/" + Date.now() + ".pdf";

                        // //print data
                        // var document = {
                        //     html: html,
                        //     data: flood,
                        //     path: "." + filePath,
                        //     type: "",
                        // };
                        // await printPdf(document).then(async (e) => {
                        //     await EndorsementFilesPath.create({
                        //         endorsementNo, filePath, fileName, policyId
                        //     })
                        // })

                    }
                    if (e?.coverRate?.coverType == MotorCoverType.fireAndTheft) {
                        const fileName = MotorCoverType.fireAndTheft

                    }
                    if (e?.coverRate?.coverType == MotorCoverType.fireOnly) {
                        const fileName = MotorCoverType.fireOnly

                    }
                    if (e?.coverRate?.coverType == MotorCoverType.theftOnly) {
                        const fileName = MotorCoverType.theftOnly

                    }
                    if (e?.coverRate?.coverType == MotorCoverType.comprehensive_tp) {
                        const fileName = MotorCoverType.comprehensive_tp

                    }
                    if (e?.coverRate?.coverType == MotorCoverType.ignition_key) {
                        const fileName = MotorCoverType.ignition_key
                        const endorsementNo = await findEndorsementNo(endorsement, fileName)
                        const html = fs.readFileSync(path.join(__dirname, "./../../../templates/endorsement/IgnitionKey.html"),
                            "utf8"
                        );

                        const ignition_key = {
                            endorsementNo: endorsementNo,
                            fullName: name,
                            policyNo: policyNo,
                            // maxAmount: ,
                            // portionLoss: ,
                            from: effective,
                            to: effectiveToDuration,
                            additionalPremium: e.addonPremium,
                            signedIn: proposal.contact.branch.city,
                            monthAndYear: monthAndYear,
                            day: day,
                            status: status == "draft" ? true : false,
                            effectiveToYear: effectiveToEndYear,
                            effectiveToMonth: effectiveToEndMonth,
                            effectiveToDay: effectiveToEndDay,

                            effectiveYear: effectiveYear,
                            effectiveMonth: effectiveMonth,
                            effectiveDay: effectiveDay,


                        }

                        const filePath = "/print_files/" + Date.now() + ".pdf";

                        //print data
                        var document = {
                            html: html,
                            data: ignition_key,
                            path: "." + filePath,
                            type: "",
                        };
                        await printPdf(document).then(async (e) => {
                            await EndorsementFilesPath.update(
                                { filePath: filePath },
                                { where: { policyId: policyId, endorsementNo: endorsementNo, fileName: fileName } }
                            )
                        })

                    }
                    if (e?.coverRate?.coverType == MotorCoverType.TP_limit_extension) {
                        const fileName = MotorCoverType.TP_limit_extension
                        const endorsementNo = await findEndorsementNo(endorsement, fileName)
                        const html = fs.readFileSync(path.join(__dirname, "./../../../templates/endorsement/third_party/tpLimitedExtension.html"),
                            "utf8"
                        );

                        const filePath = "/print_files/" + Date.now() + ".pdf";
                        const territorialExtension = {
                            endorsementNo: endorsementNo,
                            fullName: name,
                            policyNo: policyNo,
                            propertyDamage: e.property_limit_extension_amount,

                            coverUptoDay: effectiveTo,

                            coverUptoMonthAndYear: effectiveToMonthYear,
                            coverFromDay: effectiveFromDay,
                            coverFromMonthAndYear: effectiveFromMonthYear,
                            additionalPremium: e.addonPremium,
                            signedIn: proposal.contact.branch.city,
                            stamp: 5,
                            monthAndYear: monthAndYear,
                            day: day,
                            status: status == "draft" ? true : false,
                            effectiveToYear: effectiveToEndYear,
                            effectiveToMonth: effectiveToEndMonth,
                            effectiveToDay: effectiveToEndDay,

                            effectiveYear: effectiveYear,
                            effectiveMonth: effectiveMonth,
                            effectiveDay: effectiveDay,

                        }
                        //print data
                        var document = {
                            html: html,
                            data: territorialExtension,
                            path: "." + filePath,
                            type: "",
                        };
                        await printPdf(document).then(async (e) => {
                            await EndorsementFilesPath.update(
                                { filePath: filePath },
                                { where: { policyId: policyId, endorsementNo: endorsementNo, fileName: fileName } }
                            )
                        })
                    } 
                })
            )


        }



        return

    }
    catch (error) {
        
        return -1
    }
}



const getEndorsementByProposal = async (req, res) => {
    try {
        const id = req.params.id
        const end = await EndorsementFilesPath.findAndCountAll({
            where: { proposalId: id }
        })
        res.status(200).json({ end });

    }
    catch (error) {

    }

}

const getEndorsementByPolicyId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        

        const resEndorsement = await EndorsementFilesPath.findOne({
            where: { policyId: id }
        });

        if (!resEndorsement) {
            return res.status(404).json({ message: "No Data Found" });
        }

        
        return res.status(200).json(resEndorsement);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};
module.exports = {
    getEndorsement,
    getAllEndorsements,
    createEndorsement,
    getEndorsementByPk,
    editEndorsement,
    deleteEndorsement,
    getAllFile,
    createEndorsementByProposal,
    getEndorsementByProposal,
    UpdateEndorsementByProposal,
    // getEndorsementByName,
    getEndorsementByPolicyId,
};
