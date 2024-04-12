const Contact = require("../../../models/Contact");
const Corporation = require("../../../models/Corporation");
const { ContactStatus } = require("../../../utils/constants");

const getNumberOfContacts = async(req, res) => {
    const numberOfContacts = {contacts: 0, prospects: 0, opportunities: 0};
    try {
        const data = await Contact.findAll({raw: true});
        numberOfContacts.contacts = data.length;
        for (const iterator of data) {
            switch(iterator.status){
                case ContactStatus.prospect:
                    numberOfContacts.prospects++;
                    break;
                case ContactStatus.opportunity:
                    numberOfContacts.opportunities++;
                    break;
            }
        }
        res.status(200).json(numberOfContacts)
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

const getNumberOfAccounts = async(req, res) => {
    const numberOfAccounts = {accounts: 0, prospects: 0, opportunities: 0};
    try {
        const data = await Corporation.findAll();
        numberOfAccounts.accounts = data.length;
        for (const iterator of object) {
            switch(iterator.status){
                case ContactStatus.prospect:
                    numberOfAccounts.prospects++;
                    break;
                case ContactStatus.opportunity:
                    numberOfAccounts.opportunities++;
                    break;
            }
        }
        
        res.status(200).json(numberOfAccounts)
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}
module.exports = {getNumberOfContacts, getNumberOfAccounts}