import {getLatestEULA, shortDateString} from 'public/badging-utils';

$w.onReady(function () {
    getLatestEULA()
        .then( (results) => {
            if (results != {}) {
                let basePrompt = $w("#prompt").text;
                const previousCreatedDate = results._createdDate;
                $w("#prompt").text = basePrompt + " " + shortDateString(previousCreatedDate);

                $w("#eulaText").html = results.text;
            } else {
                $w("#prompt").text = "No current EULA found";
            }
        })
        .catch(error => {
            $w("#prompt").text = error;
        });
})
