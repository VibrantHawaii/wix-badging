import wixData from 'wix-data';
import wixWindow from 'wix-window';
import {importOfflineClassCSV} from 'backend/badging-import-csv';

const popupTypes = {
    "offlineClass": {
        "title": "IMPORT OFFLINE CLASS",
        "importFunction": importOfflineClassCSV
    }
}

$w.onReady(function () {
    try {
        let context = wixWindow.lightbox.getContext();
        let popupType = popupTypes[context.popupType];

        $w("#importPopupTitle").text = popupType.title;
        $w("#importPopupStatus").show();
        $w("#importPopupStatus").text = "Fetching badge information...";
        wixData.query("Badging-BadgesBrief")
            .ascending("title")
            .find()
            .then( (results) => {
                $w("#importPopupStatus").hide();
                if (results.length > 0) {
                    $w("#badgeTypeDropdown").options = results.items.map((badge) => {
                        return {"label":badge.title, "value":badge._id}
                    });
                } else {
                    importError("NO BADGES FOUND");
                }
            });

        $w("#uploadFileBtn").onChange(() => {
            $w("#importPopupImportBtn").enable();
        })

        $w("#importPopupImportBtn").onClick(() => {
            if ($w("#uploadFileBtn").value.length > 0) {
                $w("#importPopupImportBtn").disable();
                $w("#badgeTypeDropdown").disable();
                $w("#uploadFileBtn").disable();
                $w("#importPopupStatus").text = "Uploading file";
                $w("#importPopupStatus").show();
                $w("#uploadFileBtn").uploadFiles()
                    .then( (uploadedFiles) => {
                        uploadedFiles.forEach(uploadedFile => {
                            $w("#importPopupStatus").text = "File uploaded, starting analysis";
                            let badgeRef = $w("#badgeTypeDropdown").value;

                            popupType.importFunction(uploadedFile.fileName, badgeRef)
                                .then((response) => {
                                    if (response.success === true) {
                                        console.log("CSV imported successfully");
                                        $w("#importPopupStatus").text = "CSV imported successfully.\nYou may close this popup";
                                    }
                                    else {
                                        importError(response.errorMsg);
                                    }
                                })
                                .catch( (importCSVError) => {
                                    importError(importCSVError.message);
                                });
                        })
                    })
                    .catch( (importError) => {
                        importError("File upload error " + importError.code + " : " + importError.message);
                    } );
            } else {
                importError("No upload files found")
            }
        });
    } catch (error) {
        importError(error)
    }
});

function importError(text) {
    console.error(text);
    $w("#importPopupStatus").show();
    $w("#importPopupStatus").text = text;
}
