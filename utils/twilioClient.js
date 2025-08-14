import dotenv from "dotenv";
dotenv.config(); 
import twilioImport from "twilio";

const twilio = twilioImport.default || twilioImport;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// console.log("Twilio Account SID:", accountSid);
// console.log("Twilio Auth Token:", authToken);

if (!accountSid || !authToken) {
  console.error(" Twilio SID or Token is missing");
}

const client = twilio(accountSid, authToken);

export default client;
