import wixWindow from 'wix-window';
import {contactLearner} from 'backend/badging-contact-learner';

let learnerID = "";

$w.onReady( function () {
    let received = wixWindow.lightbox.getContext();
    learnerID = received.learnerID;
    $w('#contactPopupTitle').text = "Contact " + received.learnerName;

    $w("#contactPopupCaptcha").onError(() => {
        $w("#contactPopupStatus").text = "The reCAPTCHA element lost connection with the CAPTCHA provider. Please try again later.";
        $w("#contactPopupStatus").show()
            .then(() => {
                $w("#contactPopupStatus").hide("fade", {"delay": 10000});
            } );
    })

    $w("#closeBtn").onClick((event) => {
        wixWindow.lightbox.close();
    });

    $w("#contactPopupCaptcha").onTimeout(() => {
        $w("#contactPopupSendBtn").disable();
    })
} );

export function contactPopupSendBtn_click(event) {
    $w("#contactPopupSendBtn").disable();

    try {
        // Validate name input
        if (!$w("#contactPopupNameInput").valid)
            throw("Enter your name")

        // Email input is assumed validated due to the required flag and email type
        if (!$w("#contactPopupEmailInput").valid)
            throw("Valid email required")

        // Validate message (exists)
        if (!$w("#contactPopupMessageInput").valid)
            throw("Enter a message")
    }
    catch (err) {
        showStatusAndResetPopup(err);
        return;
    }

    let message = $w("#contactPopupMessageInput").value;
    let enquirer_email = $w("#contactPopupEmailInput").value;
    let enquirer_name = $w("#contactPopupNameInput").value;

    // Attempt send
    let received = wixWindow.lightbox.getContext();
    showStatusAndResetPopup("Sending message to " + received.learnerName);

    let token = $w("#contactPopupCaptcha").token;
    contactLearner(learnerID, enquirer_name, enquirer_email, message, token).then((result) => {
        showStatusAndResetPopup("Message sent to " + received.learnerName);

        // Dismiss popup after timeout
        setTimeout(() => {
            wixWindow.lightbox.close();
        }, 2000);
    })
        .catch( () => {
            showStatusAndResetPopup("Something went wrong. The message was not successfully sent. Please try again.");
        });
}


// Because of a bug in the Wix editor, this needs to be an export rather than bound in onReady
export function contactPopupCaptcha_verified() {
    $w("#contactPopupStatus").hide();
    $w("#contactPopupSendBtn").enable();
}

function showStatusAndResetPopup(statusText) {
    $w("#contactPopupCaptcha").reset();
    $w("#contactPopupSendBtn").disable();
    $w("#contactPopupStatus").text = statusText;
    $w("#contactPopupStatus").show();
}