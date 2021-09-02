import wixData from 'wix-data';
import wixWindow from 'wix-window';
import {importBadgrAwardListCSV, importOfflineClassCSV, importTeachableCourseCSV} from 'backend/badging-import-csv';
import {shortDateString} from 'public/badging-utils';

const popupTypes = {
    "teachableCourse": {
        "title": "IMPORT TEACHABLE COURSE",
        "importFunction": importTeachableCourseCSV
    },
    "offlineClass": {
        "title": "IMPORT OFFLINE CLASS",
        "importFunction": importOfflineClassCSV
    },
    "badgrAward": {
        "title": "IMPORT BADGR AWARD LIST",
        "importFunction": importBadgrAwardListCSV
    }
}

let eulaVersionChanged = false;

$w.onReady(function () {
    function importError(text) {
        console.error(text);
        $w("#importPopupStatus").show();
        $w("#importPopupStatus").text = text;
    }

    $w("#eulaAcceptedCheckbox").onChange(() => eulaCheckboxChanged());
    $w("#eulaVersionDate").onChange(() => eulaVersionDateChanged());

    let context = wixWindow.lightbox.getContext();
    if (context) {
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

        wixData.query("Badging-EULA")
            .descending("_createdDate")
            .find()
            .then( (results) => {
                let eulas = results.items;
                if (eulas.length === 0) {
                    importError("No current EULA found");
                    return;
                }

                var dateOptions = results.items.map((eula) => {
                    const label = shortDateString(eula._createdDate);
                    return {"label":label, "value":eula._id}
                });
                $w("#eulaVersionDate").options = dateOptions;
            })
            .catch(error => {
                importError(error);
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

                let eulaId = undefined;
                if ($w("#eulaAcceptedCheckbox").checked === true) {
                    if (eulaVersionChanged !== true) {
                        importError("Please select a User Agreement version (date)");
                        return;
                    }

                    eulaId = $w("#eulaVersionDate").value;
                }

                $w("#uploadFileBtn").uploadFiles()
                    .then( (uploadedFiles) => {
                        uploadedFiles.forEach(uploadedFile => {
                            $w("#importPopupStatus").text = "File uploaded, starting analysis";
                            let badgeRef = $w("#badgeTypeDropdown").value;

                            popupType.importFunction(uploadedFile.fileName, badgeRef, eulaId)
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
    }
});

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
};

