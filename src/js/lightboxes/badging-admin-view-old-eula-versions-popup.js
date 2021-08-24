import wixData from 'wix-data';
import {shortDateString} from 'public/badging-utils';

$w.onReady(function () {
    let eulas = [];

    wixData.query("Badging-EULA")
        .descending("_createdDate")
        .find()
        .then( (results) => {
            eulas = results.items;
            if (eulas.length === 0) {
                $w("#prompt").text = "No current EULA found";
                return;
            }

            var dateOptions = results.items.map((eula) => {
                const label = shortDateString(eula._createdDate);
                return {"label":label, "value":eula._id}
            });
            $w("#selectDate").options = dateOptions;
        })
        .catch(error => {
            $w("#prompt").text = "No current EULA found";
        });

    $w("#selectDate").onChange(() => {
        const selectedId = $w("#selectDate").value;
        const selectedEula = eulas.find(eula => {
            return eula._id == selectedId;
        });
        $w("#eulaText").html = selectedEula.text;
    })
})
