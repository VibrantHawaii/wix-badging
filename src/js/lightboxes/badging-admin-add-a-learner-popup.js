import wixData from 'wix-data';
import {createLearner} from "backend/badging-create-learner";

$w.onReady(function () {
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

    wixData.query("Badging-Regions")
    .ascending("title")
    .find()
    .then( (results) => {
        if (results.length > 0) {
            $w("#regionsTable").rows = results.items.map(region => {
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

        $w("#submitBtn").disable();
        $w("#submitBtn").label = "Please wait...";

        createLearner(name, email, regionIDs)
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
})

function testAllInputs() {
    // Validate name input
    if (($w("#learnerNameInput").value.length > 3) &&
        ($w("#learnerEmailInput").value.match(/[\w.+-_~]+\@[\w.+-_~]+\.[\w.+-_~]+\.*[\w.+-_~]*/)))
    {
        $w("#submitBtn").enable();
    }
}

function showStatusAndResetPopup(statusText) {
    $w("#submitBtn").disable();
    $w("#learnerNameInput").enable();
    $w("#learnerEmailInput").enable();

    $w("#status").text = statusText;
    $w("#status").show()
    .then(() => {
        $w("#status").hide("fade", {"delay": 10000});
    });
}
