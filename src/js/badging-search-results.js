import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixWindow from 'wix-window';

let stillLoadingPageData = true;
let stillLoadingPageDataAnimationStage = 3; // 1, 2, or 3. Start at 3 to immediately cause wrap around to 1 on instantiation.
const BASE_LOADING_ANIMATION_TEXT = "Searching the island.";

$w.onReady(function () {
    let badges = "All";
    let regions = "All";
    let badgeMap = [];

    loadingPageDataAnimation();

    let params = (new URL(wixLocation.url)).searchParams;
    if (params.has("regions")) {
        regions = params.get("regions");
    }
    if (params.has("badges")) {
        badges = params.get("badges");
    }

    wixData.query("Badging-BadgesBrief")
        .find()
        .then( (badgeResults) => {
            if (badgeResults.length == 0) {
                console.error("ERROR - NO BADGES FOUND")
                return;
            }

            badgeResults.items.map((badgeItem) => {
                badgeMap[badgeItem._id] = {
                    "img": badgeItem.imageUrl[0].src,
                    "title": badgeItem.title,
                };
            });
        });

    $w("#learnersRepeater").onItemReady(($item, itemData, index) => {
        $item("#name").text = itemData.name;
        $item("#supportedRegions").text = "Supporting: " + itemData.supportedRegions;

        // Configure badges table
        let awardedBadgeCount = itemData.awardedBadges.length;
        //console.log("user " + itemData.name + " has " + awardedBadgeCount + " badges awarded");
        $item("#badgesTable").columns = [
            {
                "id": "badgeImg",
                "dataPath": "badgeImg",
                "label": "badgeImg",
                "type": "image",
                "width": 80
            },
            {
                "id": "badgeTitle",
                "dataPath": "badgeTitle",
                "label": "badgeTitle",
                "type": "string",
                "width": 300
            },
            {
                "id": "badgeId",
                "dataPath": "badgeId",
                "label": "badgeId",
                "type": "string",
                "width": 0,
                "visible": false
            },
        ];

        $item("#badgesTable").rows = itemData.awardedBadges.map((badgeRef) => {
            return {
                "badgeImg": badgeMap[badgeRef].img,
                "badgeTitle": badgeMap[badgeRef].title,
                "badgeId": badgeRef
            };
        });

        $item("#badgesTable").onRowSelect( (event) => {
            let badgeId = event.rowData.badgeId;
            var target = "/badging-badge?";
            target += "id=" + encodeURIComponent(badgeId);
            wixLocation.to(target);
        } );

        $item("#contactBtn").onClick((event) => {
            wixWindow.openLightbox("Badging Contact Popup", {
                "learnerID": itemData._id,
                "learnerName": itemData.name
            })
        });

        $item("#badgesTable").show();
    });

    let operatingUserQuery = wixData.query("Badging-Users");
    if (regions != "All") {
        operatingUserQuery = operatingUserQuery.hasSome("supportedRegionsRef", regions);
    }

    operatingUserQuery
        // .include("title", "_id", "supportedRegionsRef")
        .include("supportedRegionsRef")
        .ascending("title")
        .find()
        .then( (userResults) => {
            if (userResults.length == 0) {
                $w("#statusText").show();
                $w("#loadingAnimationText").hide();
                $w("#learnersRepeater").hide();
                return;
            }

            let learnerNames = userResults.items.map( (user) => {
                return user._id;
            });

            let operatingAwardedBadgesQuery = wixData.query("Badging-AwardedBadges");
            if (badges != "All") {
                // Do not filter out for only awarded badge matches here, as the entire list of awarded badges is required to show all badges for the matching users
                // operatingAwardedBadgesQuery = operatingAwardedBadgesQuery.contains("badgeRef", badges)
                operatingAwardedBadgesQuery = operatingAwardedBadgesQuery.hasSome("userRef", learnerNames)
            }

            let now = new Date();

            operatingAwardedBadgesQuery
                .lt("awardedDate", now)
                // .gt("expiryDate", now)
                .ascending("userName")
                .find()
                .then( (awardedBadgeResults) => {
                    let matchingAwardedBadgeResults = awardedBadgeResults.items.filter((award) => {
                        if (award.expiryDate === undefined)
                            return true;
                        return (award.expiryDate.getTime() > now.getTime());
                    });
                    if (badges != "All") {
                        matchingAwardedBadgeResults = matchingAwardedBadgeResults.filter((award) => award.badgeRef == badges);
                    };

                    if (matchingAwardedBadgeResults.length == 0) {
                        $w("#statusText").show();
                        $w("#loadingAnimationText").hide();
                        $w("#learnersRepeater").hide();
                        return;
                    }

                    $w("#statusText").hide();

                    let userBadgeMap = {};
                    let filteredUsers = userResults.items.filter( user => {
                        let allAwardedBadgeMatches = matchingAwardedBadgeResults.filter( (awardedBadge) => user._id == awardedBadge.userRef);
                        userBadgeMap[user._id] = allAwardedBadgeMatches.map((award) => award.badgeRef);

                        return matchingAwardedBadgeResults.some( (awardedBadge) => user._id == awardedBadge.userRef);
                    });

                    let dataArray = filteredUsers.map((user) => {
                        let supportedRegionsTitleArray = user.supportedRegionsRef.map(regionData => {
                            return regionData.title;
                        });
                        let supportedRegionString = supportedRegionsTitleArray.join(", ");

                        return {
                            "_id":user._id,
                            "name":user.title,
                            "supportedRegions": supportedRegionString,
                            "awardedBadges":userBadgeMap[user._id]
                        };
                    })

                    $w("#learnersRepeater").data = dataArray;
                    $w("#loadingAnimationText").hide();
                    stillLoadingPageData = false;
                    $w("#learnersRepeater").show();
                });
        });
});

function loadingPageDataAnimation() {
    if (stillLoadingPageData) {
        // Requeue animation
        let newText = BASE_LOADING_ANIMATION_TEXT;
        switch (stillLoadingPageDataAnimationStage) {
            case 1:
                stillLoadingPageDataAnimationStage++;
                break;
            case 2:
                stillLoadingPageDataAnimationStage++;
                newText = newText + "."
                break;
            case 3:
                stillLoadingPageDataAnimationStage = 1;
                newText = newText + ".."
                break;
        }

        $w("#loadingAnimationText").text = newText;
        setTimeout(loadingPageDataAnimation, 700);
    }
}