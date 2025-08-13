import PDIRequestModel from "../models/PDIRequest.model.js";

async function getCityPrefix(address) {
  const FIXED_SUFFIX = "2105";

  
  let prefix = "PUN"; 
  if (address && typeof address === "string") {
    let city = "";
    if (address.includes(",")) {
      const parts = address
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      city = parts[parts.length - 1];
    } else {
      city = address.trim();
    }
    if (city) {
      prefix = city.slice(0, 3).toUpperCase();
    }
  }

  
  const lastDoc = await PDIRequestModel.findOne(
    { bookingId: { $regex: `^${prefix}${FIXED_SUFFIX}` } },
    { bookingId: 1 },
    { sort: { createdAt: -1 } }
  );

  
  let nextSerial = 1;
  if (lastDoc?.bookingId) {
    const lastSerial = parseInt(lastDoc.bookingId.slice(-5), 10);
    if (!isNaN(lastSerial)) {
      nextSerial = lastSerial + 1;
    }
  }

  
  const serial = String(nextSerial).padStart(5, "0");

  return `${prefix}${FIXED_SUFFIX}${serial}`;
}

export default getCityPrefix;