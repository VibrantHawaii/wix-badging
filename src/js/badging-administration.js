// All other buttons linked to LIghtboxes and pages using WYSYWIG Wix editor

import wixWindow from 'wix-window';

$w.onReady(function () {
    $w("#importOfflineClassBtn").onClick((event) => {
        wixWindow.openLightbox("Badging Admin Import Offline Class Popup", {popupType: "offlineClass"});
    });
});