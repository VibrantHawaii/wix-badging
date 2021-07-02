import wixData from 'wix-data';
import wixLocation from 'wix-location';

$w.onReady(function () {
    let badges = "All";
    let regions = "All";
    let badgeMap = [];

    let params = (new URL(wixLocation.url)).searchParams;
    if (params.has("regions")) {
        regions = params.get("regions");
    }
    if (params.has("badges")) {
        badges = params.get("badges");
    }

    wixData.query("BadgesBrief")
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
        $item("#region").text = itemData.region;

        // Configure badges table
        let awardedBadgeCount = itemData.awardedBadges.length;
        console.log("user " + itemData.name + " has " + awardedBadgeCount + " badges awarded");
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
        ]

        $item("#badgesTable").rows = itemData.awardedBadges.map((badgeRef) => {
            return {
                "badgeImg": badgeMap[badgeRef].img,
                "badgeTitle": badgeMap[badgeRef].title
            };
        });

        $item("#badgesTable").show();


        // $item("#name").onClick( (event) => {
        // 	var target = "/learner?";
        // 	target += "name=" + encodeURIComponent(itemData.name);
        // 	wixLocation.to(target);
        // })
    });

    let operatingUserQuery = wixData.query("Users");
    if (regions != "All") {
        operatingUserQuery = operatingUserQuery.contains("regionRef", regions);
    }

    operatingUserQuery
        .ascending("title")
        .find()
        .then( (userResults) => {
            if (userResults.length == 0) {
                $w("#statusText").show();
                $w("#learnersRepeater").hide();
                return;
            }

            let learnerNames = userResults.items.map( (user) => {
                return user._id;
            });

            let operatingAwardedBadgesQuery = wixData.query("AwardedBadges");
            if (badges != "All") {
                // Do not filter out for only awarded badge matches here, as the entire list of awarded badges is required to show all badges for the matching users
                // operatingAwardedBadgesQuery = operatingAwardedBadgesQuery.contains("badgeRef", badges)
                operatingAwardedBadgesQuery = operatingAwardedBadgesQuery.hasSome("userRef", learnerNames)
            }

            operatingAwardedBadgesQuery
                .ascending("userName")
                .find()
                .then( (awardedBadgeResults) => {
                    let matchingAwardedBadgeResults = awardedBadgeResults.items;
                    if (badges != "All") {
                        matchingAwardedBadgeResults = awardedBadgeResults.items.filter((award) => award.badgeRef == badges);
                    };

                    if (matchingAwardedBadgeResults.length == 0) {
                        $w("#statusText").show();
                        $w("#learnersRepeater").hide();
                        return;
                    }

                    $w("#statusText").hide();

                    let userBadgeMap = {};
                    let filteredUsers = userResults.items.filter( user => {
                        let allAwardedBadgeMatches = awardedBadgeResults.items.filter( (awardedBadge) => user._id == awardedBadge.userRef);
                        userBadgeMap[user._id] = allAwardedBadgeMatches.map((award) => award.badgeRef);

                        return matchingAwardedBadgeResults.some( (awardedBadge) => user._id == awardedBadge.userRef);
                    });

                    wixData.query("Regions")
                        .ascending("title")
                        .find()
                        .then( (results) => {
                            if (results.length == 0) {
                                console.error("NO REGIONS FOUND");
                            } else {
                                let regionMap = {};
                                results.items.map((region) => {
                                    regionMap[region._id] = region.title;
                                });

                                let dataArray = filteredUsers.map((user) => {
                                    return {
                                        "_id":user._id,
                                        "name":user.title,
                                        "region":regionMap[user.regionRef],
                                        "awardedBadges":userBadgeMap[user._id]
                                    };
                                })

                                $w("#learnersRepeater").data = dataArray;

                                $w("#learnersRepeater").show();
                            }
                        });
                });
        });
});