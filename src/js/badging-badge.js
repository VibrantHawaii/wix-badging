import wixData from 'wix-data';
import wixLocation from 'wix-location';

$w.onReady(function () {
    let params = (new URL(wixLocation.url)).searchParams;

    let briefQuery = wixData.query("Badging-BadgesBrief");

    let name = "";
    let badgeId = "";

    if (params.has("name")) {
        name = decodeURIComponent(params.get("name"));
        briefQuery = briefQuery.contains("title", name);
    }
    if (params.has("id")) {
        badgeId = decodeURIComponent(params.get("id"));
        briefQuery = briefQuery.contains("_id", badgeId);
    }

    if (name || badgeId) {
        briefQuery
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

                        $w("#longDescription").text = badgeResults.items[0].detailedDescription;
                        $w("#name").show();
                        $w("#badgeImg").show();
                        $w("#longDescription").show();
                    });
            });
    } else {
        console.error("ERROR - NO BADGE NAME OR ID SUPPLIED IN QUERY PARAMS")
    }
});
