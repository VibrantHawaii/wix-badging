import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixWindow from 'wix-window';

let badgeId = "";
let badgeUrl = "";

$w.onReady(function () {
    $w("#enrollBtn").onClick(() => {
        const popupContext = {
            "badgeId": badgeId,
            "badgeUrl": badgeUrl
        };
        wixWindow.openLightbox("Badging Enroll Learner Popup", popupContext);
    })

    let params = (new URL(wixLocation.url)).searchParams;

    if (params.has("id")) {
        badgeId = decodeURIComponent(params.get("id"));
        wixData.query("Badging-BadgesBrief")
            .contains("_id", badgeId)
            .find()
            .then( (results) => {
                if (results.length == 0) {
                    if (params.get("name"))
                        console.error("ERROR - BADGE \"" + params.get("name") + "\" WAS NOT FOUND")
                    if (params.get("id"))
                        console.error("ERROR - BADGE WITH ID \"" + params.get("id") + "\" WAS NOT FOUND")
                    return;
                }
                if (results.length > 1) {
                    console.error("ERROR - " + results.length + " BADGES FOUND WITH THE NAME \"" + params.get("name") + "\"");
                    return;
                }

                let badge = results.items[0];
                badgeUrl = badge.enrollUrl;

                $w("#name").text = badge.title;
                $w("#badgeImg").src = badge.imageUrl[0].src;

                wixData.query("Badging-BadgesDetailed")
                    .contains("title", badge.title)
                    .find()
                    .then( (badgeResults) => {
                        if (badgeResults.length == 0) {
                            console.error("ERROR - " + results.length + " BADGE DETAILS FOUND WITH THE NAME \"" + params.get("name") + "\"");
                            return;
                        }

                        if (badgeUrl !== undefined)
                            $w("#enrollBtn").show();

                        $w("#longDescription").html = badgeResults.items[0].detailedDescription;
                        $w("#name").show();
                        $w("#badgeImg").show();
                        $w("#longDescription").show();
                    });
            });
    } else {
        console.error("ERROR - NO BADGE ID SUPPLIED IN QUERY PARAMS")
    }
});