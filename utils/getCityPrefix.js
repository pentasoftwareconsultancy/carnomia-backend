const idCounters = {};

function getCityPrefix(address) {
  const FIXED_SUFFIX = "2105";

  let prefix = "PUN";
  if (address && typeof address === "string") {
    let city = "";

    if (address.includes(",")) {
      // Get last non-empty part
      const parts = address
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
      city = parts[parts.length - 1];
    } else {
      city = address.trim();
    }

    if (city) {
      prefix = city.slice(0, 3).toUpperCase();
    }
  }

  // Initialize or increment counter
  if (!idCounters[prefix]) {
    idCounters[prefix] = 1;
  } else {
    idCounters[prefix]++;
  }

  const serial = String(idCounters[prefix]).padStart(3, "0");

  return `${prefix}${FIXED_SUFFIX}${serial}`;
}

export default getCityPrefix;
