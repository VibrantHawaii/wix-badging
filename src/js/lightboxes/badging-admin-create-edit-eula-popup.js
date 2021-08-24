import wixData from 'wix-data';

let previousEulaText;

$w.onReady(function () {

    wixData.query("Badging-EULA")
        .ascending("_createdDate")
        .find()
        .then( (results) => {
            if (results.items.length != 0) {
                previousEulaText = results.items[0].text;
                $w("#EulaRichTextBox").value = previousEulaText;
                let basePrompt = $w("#prompt").text;
                const previousCreatedDate = results.items[0]._createdDate;
                $w("#prompt").text = basePrompt + " " + previousCreatedDate.getMonth() + "-" + previousCreatedDate.getDate() + "-" + previousCreatedDate.getFullYear();
            } else {
                $w("#prompt").text = "No previous EULA found";
            }
        })
        .catch(error => {
            showStatusAndResetPopup(error);
        });

    $w("#saveBtn").onClick(() => {
        $w("#saveBtn").disable();
        const newEulaText = $w("#EulaRichTextBox").value;
        if (convertToPlain(newEulaText) == convertToPlain(previousEulaText)) {
            showStatus("No changes made, ignoring save");
            return;
        }

        $w("#saveBtn").label = "Please wait...";

        const newEula = {
            text: newEulaText
        };

        wixData.insert("Badging-EULA", newEula)
            .then(response => {
                $w("#status").text = ("New User Agreement saved. You can close this popup");
                $w("#status").show();
            })
            .catch(errorMsg => {
                showStatus(errorMsg);
                return;
            })
    })
})

function showStatus(statusText) {
    $w("#status").text = statusText;
    $w("#status").show()
        .then(() => {
            $w("#status").hide("fade", {"delay": 4000});
        });
    $w("#saveBtn").enable();
}

function convertToPlain(rtf) {
    rtf = rtf.replace(/<\/p><p>/g, "\n");
    return rtf.replace(/<[^>]*>/g, "").trim();
}