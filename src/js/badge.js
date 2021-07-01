import wixData from 'wix-data';
import wixLocation from 'wix-location';

$w.onReady(function () {
    let params = (new URL(wixLocation.url)).searchParams;

    if (params.has("name")) {
        let name = decodeURIComponent(params.get("name"));

        wixData.query("BadgesBrief")
            .contains("title", params.get("name"))
            .find()
            .then( (results) => {
                if (results.length == 0) {
                    console.error("ERROR - BADGE \"" + params.get("name") + "\" WAS NOT FOUND")
                    return;
                }
                if (results.length > 1) {
                    console.error("ERROR - " + results.length + " BADGES FOUND WITH THE NAME \"" + params.get("name") + "\"");
                    return;
                }

                let badge = results.items[0];
                $w("#name").text = badge.title;
                $w("#badgeImg").src = badge.imageUrl[0].src;

                wixData.query("BadgesDetailed")
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
        console.error("ERROR - NO BADGE NAME SUPPLIED IN QUERY PARAMS")
    }
});
