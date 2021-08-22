import wixLocation from 'wix-location';
import wixWindow from 'wix-window';
import {verifyAndEnrollKnownLearnerWithCapcha, verifyAndEnrollKnownLearner} from 'backend/badging-enroll-learner';
import {createLearner} from "backend/badging-create-learner";

let badgeId = "";
let badgeUrl = "";

$w.onReady(function () {
    let context = wixWindow.lightbox.getContext();
    badgeId = context.badgeId;
    badgeUrl = context.badgeUrl;

    $w("#enrollUserSubmitBtn").onClick(() => {
        $w("#enrollUserSubmitBtn").disable();

        try {
            // Validate name input
            if (!$w("#enrollUserNameInput").valid)
                throw("Enter your name")

            // Email input is assumed validated due to the required flag and email type
            if (!$w("#enrollUserEmailInput").value.match(/[\w.+-_~]+\@[\w.+-_~]+\.[\w.+-_~]+\.*[\w.+-_~]*/))
                throw("Valid email required")
        }
        catch (err) {
            showStatusAndResetPopup(err);
            return;
        }

        $w("#enrollUserNameInput").disable();
        $w("#enrollUserEmailInput").disable();
        let token = $w("#enrollUserCaptcha").token;
        verifyAndEnrollKnownLearnerWithCapcha($w("#enrollUserNameInput").value, $w("#enrollUserEmailInput").value, badgeId, token)
            .then(verifyCallResponse => {
                if (verifyCallResponse.success === false)
                    throw (verifyCallResponse.errorMsg);

                if (verifyCallResponse.userFound) {
                    console.log("Opening URL: ", badgeUrl);
                    wixLocation.to(badgeUrl);
                    return;
                }

                // No match, prompt for region info for new user
                $w("#enrollUserCaptcha").hide();
                $w("#enrollUserSubmitBtn").hide();
                $w("#supportedRegionsPrompt").show();
                $w("#enrollUserEnrollBtn").show();

                // Configure regions table
                $w("#enrollUserRegionsTable").columns = [
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

                $w("#enrollUserRegionsTable").rows = verifyCallResponse.regions.map(region => {
                    return {
                        "supported": true,
                        "regionName": region.title,
                        "regionId": region._id
                    };
                });

                $w("#enrollUserRegionsTable").onRowSelect(event => {
                    let newRowData = event.rowData;
                    newRowData.supported = !event.rowData.supported;
                    $w("#enrollUserRegionsTable").updateRow(event.rowIndex, newRowData);
                })

                $w("#enrollUserRegionsTable").show();
                $w("#enrollUserEnrollBtn").enable();
            })
            .catch(error => {
                showStatusAndResetPopup(error);
            });
    });

    $w("#enrollUserNameInput").onKeyPress(() => testAllInputs())
    $w("#enrollUserEmailInput").onKeyPress(() => testAllInputs())
    $w("#enrollUserEnrollBtn").onClick(() => enrollBtnHandler());

    $w("#enrollUserCaptcha").onError(() => {
        $w("#enrollUserStatus").text = "The reCAPTCHA element lost connection with the CAPTCHA provider. Please try again later.";
        $w("#enrollUserStatus").show()
            .then(() => {
                $w("#enrollUserStatus").hide("fade", {"delay": 10000});
            } );
    })
});

function enrollBtnHandler() {
    const name = $w("#enrollUserNameInput").value;
    const email = $w("#enrollUserEmailInput").value;
    const regionsTableRows = $w("#enrollUserRegionsTable").rows;
    const selectedRegions = regionsTableRows.filter(rowData => {
        return rowData.supported;
    })
    const regionIDs = selectedRegions.map(region => region.regionId);

    $w("#enrollUserEnrollBtn").disable();
    $w("#enrollUserEnrollBtn").label = "Please wait...";

    createLearner(name, email, regionIDs)
        .then(response => {
            if (response.success !== true) {
                throw(response.errorMsg);
            }

            return verifyAndEnrollKnownLearner(name, email, badgeId);
        })
        .then(response => {
            if (response.success !== true) {
                throw(response.errorMsg);
            }

            console.log("Learner created and enrolled. Opening URL: ", badgeUrl);
            wixLocation.to(badgeUrl);
        })
        .catch(error => showStatusAndResetPopup(error));
}

function testAllInputs() {
    // Validate name input
    if (($w("#enrollUserNameInput").value.length > 3) &&
        ($w("#enrollUserEmailInput").value.match(/[\w.+-_~]+\@[\w.+-_~]+\.[\w.+-_~]+\.*[\w.+-_~]*/)))
    {
        $w("#enrollUserCaptcha").show();
        $w("#enrollUserSubmitBtn").show();
    }
}

// Because of a bug in the Wix editor, this needs to be an export rather than bound in onReady
export function enrollUserPopupCaptcha_verified() {
    $w("#enrollUserStatus").hide();
    $w("#enrollUserSubmitBtn").enable();
}

function showStatusAndResetPopup(statusText) {
    $w("#enrollUserEnrollBtn").enable();
    $w("#enrollUserEnrollBtn").label = "Enroll";
    $w("#enrollUserCaptcha").reset();
    $w("#enrollUserSubmitBtn").disable();
    $w("#enrollUserNameInput").enable();
    $w("#enrollUserEmailInput").enable();
    $w("#supportedRegionsPrompt").hide();
    $w("#enrollUserEnrollBtn").hide();
    $w("#enrollUserCaptcha").hide();
    $w("#enrollUserSubmitBtn").hide();

    $w("#enrollUserStatus").text = statusText;
    $w("#enrollUserStatus").show()
        .then(() => {
            $w("#enrollUserStatus").hide("fade", {"delay": 10000});
        } );
}