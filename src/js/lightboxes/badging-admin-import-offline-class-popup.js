import wixData from 'wix-data';
import {importOfflineClassCSV} from 'backend/badging-import-offline-csv';

let updateImportStatus = false;

$w.onReady(function () {
    wixData.query("Badging-BadgesBrief")
        .ascending("title")
        .find()
        .then( (results) => {
            if (results.length > 0) {
                $w("#badgeTypeDropdown").options = results.items.map((badge) => {
                    return {"label":badge.title, "value":badge._id}
                });
            } else {
                console.error("NO BADGES FOUND");
            }
        });

    $w("#uploadFileBtn").onChange(() => {
        $w("#importPopupImportBtn").enable();
    })

    $w("#importPopupImportBtn").onClick(() => {
        if ($w("#uploadFileBtn").value.length > 0) {
            $w("#importPopupStatus").text = "Uploading file";
            $w("#importPopupStatus").show();
            $w("#uploadFileBtn").uploadFiles()
                .then( (uploadedFiles) => {
                    uploadedFiles.forEach(uploadedFile => {
                        $w("#importPopupStatus").text = "File uploaded, starting analysis";
                        let badgeRef = $w("#badgeTypeDropdown").value;

                        importOfflineClassCSV(uploadedFile.fileName, badgeRef).then(() => {
                            console.log("CSV imported successfully");
                            $w("#importPopupStatus").text = "CSV imported successfully";
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
});

function importError(text) {
    console.error(text);
    $w("#importPopupStatus").show();
    $w("#importPopupStatus").text = text;
    $w("#importPopupImportBtn").disable();
}
