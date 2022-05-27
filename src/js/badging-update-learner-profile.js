import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixWindow from 'wix-window';
import {updateLearner} from "backend/badging-update-learner";
import {getAllBadgesBrief, getAwardedBadges, getLatestEULA, getRegions, isLearnerProfileComplete} from "public/badging-utils";
import {verifyCapcha} from "backend/badging-backend-utils";

let learnerToken = ""
let needsRegions = false;
let needsEULA = false;
let latestEulaID = "";
let captchaVerified = false;
let learner = {};
let allBadgesBrief = [];

let stillLoadingPageData = true;
let stillLoadingPageDataAnimationStage = 3; // 1, 2, or 3. Start at 3 to immediately cause wrap around to 1 on instantiation.
const BASE_LOADING_ANIMATION_TEXT = "Looking up your account.";

$w.onReady(function () {
    loadingPageDataAnimation();

    let params = (new URL(wixLocation.url)).searchParams;
    if (!params.has("token")) {
        console.error("NO (REQUIRED) token PARAM SPECIFIED");
        showGenericErrorAndReturnToHomepage("");
        return;
    }
    else {
        // Search for user that matches token
        learnerToken = decodeURIComponent(params.get("token"));
        wixData.query("Badging-Learners")
            .contains("learnerToken", learnerToken)
            .include("supportedRegionsRef")
            .find()
            .then( (learnerResults) => {
                if (learnerResults.length == 0) {
                    console.error("LEARNER TOKEN WITH ID \"" + learnerToken + "\" WAS NOT FOUND")
                    showGenericErrorAndReturnToHomepage("");
                    return;
                }
                if (learnerResults.length > 1) {
                    console.error(learnerResults.length + " LEARNER TOKENS FOUND WITH THE ID \"" + learnerToken + "\"");
                    showGenericErrorAndReturnToHomepage("");
                    return;
                }

                learner = learnerResults.items[0];
                $w("#title").text = $w("#title").text + " " + learner.title.toUpperCase();

                $w("#eulaAcceptedCheckbox").onChange(() => eulaAcceptedCheckboxHandler());
                $w("#captcha").onVerified(() => captcha_verified());
                $w("#submitBtn").onClick(() => submitBtnHandler());

                $w("#captcha").onError(() => {
                    console.error("RECAPTCHA connection error");
                    $w("#status").text = "The reCAPTCHA element lost connection with the CAPTCHA provider. Please try again later.";
                    $w("#status").show()
                        .then(() => {
                            showGenericErrorAndReturnToHomepage();
                        });
                });

                getLatestEULA()
                    .then(result => {
                        if (result !== {}) {
                            $w("#eulaText").html = result.text;
                            latestEulaID = result._id;
                        }
                    })
                    .then(() => {
                        // Configure regions table
                        $w("#regionsTable").columns = [
                            {
                                "id": "supported",
                                "dataPath": "supported",
                                "label": "supported",
                                "type": "bool",
                                "width": 80
                            },
                            {
                                "id": "regionName",
                                "dataPath": "regionName",
                                "label": "regionName",
                                "type": "string",
                                "width": 210
                            },
                            {
                                "id": "regionId",
                                "dataPath": "regionId",
                                "label": "regionId",
                                "type": "string",
                                "width": 0,
                                "visible": false
                            },
                        ];

                        return getRegions();
                    })
                    .then((regions) => {
                        if (regions.length > 0) {
                            $w("#regionsTable").rows = regions.map(region => {
                                return {
                                    "supported": learner.supportedRegionsRef.find(regionRef => regionRef._id === region._id) != undefined,
                                    "regionName": region.title,
                                    "regionId": region._id
                                };
                            });

                            $w("#regionsTable").onRowSelect(event => {
                                let newRowData = event.rowData;
                                newRowData.supported = !event.rowData.supported;
                                $w("#regionsTable").updateRow(event.rowIndex, newRowData);
                            })

                            // stillLoadingPageData = false;
                            // $w("#loadingAnimationText").hide();
                            // $w("#promptContainerBox").show();
                            // $w("#captchaAndSubmitContainerBox").show();

                            if ((!learner.supportedRegionsRef) || (learner.supportedRegionsRef.length === 0)) {
                                needsRegions = true;
                            }
                        }

                        return getAllBadgesBrief();
                    })
                    .then((allBadgesResults) => {
                        allBadgesBrief = allBadgesResults;
                        return getAwardedBadges(learner._id);
                    })
                    .then((awardedBadges) => {
                        $w("#regionContainerBox").expand()
                            .then(() => $w("#regionContainerBox").show());

                        if (awardedBadges.length > 0) {
                            $w("#awardedBadgesTable").rows = awardedBadges.map(award => {
                                return {
                                    "publicize": award.publicize,
                                    "badgeName": allBadgesBrief.find(badge => badge._id === award.badgeRef).title,
                                    "awardId": award._id
                                };
                            });

                            $w("#awardedBadgesTable").onRowSelect(event => {
                                let newRowData = event.rowData;
                                newRowData.publicize = !event.rowData.publicize;
                                $w("#awardedBadgesTable").updateRow(event.rowIndex, newRowData);
                            })

                            $w("#courseOptInBox").expand()
                                .then(() => $w("#courseOptInBox").show());
                        }

                        stillLoadingPageData = false;
                        $w("#loadingAnimationText").hide();
                        $w("#promptContainerBox").show();
                        $w("#captchaAndSubmitContainerBox").show();

                        if ((!learner.eulaRef) && (!learner.teachableInferredEulaDate)) {
                            $w("#eulaContainerBox").expand()
                                .then(() => $w("#eulaContainerBox").show());
                            needsEULA = true;
                        }
                    })
            });
    }
});

function showGenericErrorAndReturnToHomepage(customPrompt) {
    stillLoadingPageData = false;
    $w("#loadingAnimationText").hide();
    $w("#promptContainerBox").show();
    if (customPrompt !== "")
        $w("#prompt").text = customPrompt;
    else
        $w("#prompt").text = "Sorry, an error has occurred. Taking you back to the VibrantHawaii homepage in 5 seconds...";
    $w("#captcha").collapse();
    $w("#submitBtn").collapse();
    $w("#status").collapse();
    setTimeout(()=> {
        wixLocation.to("/");
    }, 5000);
}

function submitBtnHandler() {
    $w("#submitBtn").disable();

    console.log($w("#captcha").token);

    verifyCapcha($w("#captcha").token)
        .then(verifyCaptchaResponse => {
            console.log(verifyCaptchaResponse);

            if (verifyCaptchaResponse.success === false)
                throw (verifyCaptchaResponse.errorMsg);

            const regionsTableRows = $w("#regionsTable").rows;
            const selectedRegions = regionsTableRows.filter(rowData => {
                return rowData.supported;
            })
            const regionIDs = selectedRegions.map(region => region.regionId);

            const publicizedBadgesTableRows = $w("#awardedBadgesTable").rows;
            const awardedBadges = publicizedBadgesTableRows.map(rowData => {
                return {id: rowData.awardId, publicize: rowData.publicize};
            })

            let eulaID = learner.eulaRef;
            if (needsEULA)
                eulaID = latestEulaID;

            return updateLearner(learnerToken, regionIDs, awardedBadges, eulaID);
        })
        .then(response => {
            if (response.success !== true) {
                throw(response.errorMsg);
            }

            $w("#submitBtn").label = "Update Successful";
            console.log("Learner " + name + " updated");

            wixWindow.openLightbox("Badging Update Learner Success Popup");
        })
        .catch(error => {
            console.error(error);
            // showGenericErrorAndReturnToHomepage();
        });
}

function eulaAcceptedCheckboxHandler() {
    if ($w("#eulaAcceptedCheckbox").checked) {
        if (captchaVerified === true)
            $w("#submitBtn").enable();
    } else {
        $w("#submitBtn").disable();
    }
}

// Because of a bug in the Wix editor, this needs to be an export rather than bound in onReady
export function captcha_verified() {
    captchaVerified = true;
    $w("#status").hide();
    if (needsEULA) {
        if ($w("#eulaAcceptedCheckbox").checked)
            $w("#submitBtn").enable();
    } else {
        $w("#submitBtn").enable();
    }
}

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