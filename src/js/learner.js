import wixData from 'wix-data';
import wixLocation from 'wix-location';

$w.onReady(function () {
    let badges = "All";
    let regions = "All";

    let params = (new URL(wixLocation.url)).searchParams;
    if (params.has("regions")) {
        regions = params.get("regions");
    }
    if (params.has("badges")) {
        badges = params.get("badges");
    }

    $w("#learnersRepeater").onItemReady(($item, itemData, index) => {
        $item("#name").text = itemData.name;
        $item("#region").text = itemData.region;

        // $item("#name").onClick( (event) => {
        // 	var target = "/learner?";
        // 	target += "name=" + encodeURIComponent(itemData.name);
        // 	wixLocation.to(target);
        // })
    });

    let operatingUserQuery = wixData.query("Users");
    if (regions != "All") {
        operatingUserQuery = operatingUserQuery.contains("region", regions);
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
                return user.title;
            });

            let operatingAwardedBadgesQuery = wixData.query("AwardedBadges");
            if (badges != "All") {
                operatingAwardedBadgesQuery = operatingAwardedBadgesQuery.contains("badgeName", badges)
                operatingAwardedBadgesQuery = operatingAwardedBadgesQuery.hasSome("userName", learnerNames)
            }

            operatingAwardedBadgesQuery
                .ascending("userName")
                .find()
                .then( (awardedBadgeResults) => {
                    if (awardedBadgeResults.length == 0) {
                        $w("#statusText").show();
                        $w("#learnersRepeater").hide();
                        return;
                    }

                    $w("#statusText").hide();

                    let filteredUsers = userResults.items.filter( user => {
                        return awardedBadgeResults.items.some( (awardedBadge) => user.title == awardedBadge.userName);
                    });

                    let dataArray = filteredUsers.map((user) => {
                        return {
                            "_id":user.title.replace(/\W/g, ''),
                            "name":user.title,
                            "region":user.region
                        };
                    })
                    $w("#learnersRepeater").data = dataArray;

                    $w("#learnersRepeater").show();
                });
        });
});