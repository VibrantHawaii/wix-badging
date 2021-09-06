import wixData from 'wix-data';

export function generateLearnerToken(LearnerName, email) {
    const normalizedLearnerName = (LearnerName + "").replace(/\s/g, "").trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    const seed = normalizedLearnerName + normalizedEmail;
    var hash = 0, i, chr;
    if (seed.length === 0) return hash;
    for (i = 0; i < seed.length; i++) {
        chr   = seed.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
}

export function getLatestEULA() {
    return wixData.query("Badging-EULA")
        .descending("_createdDate")
        .limit(1)
        .find()
        .then( (results) => {
            if (results.items.length != 1)
                return {};
            return results.items[0];
        })
}

export function getRegions() {
    return wixData.query("Badging-Regions")
        .ascending("title")
        .find()
        .then( (results) => {
            if (results.length > 0) {
                let regions = results.items;
                regions.sort((firstEl, secondEl) => {
                    if ((firstEl.title == "Hāmākua") && (secondEl.title == "Hilo"))
                        return -1;
                    else
                        return 1;
                });
                return regions;
            } else {
                return [];
            }
        });
}

export function shortDateString(date) {
    // Format: MM-DD-YYYY hh:mmAMPM
    let hour = date.getHours();
    let PM = false;
    if (hour > 11) {
        PM = true;
        hour -= 12;
    }
    const AMPMstring = PM ? "PM" : "AM";

    let minutes = "" + date.getMinutes();
    if (minutes.length < 2)
        minutes = "0" + minutes;

    return date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear() + " " + hour + ":" + minutes + AMPMstring;
}

const HST_TO_UTC_OFFSET = 10*60*60*1000;
export function fixUpDateForHST(originalDate) {
    let unfixedDate = new Date(originalDate);
    const fixedDateinMS = unfixedDate.getTime() + (HST_TO_UTC_OFFSET);
    return new Date(fixedDateinMS);
}

export function logAndThrowError(message) {
    console.error(message);
    throw(Error(message));
}
