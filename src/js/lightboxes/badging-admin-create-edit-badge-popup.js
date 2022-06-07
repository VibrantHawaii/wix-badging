import wixData from 'wix-data';
import wixWindow from 'wix-window';
import {createBadge} from "backend/badging-create-badge"

let badgeId = "";
let badge = {};
let editBadge = false;

$w.onReady(function () {
    let context = wixWindow.lightbox.getContext();
    if (context !== undefined)
        badgeId = context.badgeId;

    const editBadgeQuery = new Promise((resolve) => {
        if (badgeId) {
            return wixData.query("Badging-BadgesBrief")
                .include("badgeCategoryRef", "iconRef")
                .contains("_id", badgeId)
                .find()
                .then(badgesResults => {
                    let badges = badgesResults.items;
                    if (badges.length === 1) {
                        badge = badges[0];
                        editBadge = true;
                        $w("#title").text = "EDIT BADGE";
                        $w("#badgeNameInput").value = badge.title;
                        // $w("#shortDescriptionInput").value = badge.shortDescription;
                        $w("#infoPageUrlInput").value = badge.infoPageUrl;
                        $w("#enrollmentUrlInput").value = badge.enrollURL;
                        if ((badge.teachableCourseId !== undefined) && (badge.teachableCourseId !== null) && (badge.teachableCourseId !== "")) {
                            $w("#onTeachableCheckbox").checked = true;
                            $w("#teachableCourseIdInput").value = badge.teachableCourseId;
                            $w("#onTeachableCheckbox").onChange(null);
                        }
                        if ((badge.expiryRule !== undefined) && (badge.expiryRule !== null) && (badge.expiryRule !== "") && (badge.expiryRule !== 0)) {
                            $w("#expiresCheckbox").checked = true;
                            $w("#expiryMonthsDropdown").value = badge.expiryRule;
                            $w("#expiresCheckbox").onChange(null);
                        }
                        return wixData.query("Badging-BadgesDetailed")
                            .include("badgeRef")
                            .contains("badgeRef", badgeId)
                            .find()
                            .then(badgesDetailedResults => {
                                let badgesDetailed = badgesDetailedResults.items;
                                if (badgesDetailed.length === 1)
                                    $w("#detailedDescriptionRichTextBox").value = badgesDetailed[0].detailedDescription;
                            })
                    }
                    resolve();
                })
        }
        else
            resolve();
    });

    editBadgeQuery
        .then(() => {
            return wixData.query("Badging-BadgeCategories")
                .descending("category")
                .find()
        })
        .then( (results) => {
            let categories = results.items;
            if (categories.length === 0) {
                showStatusAndResetPopup("No badging categories found");
                return;
            }

            var categoryOptions = categories.map((category) => {
                return {"label":category.category, "value":category._id}
            });
            $w("#categoryDropdown").options = categoryOptions;

            if (editBadge)
                $w("#categoryDropdown").value = badge.badgeCategoryRef._id;
        })
        .catch(error => {
            showStatusAndResetPopup(error);
        });

    $w("#badgeIconDataset").onReady(() => $w("#badgeIconDataset").add());
    $w("#badgeNameInput").onChange(testAllInputs);
    $w("#categoryDropdown").onChange(testAllInputs);
    $w("#onTeachableCheckbox").onChange(testAllInputs);
    $w("#infoPageUrlInput").onChange(testAllInputs);
    $w("#teachableCourseIdInput").onChange(testAllInputs);
    $w("#expiresCheckbox").onChange(testAllInputs);
    $w("#expiryMonthsDropdown").onChange(testAllInputs);
    // $w("#shortDescriptionInput").onChange(testAllInputs);
    $w("#detailedDescriptionRichTextBox").onChange(testAllInputs);

    $w("#expiresCheckbox").onChange(() => {
        if ($w("#expiresCheckbox").checked === true) {
            $w("#expiresMonthsPrompt").show();
            $w("#expiryMonthsDropdown").show();
        } else {
            $w("#expiresMonthsPrompt").hide();
            $w("#expiryMonthsDropdown").hide();
        }
    })

    $w("#onTeachableCheckbox").onChange(() => {
        if ($w("#onTeachableCheckbox").checked === true) {
            $w("#teachableCourseIdInput").required = true;
            $w("#teachableIdBox").expand()
                .then(() => $w("#teachableIdBox").show());
        } else {
            $w("#teachableCourseIdInput").required = false;
            $w("#teachableIdBox").hide();
            $w("#teachableIdBox").collapse();
        }
    })

    $w("#uploadFileBtn").onChange(() => {
        $w("#uploadFileBtn").uploadFiles()
            .catch(uploadError => showStatusAndResetPopup(uploadError.errorDescription))
    });

    // The submit button is also configured in the Wix UI to perform a submit on the Badging-BadgeIcons dataset
    $w("#submitBtn").onClick(() => {
        $w("#submitBtn").disable();
        $w("#submitBtn").label = "Please wait...";
        $w("#badgeNameInput").disable();
        $w("#categoryDropdown").disable();
        $w("#uploadFileBtn").disable();
        $w("#onTeachableCheckbox").disable();
        $w("#enrollmentUrlInput").disable();
        $w("#infoPageUrlInput").disable();
        $w("#teachableCourseIdInput").disable();
        $w("#expiresCheckbox").disable();
        $w("#expiryMonthsDropdown").disable();
        // $w("#shortDescriptionInput").disable();
        $w("#detailedDescriptionRichTextBox").disable();
    })

    $w("#badgeIconDataset").onAfterSave((itemBeforeSave, itemAfterSave) => {
        $w("#badgeIconImage").src = itemAfterSave.icon;
        $w("#badgeIconImage").show();

        const name = $w("#badgeNameInput").value;
        const category = $w("#categoryDropdown").value;
        const teachableId = $w("#teachableCourseIdInput").value;
        const shortDescription = $w("#shortDescriptionInput").value;
        const detailedDescription = $w("#detailedDescriptionRichTextBox").value;

        let expiryInMonths = null;
        if (($w("#expiresCheckbox").checked === true) && ($w("#expiryMonthsDropdown").selectedIndex != undefined)) {
            expiryInMonths = $w("#expiryMonthsDropdown").value;
        }

        const iconId = itemAfterSave._id;
        const infoPageURL = $w("#infoPageUrlInput").value;
        const enrollURL = $w("#enrollmentUrlInput").value;
        return createBadge(name, category, shortDescription, detailedDescription, iconId, infoPageURL, enrollURL, expiryInMonths, teachableId)
            .then(response => {
                if (response.success !== true) {
                    showStatusAndResetPopup(response.errorMsg);
                    return;
                }

                $w("#status").text = ("Badge created. You can close this popup");
                $w("#status").show();
            })
    })
})

function testAllInputs() {
    if (areAllInputsValid())
    {
        $w("#submitBtn").enable();
    }
    else
        $w("#submitBtn").disable();
}

function areAllInputsValid() {
    return ($w("#badgeNameInput").valid &&
        $w("#categoryDropdown").valid &&
        $w("#uploadFileBtn").valid &&
        (($w("#onTeachableCheckbox").checked !== true) || (($w("#onTeachableCheckbox").checked === true) && ($w("#teachableCourseIdInput").valid))) &&
        (($w("#expiresCheckbox").checked !== true) || (($w("#expiresCheckbox").checked === true) && ($w("#expiryMonthsDropdown").selectedIndex != undefined))) &&
        // $w("#shortDescriptionInput").valid &&
        // $w("#shortDescriptionInput").value.length >= 10 &&
        (($w("#infoPageUrlInput").valid ||
            ($w("#detailedDescriptionRichTextBox").valid &&
                $w("#detailedDescriptionRichTextBox").value.length >= 10))));
}

function showStatusAndResetPopup(statusText) {
    $w("#badgeNameInput").enable();
    $w("#categoryDropdown").enable();
    $w("#uploadFileBtn").enable();
    $w("#onTeachableCheckbox").enable();
    $w("#enrollmentUrlInput").enable();
    $w("#infoPageUrlInput").enable();
    $w("#teachableCourseIdInput").enable();
    $w("#expiresCheckbox").enable();
    $w("#expiryMonthsDropdown").enable();
    // $w("#shortDescriptionInput").enable();
    $w("#detailedDescriptionRichTextBox").enable();

    $w("#status").text = statusText;
    $w("#status").show()
        .then(() => {
            $w("#status").hide("fade", {"delay": 4000});
        });
}

