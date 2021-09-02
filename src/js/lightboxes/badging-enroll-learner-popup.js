import wixLocation from 'wix-location';
import wixWindow from 'wix-window';
import {verifyAndEnrollKnownLearnerWithCapcha, verifyAndEnrollKnownLearner} from 'backend/badging-enroll-learner';
import {createLearner} from "backend/badging-create-learner";
import {getLatestEULA, getRegions} from "public/badging-utils";

let badgeId = "";
let badgeUrl = "";
let eulaID = "";

$w.onReady(function () {
    let context = wixWindow.lightbox.getContext();
    badgeId = context.badgeId;
    badgeUrl = context.badgeUrl;

    $w("#enrollLearnerSubmitBtn").onClick(() => {
        $w("#enrollLearnerSubmitBtn").disable();

        try {
            // Validate name input
            if (!$w("#enrollLearnerNameInput").valid)
                throw("Enter your name")

            // Email input is assumed validated due to the required flag and email type
            if (!$w("#enrollLearnerEmailInput").value.match(/[\w.+-_~]+\@[\w.+-_~]+\.[\w.+-_~]+\.*[\w.+-_~]*/))
                throw("Valid email required")
        }
        catch (err) {
            showStatusAndResetPopup(err);
            return;
        }

        $w("#enrollLearnerNameInput").disable();
        $w("#enrollLearnerEmailInput").disable();
        let token = $w("#enrollLearnerCaptcha").token;
        verifyAndEnrollKnownLearnerWithCapcha($w("#enrollLearnerNameInput").value, $w("#enrollLearnerEmailInput").value, badgeId, token)
            .then(verifyCallResponse => {
                if (verifyCallResponse.success === false)
                    throw (verifyCallResponse.errorMsg);

                if (verifyCallResponse.LearnerFound) {
                    console.log("Opening URL: ", badgeUrl);
                    wixLocation.to(badgeUrl);
                    return;
                }

                // No match, prompt for region info for new Learner
                $w("#enrollLearnerCaptcha").hide();
                $w("#enrollLearnerSubmitBtn").hide();
                $w("#supportedRegionsPrompt").show();
                $w("#enrollLearnerRegionsTable").show();
                $w("#eulaTitle").show();
                $w("#eulaBox").show();
                $w("#eulaText").show();
                $w("#eulaAcceptedCheckbox").show();
                $w("#enrollLearnerEnrollBtn").show();
            })
            .catch(error => {
                showStatusAndResetPopup(error);
            });
    });

    $w("#enrollLearnerNameInput").onKeyPress(() => testAllInputs())
    $w("#enrollLearnerEmailInput").onKeyPress(() => testAllInputs())
    $w("#enrollLearnerEnrollBtn").onClick(() => enrollBtnHandler());
    $w("#eulaAcceptedCheckbox").onChange(() => eulaAcceptedCheckboxHandler());

    $w("#enrollLearnerCaptcha").onError(() => {
        $w("#enrollLearnerStatus").text = "The reCAPTCHA element lost connection with the CAPTCHA provider. Please try again later.";
        $w("#enrollLearnerStatus").show()
            .then(() => {
                $w("#enrollLearnerStatus").hide("fade", {"delay": 10000});
            } );
    });

    getLatestEULA()
        .then(result => {
            if (result !== {}) {
                $w("#eulaText").html = result.text;
                eulaID = result._id;
            }
        });

    // Configure regions table
    $w("#enrollLearnerRegionsTable").columns = [
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

    getRegions()
        .then(regions => {
            if (regions.length > 0) {
                $w("#enrollLearnerRegionsTable").rows = regions.map(region => {
                    return {
                        "supported": true,
                        "regionName": region.title,
                        "regionId": region._id
                    };
                });
            }
        });

    $w("#enrollLearnerRegionsTable").onRowSelect(event => {
        let newRowData = event.rowData;
        newRowData.supported = !event.rowData.supported;
        $w("#enrollLearnerRegionsTable").updateRow(event.rowIndex, newRowData);
    })
});

function eulaAcceptedCheckboxHandler() {
    if ($w("#eulaAcceptedCheckbox").checked)
        $w("#enrollLearnerEnrollBtn").enable();
}

function enrollBtnHandler() {
    const name = $w("#enrollLearnerNameInput").value;
    const email = $w("#enrollLearnerEmailInput").value;
    const regionsTableRows = $w("#enrollLearnerRegionsTable").rows;
    const selectedRegions = regionsTableRows.filter(rowData => {
        return rowData.supported;
    })
    const regionIDs = selectedRegions.map(region => region.regionId);

    $w("#enrollLearnerEnrollBtn").disable();
    $w("#enrollLearnerEnrollBtn").label = "Please wait...";

    createLearner(name, email, regionIDs, eulaID)
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

            $w("#enrollLearnerEnrollBtn").label = "Enrollment Successful";
            console.log("Learner created and enrolled. Opening URL: ", badgeUrl);
            wixLocation.to(badgeUrl);
        })
        .catch(error => showStatusAndResetPopup(error));
}

function testAllInputs() {
    // Validate name input
    if (($w("#enrollLearnerNameInput").value.length > 3) &&
        ($w("#enrollLearnerEmailInput").value.match(/[\w.+-_~]+\@[\w.+-_~]+\.[\w.+-_~]+\.*[\w.+-_~]*/)))
    {
        $w("#enrollLearnerCaptcha").show();
        $w("#enrollLearnerSubmitBtn").show();
    }
}

// Because of a bug in the Wix editor, this needs to be an export rather than bound in onReady
export function enrollLearnerPopupCaptcha_verified() {
    $w("#enrollLearnerStatus").hide();
    $w("#enrollLearnerSubmitBtn").enable();
}

function showStatusAndResetPopup(statusText) {
    $w("#enrollLearnerEnrollBtn").enable();
    $w("#enrollLearnerEnrollBtn").label = "Enroll";
    $w("#enrollLearnerCaptcha").reset();
    $w("#enrollLearnerSubmitBtn").disable();
    $w("#enrollLearnerSubmitBtn").hide();
    $w("#enrollLearnerNameInput").enable();
    $w("#enrollLearnerEmailInput").enable();
    $w("#supportedRegionsPrompt").hide();
    $w("#enrollLearnerEnrollBtn").hide();
    $w("#enrollLearnerCaptcha").hide();
    $w("#eulaAcceptedCheckbox").hide();
    $w("#eulaBox").hide();
    $w("#eulaTitle").hide();
    $w("#eulaText").hide();

    $w("#enrollLearnerStatus").text = statusText;
    $w("#enrollLearnerStatus").show()
        .then(() => {
            $w("#enrollLearnerStatus").hide("fade", {"delay": 10000});
        } );
}