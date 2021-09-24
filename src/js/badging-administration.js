// All other buttons linked to LIghtboxes and pages using WYSYWIG Wix editor

import wixWindow from 'wix-window';

$w.onReady(function () {
    $w("#importTeachableCourseBtn").onClick((event) => {
        wixWindow.openLightbox("Badging Admin Import CSV Popup Factory", {"popupType": "teachableCourse"});
    });

    $w("#importOfflineClassBtn").onClick((event) => {
        wixWindow.openLightbox("Badging Admin Import CSV Popup Factory", {"popupType": "offlineClass"});
    });

    $w("#addBadgeBtn").onClick((event) => {
        wixWindow.openLightbox("Badging Admin Add A Badge Popup");
    });
});