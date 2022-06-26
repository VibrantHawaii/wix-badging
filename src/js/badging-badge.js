import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixWindow from 'wix-window';

let badgeId = "";
let enrollUrl = "";

$w.onReady(function () {
    $w("#enrollBtn").onClick(() => {
        const popupContext = {
            "badgeId": badgeId,
            "enrollUrl": enrollUrl
        };
        wixWindow.openLightbox("Badging Enroll Learner Popup", popupContext);
    })

    let params = (new URL(wixLocation.url)).searchParams;

    if (params.has("id")) {
        badgeId = decodeURIComponent(params.get("id"));
        wixData.query("Badging-BadgesBrief")
            .include(("iconRef"))
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
                enrollUrl = badge.enrollUrl;

                $w("#name").text = badge.title;
                $w("#badgeImg").src = badge.iconRef.icon;

                wixData.query("Badging-BadgesDetailed")
                    .contains("title", badge.title)
                    .find()
                    .then( (badgeResults) => {
                        if (badgeResults.length == 0) {
                            console.error("ERROR - " + results.length + " BADGE DETAILS FOUND WITH THE NAME \"" + params.get("name") + "\"");
                            return;
                        }

                        if ((enrollUrl !== undefined) && (enrollUrl !== null) && (enrollUrl !== ""))
                            $w("#enrollBtn").show();

                        $w("#longDescription").html = '<span style="color:black;font-size:18px;>' + badgeResults.items[0].detailedDescription + "</span>";

                        $w("#name").show();
                        $w("#badgeImg").show();
                        $w("#longDescription").show();
                    });
            });
    } else {
        console.error("ERROR - NO BADGE ID SUPPLIED IN QUERY PARAMS")
    }
});