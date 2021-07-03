import wixData from 'wix-data';
import wixLocation from 'wix-location';

$w.onReady(function () {
    wixData.query("Badging-Regions")
        .ascending("title")
        .find()
        .then( (results) => {
            if (results.length > 0) {
                var searchOptions = [{"label":"All", "value":"All"}];
                searchOptions.push(...results.items.map((region) => {
                    return {"label":region.title, "value":region._id}
                }));
                $w("#searchByRegion").options = searchOptions;
            } else {
                console.error("NO REGIONS FOUND");
            }
        });

    wixData.query("Badging-BadgesBrief")
        .ascending("title")
        .find()
        .then( (results) => {
            if (results.length > 0) {
                var searchOptions = [{"label":"All", "value":"All"}];
                searchOptions.push(...results.items.map((badge) => {
                    return {"label":badge.title, "value":badge._id}
                }));
                $w("#searchByBadge").options = searchOptions;
            } else {
                console.error("NO BADGES FOUND");
            }
        });

});

export function searchBtn_click(event) {
    var regions = $w("#searchByRegion").value ? $w("#searchByRegion").value : "All";
    var badges = $w("#searchByBadge").value ? $w("#searchByBadge").value : "All";

    var target = "/badging-search-results?";
    target += "regions=" + encodeURIComponent(regions) + "&";
    target += "badges=" + encodeURIComponent(badges);
    wixLocation.to(target);
}