// All other buttons linked to LIghtboxes and pages using WYSYWIG Wix editor
import wixLocation from 'wix-location';
import wixWindow from 'wix-window';

$w.onReady(function () {
    $w("#importTeachableCourseBtn").onClick((event) => {
        wixWindow.openLightbox("Badging Admin Import CSV Popup Factory", {"popupType": "teachableCourse"});
    });

    $w("#importBadgrCourseBtn").onClick((event) => {
        wixWindow.openLightbox("Badging Admin Import CSV Popup Factory", {"popupType": "badgrAward"});
    });

    $w("#importOfflineClassBtn").onClick((event) => {
        wixWindow.openLightbox("Badging Admin Import CSV Popup Factory", {"popupType": "offlineClass"});
    });

    $w("#addBadgeBtn").onClick((event) => {
        wixWindow.openLightbox("Badging Admin Create Edit Badge Popup");
    });

    // $w("#createEditEULABtn").onClick((event) => {
    //     wixWindow.openLightbox("Badging Admin Create Edit EULA Popup");
    // });

    // $w("#viewLatestEULABtn").onClick((event) => {
    //     wixWindow.openLightbox("Badging Admin View Current EULA Popup");
    // });

    // $w("#viewOldEULAsBtn").onClick((event) => {
    //     wixWindow.openLightbox("Badging Admin View Old EULA Versions Popup");
    // });

});