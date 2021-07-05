import wixWindow from 'wix-window';
import {contactLearner} from 'backend/badging-contact-learner';

let learnerID = "";

$w.onReady( function () {
    let received = wixWindow.lightbox.getContext();
    learnerID = received.learnerID;
    $w('#contactPopupTitle').text = "Contact " + received.learnerName;
} );

export function closeBtn_click(event) {
    wixWindow.lightbox.close();
}

export function contactPopupSendBtn_click(event) {
    // Validate name input
    let enquirer_name = $w("#contactPopupNameInput").value;

    // Validate email input
    let enquirer_email = $w("#contactPopupEmailInput").value;

    // Validate message (exists)
    let message = $w("#contactPopupMessageInput").value;

    // Attempt send
    contactLearner(learnerID, enquirer_name, enquirer_email, message).then((result) => {
        // Check response

        // Update status

        // Dismiss popup after timeout
        wixWindow.lightbox.close();
    })
}