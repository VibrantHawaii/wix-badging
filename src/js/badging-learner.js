import wixData from 'wix-data';
import wixLocation from 'wix-location';

$w.onReady(function () {
    $w("#badgeRepeater").onItemReady(($item, itemData, index) => {
        $item("#badgeName").text = itemData.badgeName;
        $item("#shortDescription").text = itemData.shortDescription;
        $item("#badgeImg").src = itemData.imageUrl;

        // TODO make click on any element in this cell result in navigation to the badge page
        let goToBadgePage = function () {
            var target = "/badging-badge?";
            target += "name=" + encodeURIComponent(itemData.badgeName);
            wixLocation.to(target);
        }

        $item("#badgeImg").onClick( (event) => {
            goToBadgePage();
        });
        $item("#badgeName").onClick( (event) => {
            goToBadgePage();
        });
        $item("#readMoreBtn").onClick( (event) => {
            goToBadgePage();
        });
        $item("#shortDescription").onClick( (event) => {
            goToBadgePage();
        });
    });

    let noBadgesAwarded = function () {
        // User had no badges
        $w("#badgeRepeater").hide();
        $w("#noBadgesText").show();
    }

    let params = (new URL(wixLocation.url)).searchParams;

    if (params.has("name")) {
        let name = decodeURIComponent(params.get("name"));

        wixData.query("Badging-Learners")
            .contains("title", params.get("name"))
            .find()
            .then( (results) => {
                if (results.length == 0) {
                    console.error("ERROR - NO USERS FOUND")
                    return;
                }
                if (results.length > 1) {
                    console.error("ERROR - " + results.length + " USERS FOUND WITH THE SAME NAME");
                    return;
                }

                let learner = results.items[0];
                $w("#name").text = learner.title;
                $w("#region").text = learner.region;

                $w("#portfolioBtn").onClick( (event) => {
                    wixLocation.to(learner.gDrivePortfolioUrl);
                });

                wixData.query("Badging-AwardedBadges")
                    .contains("learnerName", learner.title)
                    .find()
                    .then( (badgeResults) => {
                        if (badgeResults.length == 0) {
                            noBadgesAwarded();
                            return;
                        }

                        let awardedBadges = badgeResults.items.map( (award) => {
                            return award.badgeName;
                        });

                        wixData.query("Badging-BadgesBrief")
                            .hasSome("title", awardedBadges)
                            .find()
                            .then( (badgeResults) => {
                                let badges = badgeResults.items;
                                if (badges.length == 0) {
                                    noBadgesAwarded();
                                    return;
                                }

                                let dataArray = badges.map((item) => {
                                    return {
                                        "_id":item.title.replace(/\W/g, ''),
                                        "badgeName":item.title,
                                        "shortDescription":item.shortDescription,
                                        "imageUrl":item.imageUrl[0].src
                                    };
                                })
                                $w("#badgeRepeater").data = dataArray;

                                $w("#badgeRepeater").show();
                            });
                    });

            });
    } else {
        console.error("ERROR - NO USER NAME SUPPLIED IN QUERY PARAMS")
    }
});
