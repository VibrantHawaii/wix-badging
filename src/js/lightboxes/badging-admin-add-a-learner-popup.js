import wixData from 'wix-data';
import {createLearner} from "backend/badging-create-learner";
import {getRegions, shortDateString} from 'public/badging-utils';

let eulaVersionChanged = false;

$w.onReady(function () {

    // Configure regions table
    $w("#regionsTable").columns = [
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
        .then( (regions) => {
            if (regions.length > 0) {
                $w("#regionsTable").rows = regions.map(region => {
                    return {
                        "supported": true,
                        "regionName": region.title,
                        "regionId": region._id
                    };
                });
            } else {
                showStatusAndResetPopup ("NO REGIONS FOUND");
            }
        })
        .catch(error => {
            showStatusAndResetPopup(error);
        });

    $w("#regionsTable").onRowSelect(event => {
        let newRowData = event.rowData;
        newRowData.supported = !event.rowData.supported;
        $w("#regionsTable").updateRow(event.rowIndex, newRowData);
    })

    wixData.query("Badging-EULA")
        .descending("_createdDate")
        .find()
        .then( (results) => {
            let eulas = results.items;
            if (eulas.length === 0) {
                showStatusAndResetPopup("No current EULA found");
                return;
            }

            var dateOptions = results.items.map((eula) => {
                const label = shortDateString(eula._createdDate);
                return {"label":label, "value":eula._id}
            });
            $w("#eulaVersionDate").options = dateOptions;
        })
        .catch(error => {
            showStatusAndResetPopup(error);
        });

    $w("#submitBtn").onClick(() => {
        $w("#submitBtn").disable();

        try {
            // Validate name input
            if (!$w("#learnerNameInput").valid)
                throw("Enter your name")

            // Email input is assumed validated due to the required flag and email type
            if (!$w("#learnerEmailInput").value.match(/[\w.+-_~]+\@[\w.+-_~]+\.[\w.+-_~]+\.*[\w.+-_~]*/))
                throw("Valid email required")
        }
        catch (err) {
            showStatusAndResetPopup(err);
            return;
        }

        $w("#learnerNameInput").disable();
        $w("#learnerEmailInput").disable();

        const name = $w("#learnerNameInput").value;
        const email = $w("#learnerEmailInput").value;
        const regionsTableRows = $w("#regionsTable").rows;
        const selectedRegions = regionsTableRows.filter(rowData => {
            return rowData.supported;
        })
        const regionIDs = selectedRegions.map(region => region.regionId);

        let eulaId = undefined;
        if ($w("#eulaAcceptedCheckbox").checked === true) {
            if (eulaVersionChanged !== true) {
                showStatusAndResetPopup("Please select a User Agreement version (date)");
                return;
            }

            eulaId = $w("#eulaVersionDate").value;
        }

        $w("#submitBtn").disable();
        $w("#submitBtn").label = "Please wait...";

        createLearner(name, email, regionIDs, eulaId)
            .then(response => {
                if (response.success !== true) {
                    showStatusAndResetPopup(response.errorMsg);
                    return;
                }

                $w("#status").text = ("Learner created. You can close this popup");
                $w("#status").show();
            })
    })

    $w("#learnerNameInput").onKeyPress(() => testAllInputs())
    $w("#learnerEmailInput").onKeyPress(() => testAllInputs())
    $w("#eulaAcceptedCheckbox").onChange(() => eulaCheckboxChanged());
    $w("#eulaVersionDate").onChange(() => eulaVersionDateChanged());
})

function testAllInputs() {
    // Validate name input
    if (($w("#learnerNameInput").value.length > 3) &&
        ($w("#learnerEmailInput").value.match(/[\w.+-_~]+\@[\w.+-_~]+\.[\w.+-_~]+\.*[\w.+-_~]*/)))
    {
        $w("#submitBtn").enable();
    }
}

function eulaCheckboxChanged() {
    if ($w("#eulaAcceptedCheckbox").checked === true) {
        $w("#eulaVersionPrompt").show();
        $w("#eulaVersionDate").show();
    } else {
        $w("#eulaVersionPrompt").hide();
        $w("#eulaVersionDate").hide();
    }
}

function eulaVersionDateChanged() {
    eulaVersionChanged = true;
    testAllInputs();
};

function showStatusAndResetPopup(statusText) {
    $w("#submitBtn").disable();
    $w("#learnerNameInput").enable();
    $w("#learnerEmailInput").enable();
    eulaCheckboxChanged();

    $w("#status").text = statusText;
    $w("#status").show()
        .then(() => {
            $w("#status").hide("fade", {"delay": 4000});
        });
}
