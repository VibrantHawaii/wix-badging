import wixWindow from 'wix-window';

$w.onReady(function () {
    let params = wixWindow.lightbox.getContext();
    $w("#prompt").text = params.promptText;
    $w("#btn1").label = params.btn1Text;
    $w("#btn2").label = params.btn2Text;
    $w("#prompt").show();
    $w("#btn1").show();
    $w("#btn2").show();

    $w("#btn1").onClick(() => {
        wixWindow.lightbox.close({"clicked": params.btn1Value});
    })

    $w("#btn2").onClick(() => {
        wixWindow.lightbox.close({"clicked": params.btn2Value});
    })
})