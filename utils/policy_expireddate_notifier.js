const fs = require('fs');
const axios = require('axios');
var moment = require('moment-timezone');
moment.tz.setDefault("Africa/Addis_Ababa");
const Customer = require("../models/customer/Customer");
const { isPhoneNoValid, getFileExtension } = require("../utils/GeneralUtils");
const { Op } = require("sequelize");
const { sendNewSms } = require("../apis/handlers/SMSServiceHandler");
const { sendNewEmail } = require("../apis/handlers/EmailServiceHandler");
const User = require("../models/acl/user");
const Emailcc = require("../models/EmailCc");
const Document = require("../models/Document");
const EmailDocument = require("../models/EmailDocument");
const Contact = require("../models/Contact");
const Proposal = require("../models/proposals/Proposal")
const Policy = require("../models/Policy")
const Email = require("../models/EmailModel")

exports.sendEmailCron_JOB = async () => {
    try {
        // Retrieve customers and associated contacts
        const customers = await Customer.findAll(
            {
             raw:true
        });

        if (customers.length === 0) {
            return { message: "No customers found" };
        }
        console.log("customers",customers)
     
        const contactIds = customers.map(customer => customer.contactId);
        const oneMonthFromNow = moment().add(1, 'months').toDate();

        // Retrieve policies that are going to expire one month from now
        const policies = await Policy.findAll(
            {
            raw:true,
            where: {
                [Op.and]: [
                    { policyEndDate: { [Op.lt]: oneMonthFromNow } },
                    { customerId: { [Op.not]: null } },
                    { customerId: { [Op.in]: contactIds } }
                ]
            }
        });
        if (policies.length === 0) {
            return { message: "No policies found" };
            
        }
        //Retrieve contacts based on customer IDs
        const policy_owner_ids = policies.map(_policy => {
            return _policy.customerId;
        });
        //console.log("ids",policy_owner_ids)
        
        const contacts = await Contact.findAll({
            raw: true,
            where: {
                
                     id: { [Op.in]: policy_owner_ids } 
                
            }
        });
        //console.log("contacts",contacts)

        // Prepare and send emails
        const emailPromises = contacts.map(async contact => {
            let sendTo = "";
            if (contact.primaryEmail) {
                sendTo = contact.primaryEmail;
            }
            if (contact.secondaryEmail) {
                sendTo = contact.secondaryEmail
            }

            const email = {
                userId: contact.id,
                subject: "Policy Expiration Notification",
                message: `Hi ${contact.firstName}, Just a quick heads-up: Your policy is set to expire in one month! Don't forget to renew to keep your coverage intact. We're here to help if you have any questions. Best,`,
                emailCCs: [],
                documents: []
            };

            const from = "";
            const subject = "Renewal Reminder: Your Policy Expires Soon!";
            const message = `Hi ${contact.firstName}, Just a quick heads-up: Your policy is set to expire in one month! Don't forget to renew to keep your coverage intact. We're here to help if you have any questions. Best,`;

            try {
              const sentEmailCount = await sendNewEmail(sendTo, [], subject, message, [], from);
               return { email, sentEmailCount };
            } catch (error) {
              
                console.error(`Error sending email to ${sendTo.join(", ")}:`, error);
                return null; // Mark the email as failed
            }
        });

        const emailResults = await Promise.all(emailPromises);

        // Filter successful and failed email sends
        const successfulEmails = [];
        const failedEmails = [];
        emailResults.forEach(result => {
            if (result) {
                if (result.sentEmailCount >= 1) {
                    successfulEmails.push(result.email);
                } else {
                    failedEmails.push(result.email);
                }
            }
        });
    
        // Retry sending failed emails
        const retryPromises = failedEmails.map(async failedEmail => {
            // Implement retry logic here
            // You can decide the maximum number of retries and interval between retries
            const maxRetries = 3;
            let retryCount = 0;
            let success = false;
            while (!success && retryCount < maxRetries) {
                try {
                    await sendNewEmail([...failedEmail.sendTo], [...failedEmail.emailCCs], failedEmail.subject, failedEmail.message, [...failedEmail.documents], from);
                    success = true;
                } catch (error) {
                   // console.error(`Retry ${retryCount + 1} failed for email to ${failedEmail.sendTo.join(", ")}:`, error);
                    retryCount++;
                }
            }
            if (success) {
                return failedEmail;
            } else {
                return null; // Mark the email as permanently failed
            }
        });

        const retryResults = await Promise.all(retryPromises);
        const successfulRetryEmails = retryResults.filter(result => result !== null);

        // Save successfully sent emails to the database
        if (successfulEmails.length > 0 || successfulRetryEmails.length > 0) {
            const createdEmails = await Email.bulkCreate([...successfulEmails, ...successfulRetryEmails], { individualHooks: true });
            console.log("emailsent", createdEmails)
            return { message: `Emails created: ${JSON.stringify(createdEmails)}` };
        } else {
            return { message: "No emails sent" };
        }
    } catch (error) {
        console.error("Error sending emails:", error);
        return { message: "Failed to send emails" };
    }
};