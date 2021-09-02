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
        //console.log("Learner " + itemData.name + " has " + awardedBadgeCount + " badges awarded");
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

    let operatingLearnerQuery = wixData.query("Badging-Learners");
    if (regions != "All") {
        operatingLearnerQuery = operatingLearnerQuery.hasSome("supportedRegionsRef", regions);
    }

    operatingLearnerQuery
        .include("supportedRegionsRef")
        .ascending("title")
        .find()
        .then( (learnerResults) => {
            if (learnerResults.length == 0) {
                $w("#statusText").show();
                $w("#loadingAnimationText").hide();
                $w("#learnersRepeater").hide();
                return;
            }

            let learnerIDs = learnerResults.items.map( (learner) => {
                return learner._id;
            });

            let operatingAwardedBadgesQuery = wixData.query("Badging-AwardedBadges");
            if (badges != "All") {
                // Do not filter out for only awarded badge matches here, as the entire list of awarded badges is required to show all badges for the matching Learners
                operatingAwardedBadgesQuery = operatingAwardedBadgesQuery.hasSome("learnerRef", learnerIDs)
            }

            let now = new Date();

            operatingAwardedBadgesQuery
                .lt("awardedDate", now)
                // .ascending("learnerName")
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

                    let LearnerBadgeMap = {};
                    let filteredLearners = learnerResults.items.filter( learner => {
                        let allAwardedBadgeMatches = matchingAwardedBadgeResults.filter( (awardedBadge) => learner._id == awardedBadge.learnerRef);
                        LearnerBadgeMap[learner._id] = allAwardedBadgeMatches.map((award) => award.badgeRef);

                        return matchingAwardedBadgeResults.some( (awardedBadge) => learner._id == awardedBadge.learnerRef);
                    });

                    let dataArray = filteredLearners.map((Learner) => {
                        let supportedRegionsTitleArray = Learner.supportedRegionsRef.map(regionData => {
                            return regionData.title;
                        });
                        let supportedRegionString = supportedRegionsTitleArray.join(", ");

                        return {
                            "_id":Learner._id,
                            "name":Learner.title,
                            "supportedRegions": supportedRegionString,
                            "awardedBadges":LearnerBadgeMap[Learner._id]
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