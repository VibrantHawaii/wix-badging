import wixData from 'wix-data';

export function generateUserToken(userName, email) {
    const normalizedUserName = (userName + "").replace(/\s/g, "").trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    const seed = normalizedUserName + normalizedEmail;
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