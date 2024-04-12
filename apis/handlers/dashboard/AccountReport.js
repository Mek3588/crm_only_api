import Corporation from "../../../models/Corporation"

const getNumberOfAccount = async (req, res) => {
    const numberOfAccount = { totalAccount: 0, prospects: 0, opportunities: 0, lead: 0, customer: 0 };
    try {
        const data = await Corporation.findAll({raw: true});
        numberOfAccount.Corporation= data.length;
        for (const iterator of data) {
            switch(iterator.status){
                case ContactStatus.prospect:
                    numberOfAccount.prospects++;
                    break;
                case ContactStatus.opportunity:
                    numberOfAccount.opportunities++;
                    break;
                  case ContactStatus.lead:
                    numberOfAccount.lead++;
                    break;
                case ContactStatus.customer:
                    numberOfAccount.customer++;
                    break;
            }
        }
        res.status(200).json(numberOfAccount)
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

module.export ={getNumberOfAccount}