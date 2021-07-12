import wixWindow from 'wix-window';

$w.onReady(function () {
    $w("#importOfflineClassBtn").onClick((event) => {
        wixWindow.openLightbox("Badging Admin Import Offline Class Popup", {});
    });
});