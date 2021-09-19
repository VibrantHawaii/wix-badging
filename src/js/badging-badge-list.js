import wixData from 'wix-data';
import wixLocation from 'wix-location';

let stillLoadingPageData = true;
let stillLoadingPageDataAnimationStage = 3; // 1, 2, or 3. Start at 3 to immediately cause wrap around to 1 on instantiation.
const BASE_LOADING_ANIMATION_TEXT = "Loading Badges.";

$w.onReady(function () {
    let badgeMap = [];

    loadingPageDataAnimation();

    wixData.query("Badging-BadgesBrief")
        .include("badgeCategoryRef")
        .find()
        .then( (badgeResults) => {
            let badges = badgeResults.items;

            // Only show contributor badges
            badges = badges.filter((badge) => {
                return badge.badgeCategoryRef.category === "Contributor";
            });

            if (badges.length == 0) {
                stillLoadingPageData = false;
                $w("#statusText").show();
                $w("#loadingAnimationText").hide();
                $w("#badgesRepeater").hide();
                console.error("ERROR - NO BADGES FOUND")
                return;
            }

            badgeMap = badges.map((badgeItem) => {
                return {
                    "_id":badgeItem._id,
                    "name": badgeItem.title,
                    "description": badgeItem.shortDescription,
                    "img": badgeItem.imageUrl[0].src
                };
            });

            $w("#badgesRepeater").data = badgeMap;
            $w("#statusText").hide();
            $w("#loadingAnimationText").hide();
            stillLoadingPageData = false;
            $w("#badgesRepeater").show();
        });

    $w("#badgesRepeater").onItemReady(($item, itemData, index) => {
        $item("#name").text = itemData.name;
        $item("#description").text = itemData.description;
        $item("#badgeImg").src = itemData.img;

        function badgeItemClicked(event) {
            let badgeId = itemData._id;
            var target = "/badging-badge?";
            target += "id=" + encodeURIComponent(badgeId);
            wixLocation.to(target);
        }

        $item("#name").onClick(badgeItemClicked);
        $item("#description").onClick(badgeItemClicked);
        $item("#badgeImg").onClick(badgeItemClicked);
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