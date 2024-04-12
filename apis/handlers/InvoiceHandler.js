const numberToWords = require('number-to-words');
const Invoice = require("../../models/Invoice");
const Country = require("../../models/Country");
const { Op } = require("sequelize");
const {
    canUserCreate,
    canUserEdit,
    canUserDelete,
} = require("../../utils/Authrizations");
const { eventResourceTypes, eventActions, policyStatus, financeStatus, account_stage } = require("../../utils/constants");
const {
    createEventLog,
    getChangedFieldValues,
    getIpAddress,
    printPdf,
    formatToCurrency,
} = require("../../utils/GeneralUtils");
const User = require("../../models/acl/user");
const Proposal = require("../../models/proposals/Proposal");
const Contact = require("../../models/Contact");
const Branch = require("../../models/Branch");
const FireQuotation = require("../../models/fire/FireQuotation");
const FireRate = require("../../models/fire/FireRate");
const FireRateCategory = require("../../models/fire/FireRateCategory");
const FireAlliedPerilsRate = require("../../models/fire/FireAlliedPerilsRate");
const Policy = require("../../models/Policy");
const FireProposal = require("../../models/proposals/FireProposal");
const MotorProposal = require("../../models/proposals/MotorProposal");

const Quotation = require("../../models/Quotation");
const Addons = require("../../models/motor/Addons");

//Required package
var fs = require("fs");
var path = require("path");
const moment = require("moment");
const TerritorialExtension = require("../../models/TerritorialExtension");
const CoverRate = require("../../models/CoverRate");
const Employee = require("../../models/Employee");
const { ToWords } = require('to-words');
const toWords = new ToWords();


//html template
var html = fs.readFileSync(
    path.join(__dirname, "./../../templates/ReceiptTemplate.html"),
    "utf8"
);

//get
const getInvoice = async (req, res) => {
    try {
        const { f, r, st, sc, sd } = req.query;
        let data
        const currentUser = await User.findByPk(req.user.id, {
            include: [Employee],
        });
        switch (req.type) {
            case "all":
                data = await Invoice.findAndCountAll({
                    include: [User, Proposal, Contact, Policy],
                    offset: Number(f),
                    limit: Number(r),
                    order: [[sc || "updatedAt", sd == 1 ? "DESC" : "ASC"]],

                    where: getSearch(st),
                });
                break;
            case "self":
                data = await Invoice.findAndCountAll({
                    include: [User, Proposal, Contact, Policy],
                    offset: Number(f),
                    limit: Number(r),
                    order: [[sc || "updatedAt", sd == 1 ? "DESC" : "ASC"]],
                    where: {
                        [Op.and]: [
                            {
                                [Op.or]: [
                                    { "$contact.assignedTo$": currentUser.id },
                                    { "$proposal.id$": currentUser.id },
                                ],
                            },
                            getSearch(st),
                        ],
                    },

                });
            case "branch":
                data = await Invoice.findAndCountAll({
                    include: [User, Proposal, Contact, Policy],
                    offset: Number(f),
                    limit: Number(r),
                    order: [[sc || "updatedAt", sd == 1 ? "DESC" : "ASC"]],
                    where: {
                        [Op.and]: [
                            {
                                [Op.or]: [
                                    {
                                        "$contact.branchId$": currentUser.employee.branchId
                                    },

                                ],
                            },
                            getSearch(st),
                        ],
                    },

                });
            case "branchAndSelf":
                data = await Invoice.findAndCountAll({
                    include: [User, Proposal, Contact, Policy],
                    offset: Number(f),
                    limit: Number(r),
                    order: [[sc || "updatedAt", sd == 1 ? "DESC" : "ASC"]],
                    where: {
                        [Op.and]: [
                            {
                                [Op.or]: [
                                    { "$contact.branchId$": currentUser.employee.branchId },
                                    { "$contact.assignedTo$": currentUser.id },
                                    { "$proposal.id$": currentUser.id },

                                ],
                            },
                            getSearch(st),
                        ],
                    },

                });

        }
        res.status(200).json(data);

    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

const getInvoiceByPk = async (req, res) => {
    try {
        const id = req.params.id;
        const invoice = await Invoice.findByPk(id, { include: [User, Proposal, Contact, Policy] }).then(function (invoice) {
            if (!invoice) {
                res.status(404).json({ message: "No Data Found" });
            } else {
                res.status(200).json(invoice);
            }
        });
        // res.status(200).json(invoice);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

const getAllInvoices = async (req, res) => {
    try {
        const data = await Invoice.findAndCountAll({
            include: [User, Proposal, Contact, Policy],
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
                name: {
                    [Op.like]: "%" + st + "%",
                },
            },
        ],
    };
};

//posting
const createInvoice = async (req, res) => {
    const invoiceBody = req.body;



    

    try {
        // if (!(await canUserCreate(req.user, "invoices"))) {
        //     return res.status(401).json({ msg: "unauthorized access!" });
        // }
        // const duplicateName = await Invoice.findAll({
        //     where: { name: invoiceBody.invoiceNo },
        // });
        // if (duplicateName.length > 0) {
        //     res.status(400).json({ msg: "Invoice number already registered!" });
        //     return;
        // }
        if (!invoiceBody.policyId) {
            res.status(400).json({ msg: "Please choose a policy !" });
            return;
        }
        const invoicePath = await generateInvoice(invoiceBody.policyId);
        
        const policy = await Policy.findByPk(invoiceBody.policyId, { include: [{ model: Proposal, include: [Contact, { model: FireProposal, include: [FireQuotation] }, MotorProposal] }] });
        const invoiceData = {
            invoiceNo: "",
            name: "",
            status: financeStatus.final,
            TOT: "",
            socialSecurity: "",
            registrationForVat: "",
            being: "",
            isCash: false,
            chequeNo: 0,
            invoicePath: invoicePath,
            assignedTo: 0,
            branchId: policy.proposal.contact.id,
            proposalId: policy.proposal.id,
            contactId: policy.proposal.contactId,
            userId: 0,
            policyId: invoiceBody.policyId,

        }

        const invoice = await Invoice.create(invoiceData);
        const update = await Policy.update({ policyStatus: policyStatus.final, financeStatus: financeStatus.final }, { where: { id: invoiceBody.policyId } })
            .then(async (approved) => {
                const policy = await Policy.findByPk(invoiceBody.policyId, { include: [{ model: Proposal, include: [Contact] }] }).then(async (foundPolicy) => {
                    

                    if (foundPolicy.policyStatus === policyStatus.final) {
                        
                        await Contact.update({
                            accountStage: account_stage.activeClient
                        },
                            { where: { id: foundPolicy.proposal.contact.id } })
                    }
                })
                // 
            }
            )

        
        // const update = await Policy.update({policyStatus: policyStatus.final, financeStatus: financeStatus.final}, {where: {id: invoiceBody.policyId}});

        

        if (invoice) {
            await createEventLog(
                req.user.id,
                eventResourceTypes.invoice,
                `${invoice.invoiceNo}`,
                invoice.id,
                eventActions.create,
                "",
                getIpAddress(req.ip)
            );

        }
        res.status(200).json(invoice);
    } catch (error) {
        
        res.status(400).json({ msg: error.message });
    }
};

const createInvoices = async (req, res) => {
    const invoiceBody = req.body;
    var addedList = 0;
    var duplicate = [];
    var countryNotFound = [];
    var incorrect = [];
    var lineNumber = 2;
    try {

        let promises = await invoiceBody.map(async (invoice) => {

            const duplicateName = await Invoice.findAll({
                where: { name: invoice.invoiceNo },
            }).then(async (duplicateName) => {
                if (duplicateName.length > 0) {
                    duplicate.push(lineNumber);

                } else {
                    try {
                        const invoices = await Invoice.create(invoice);
                        addedList += 1;
                    } catch (error) {
                        incorrect.push(lineNumber);
                    }
                }
            })
            lineNumber = lineNumber + 1;

        });
        Promise.all(promises).then(function (results) {
            let msg = "";
            if (addedList != 0) {
                msg = msg + `${addedList} invoices added`;
                
            }
            if (duplicate != 0) {
                msg = msg + ` duplicate value found on line ${duplicate} \n`;
            }
            if (countryNotFound != 0) {
                msg =
                    msg +
                    ` Line ${countryNotFound} rejected because invoices is not found`;
            }
            if (incorrect.length != 0) {
                msg = msg + ` line ${incorrect} has incorrect values`;
            }
            if (
                countryNotFound.length != 0 ||
                duplicate.length != 0 ||
                incorrect.length
            ) {
                res.status(400).json({ msg: msg });
            } else {
                res.status(200).json({ msg: msg });
            }
        });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

//put
const editInvoice = async (req, res) => {
    const reqBody = req.body;
    const id = req.params.id;

    try {

        const duplicateName = await Invoice.findAll({
            where: { name: reqBody.name },
        });
        
        if (duplicateName.length !== 0) {
            if (duplicateName[0].id !== reqBody.id) {
                res.status(400).json({ msg: "Invoice already added" });
                return;
            }
        }
        let oldInvoice = await Invoice.findByPk(id, {});
        let updated = await Invoice.update(reqBody, { where: { id: id } });

        if (updated) {
            let newInvoice = await Invoice.findByPk(id, {});
            let changedFieldValues = getChangedFieldValues(oldInvoice, newInvoice)
            await createEventLog(
                req.user.id,
                eventResourceTypes.invoice,
                `${oldInvoice.name}`,
                newInvoice.id,
                eventActions.edit,
                changedFieldValues,
                getIpAddress(req.ip)
            );
            res.status(200).json({ id });
        }
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

const deleteInvoice = async (req, res) => {
    const id = req.params.id;

    try {

        let invoice = await Invoice.findByPk(id, {});
        let deleted = await Invoice.destroy({ where: { id: id } });
        if (deleted) {
            await createEventLog(
                req.user.id,
                eventResourceTypes.invoice,
                `${invoice.name}`,
                invoice.id,
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

const generateInvoice = async (id) => {
    try {
        const policy = await Policy.findByPk(id, {
            include: [{
                model: Proposal, include: [Contact, { model: FireProposal, include: [FireQuotation] }, {
                    model: MotorProposal, include: [{
                        model: Quotation,
                        include:
                            [{
                                model: Addons,
                                include: [
                                    { model: TerritorialExtension, as: "territorialExtension" },
                                    { model: CoverRate, as: "coverRate" },


                                ],
                            },


                            ]
                    },]
                }]
            }]
        });
        const contact = await Contact.findByPk(policy.proposal.contactId);
        let endDate = new Date(policy.policyIssuedDate);
        endDate = endDate.setFullYear(endDate.getFullYear() + 1);
        // endDate = endDate.setDate(endDate.getDate() - 1);

        const name = policy.proposal.contactId
            ? contact.type == "Corporate"
                ? contact.companyName
                : contact.type == "Join Individual"
                    ? contact.joinIndividualName
                    : contact.type == "Individual"
                        ? `${contact.firstName} ${contact.middleName ?? ''} ${contact.lastName ?? ''}`
                        : ""
            : "";
        const branch = await Branch.findByPk(contact.branchId);
        // const premiumCost = policy.proposal.motorProposalId ? policy.proposal.motor_proposal.quotation.premium : policy.proposal.fire_proposal.fireQuotation.premium;
        // const vatAmount = premiumCost * 0.15;
        // const totalCost = premiumCost + vat + 5;

        let printData = {
            branchName: branch.name,
            branchCode: branch.short_code,
            typeOfBusiness: policy.proposal.contact.type,
            sourceOfBusiness: policy.proposal.contact.business_source_type,

            intermediaryName: policy.proposal.contact.intermediaryName,
            insuredName: name,
            region: policy.proposal.contact.region,
            city: policy.proposal.contact.city,
            subCity: policy.proposal.contact.subcity,
            woreda: policy.proposal.contact.woreda,
            kebele: policy.proposal.contact.kebele,
            houseNo: policy.proposal.contact.building,
            // houseNo: "",
            // riskCity: "",
            // riskworeda: "",
            // riskhouseNo: "",
            tin_no: policy.proposal.contact.tinNumber,
            vat_reg_no: policy.proposal.contact.vatRegistrationNumber,
            kebele:policy.proposal.contact.kebele,

            address: contact.region ? contact.region + ", " : "" + contact.city ? contact.city + ", " : "" + contact.subCity ? contact.subCity + ", " : "" + contact.woreda ? contact.woreda + ", " : "" + contact.officeNumber ? contact.officeNumber : "",
            customerTinNo: contact.tinNumber ? contact.tinNumber : "",
            customerVatNo: contact.vatRegistrationNumber ? contact.vatRegistrationNumber : "",

            customerID: policy.proposal.contactId,
            policyNo: policy.policyNumber,
            claimNo: "",

            insuranceCoverFor: "",

            endDate: moment(endDate).format("DD/MM/YYYY"),
            startDate: moment(policy.proposal.effectiveFrom).subtract(1, 'days').format("DD/MM/YYYY"),

//             startDate: moment(policy.proposal.effectiveFrom).subtract(1, 'days').format("DD/MM/YYYY"),
//             endDate: moment(endDate).add(1, 'days').subtract(1, 'days').format("DD/MM/YYYY"),          

            premiumType: "New",
            premium: "",
            revenueStamp: 5,
            total: "",

            other: "",
            sumInsured: "",
            being: "",

            sumOfBirr: "",

            premiumType: "",
            certificateNo: "",
            endorsementNo: "",

            checqueNo: "",
            officerName: "",
            vat: "",
            todayDate: moment().format("DD/MM/YYYY"),

        };
        

        if (policy.proposal.fireProposalId) {
            const fireQuotation = await FireQuotation.findByPk(
                policy.proposal.fire_proposal.fireQuotationId,
                { include: [FireRate, FireRateCategory, FireAlliedPerilsRate, Branch] }
            );
            const sumOfBirr_inWord = toWords.convert((parseFloat(policy.proposal.motor_proposal.quotation.premium) + 5), { currency: true, currencyOptions: { name: 'ETB', plural: 'Birr',
            fractionalUnit: {
              name: 'cent',
              plural: 'cent',
            },
          }
        });
            printData.premiumType = fireQuotation.request_type;
            printData.total = formatToCurrency(Number(fireQuotation.premium));
            printData.insuranceCoverFor = policy.proposal.fire_proposal.insuranceCoverFor;
            printData.premium = Number(fireQuotation.premium);
            printData.other = formatToCurrency(policy.proposal.fire_proposal.other ? policy.fire_proposal.fireProposal.other : 0);
            printData.being = "Payment for Fire and Lightning insurance cover";
            printData.sumInsured = formatToCurrency(Number(fireQuotation.sumInsured));
            printData.insuranceCoverFor = fireQuotation.being;
            printData.houseNo = policy.proposal.fire_proposal.houseNo;
            // printData.sumOfBirr = numberToWords.toWords(Number(fireQuotation.premium))
            printData.sumOfBirr = sumOfBirr_inWord

            printData.riskCity =  policy.proposal.fire_proposal.riskCity;
            printData.riskworeda = policy.proposal.fire_proposal.riskWoreda;
            printData.riskhouseNo = policy.proposal.fire_proposal.riskHouseNo;  

            
        }
    

        else if (policy.proposal.motorProposalId) {
            let ct = []
            const separated = policy.proposal.motor_proposal.quotation.duration.split(" ");
            const number = separated[0];
            const secondWord = separated[1];
            const firstLetter = secondWord.charAt(0).toLowerCase();
            const effectiveToDuration = moment(policy.proposal.effectiveFrom);
            const added = effectiveToDuration.add(number, firstLetter).format("DD/MM/YYYY");
            
            

            if (policy.proposal.motor_proposal.quotation && policy.proposal.motor_proposal.quotation.addons) {
                let arr = []

                await Promise.all(
                    policy.proposal.motor_proposal.quotation.addons.map(async (e) => {
                        // 
                        // 
                        arr.push({ reason: e.coverRate.coverType, amount: formatToCurrency(e.addonPremium) })
                        ct.push(e.coverRate.coverType)
                    }
                    )
                )
                // 
                printData.fees = arr
            }
            let sumInsured_inWord = toWords.convert(parseFloat(policy.proposal.motor_proposal.quotation.sumInsured), { currency: true, currencyOptions: { name: 'ETB', plural: 'Birr',
            fractionalUnit: {
              name: 'cent',
              plural: 'cent',
            },
          }
        });
        let sumOfBirr_inWord = toWords.convert((parseFloat(policy.proposal.motor_proposal.quotation.premium) + 5), { currency: true, currencyOptions: { name: 'ETB', plural: 'Birr',
            fractionalUnit: {
              name: 'cent',
              plural: 'cent',
            },
          }
        });
            printData.sumInsured = sumInsured_inWord;
            // printData.startDate = policy.proposal.effectiveFrom
            printData.endDate = policy.proposal.effectiveFrom ? added : ""
            printData.premiumType = policy.proposal.motor_proposal.quotation.request_type
            
            printData.being = ct.toString()
            printData.premium = Number(policy.proposal.motor_proposal.quotation.premium)
            printData.total = formatToCurrency(Number(policy.proposal.motor_proposal.quotation.premium)+5)
            printData.sumOfBirr = sumOfBirr_inWord
            printData.branchName = branch.name
            printData.branchCode = branch.short_code

        }




        const path = "/print_files/" + Date.now() + ".pdf";

        //print data
        var document = {
            html: html,
            data: printData,
            path: "." + path,
            type: "",
        };

        await printPdf(document);
        // await Policy.update({})       -- Policy update
        // await Invoice.create()        -- Invoice data
        return path;


    } catch (error) {
        
    }
}

module.exports = {
    getInvoice,
    getInvoiceByPk,
    createInvoice,
    editInvoice,
    deleteInvoice,
    getAllInvoices,
    createInvoices,
};
