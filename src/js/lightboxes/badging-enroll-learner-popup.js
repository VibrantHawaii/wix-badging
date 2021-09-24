import wixLocation from 'wix-location';
import wixWindow from 'wix-window';
import {verifyAndEnrollKnownLearnerWithCapcha, verifyAndEnrollKnownLearner} from 'backend/badging-enroll-learner';
import {createLearner} from "backend/badging-create-learner";
import {updateLearner} from "backend/badging-update-learner"
import {generateLearnerToken, getLatestEULA, getRegions, isLearnerProfileComplete} from "public/badging-utils";

let badgeId = "";
let enrollUrl = "";
let eulaID = "";
let captchaVerified = false;
let learnerNeedsProfileUpdate = false;
let learner = {};

$w.onReady(function () {
    let context = wixWindow.lightbox.getContext();
    badgeId = context.badgeId;
    enrollUrl = context.enrollUrl;

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

                if (verifyCallResponse.learnerFound) {
                    learner = verifyCallResponse.learner;
                    if (isLearnerProfileComplete(learner)) {
                        console.log("Opening URL: ", enrollUrl);
                        wixLocation.to(enrollUrl);
                        return;
                    } else {
                        // update learner info
                        learnerNeedsProfileUpdate = true;
                        $w("#captchaAndSubmitContainerBox").hide();
                        $w("#captchaAndSubmitContainerBox").collapse();
                        if (learner.supportedRegionsRef.length == 0) {
                            $w("#regionContainerBox").expand();
                            $w("#regionContainerBox").show();
                            if (learner.eulaRef != null)
                                $w("#enrollLearnerEnrollBtn").enable();
                        }
                        if (learner.eulaRef == null) {
                            $w("#eulaContainerBox").expand();
                            $w("#eulaContainerBox").show();
                        }
                        // $w("#eulaAcceptedCheckbox").expand();
                        // $w("#eulaAcceptedCheckbox").show();
                        $w("#enrollBtnContainerBox").expand();
                        $w("#enrollBtnContainerBox").show();
                        return;
                    }
                }

                // No match, prompt for region info for new Learner
                $w("#enrollLearnerCaptcha").hide();
                $w("#enrollLearnerSubmitBtn").hide();
                $w("#regionContainerBox").expand();
                $w("#regionContainerBox").show();
                $w("#eulaContainerBox").expand();
                $w("#eulaContainerBox").show();
                // $w("#eulaAcceptedCheckbox").expand();
                // $w("#eulaAcceptedCheckbox").show();
                $w("#enrollBtnContainerBox").expand();
                $w("#enrollBtnContainerBox").show();
            })
            .catch(error => {
                showStatusAndResetPopup(error);
            });
    });

    $w("#enrollLearnerNameInput").onKeyPress(() => testAllInputs())
    $w("#enrollLearnerEmailInput").onKeyPress(() => testAllInputs())
    $w("#enrollLearnerEnrollBtn").onClick(() => enrollBtnHandler());
    $w("#eulaAcceptedCheckbox").onChange(() => eulaAcceptedCheckboxHandler());
    $w("#enrollLearnerCaptcha").onVerified(() => enrollLearnerCaptcha_verified());

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
    // Note the title row needs to be visible as there is a bug in Wix wehre the top row is not clickable, even if it is the first data row.
    $w("#enrollLearnerRegionsTable").columns = [
        {
            "id": "supported",
            "dataPath": "supported",
            "label": "Supported",
            "type": "bool",
            "width": 120
        },
        {
            "id": "regionName",
            "dataPath": "regionName",
            "label": "Region",
            "type": "string",
            "width": 200
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

    const updateOrCreatePromise = new Promise((resolve) => {
        if (learnerNeedsProfileUpdate) {
            if (learner.eulaRef === null)
                eulaID = null;
            resolve(updateLearner(generateLearnerToken(name, email), regionIDs, eulaID));
        } else {
            resolve(createLearner(name, email, regionIDs, eulaID));
        }
    });

    updateOrCreatePromise
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
        ($w("#enrollLearnerEmailInput").value.match(/[\w.+-_~]+\@[\w.+-_~]+\.[\w.+-_~]+\.*[\w.+-_~]*/)) &&
        captchaVerified)
    {
        $w("#enrollLearnerStatus").hide();
        $w("#enrollLearnerSubmitBtn").enable();
    }
}

// Because of a bug in the Wix editor, this needs to be an export rather than bound in onReady
export function enrollLearnerCaptcha_verified() {
    captchaVerified = true;

    // Validate name input
    if (($w("#enrollLearnerNameInput").value.length > 3) &&
        ($w("#enrollLearnerEmailInput").value.match(/[\w.+-_~]+\@[\w.+-_~]+\.[\w.+-_~]+\.*[\w.+-_~]*/)))
    {
        $w("#enrollLearnerStatus").hide();
        $w("#enrollLearnerSubmitBtn").enable();
    }
}

function showStatusAndResetPopup(statusText) {
    $w("#enrollLearnerCaptcha").reset();
    captchaVerified = false;
    $w("#enrollLearnerSubmitBtn").disable();
    $w("#enrollLearnerNameInput").enable();
    $w("#enrollLearnerEmailInput").enable();
    $w("#supportedRegionsPrompt").hide();
    $w("#enrollLearnerEnrollBtn").hide();
    $w("#enrollLearnerCaptcha").hide();
    $w("#eulaAcceptedCheckbox").hide();
    $w("#eulaBox").hide();
    $w("#eulaTitle").hide();
    $w("#eulaText").hide();
    $w("#enrollLearnerEnrollBtn").disable();
    $w("#enrollLearnerEnrollBtn").label = "Enroll";

    $w("#enrollLearnerStatus").text = statusText.toString();
    $w("#enrollLearnerStatus").show()
        .then(() => {
            $w("#enrollLearnerStatus").hide("fade", {"delay": 10000});
        } );
}
