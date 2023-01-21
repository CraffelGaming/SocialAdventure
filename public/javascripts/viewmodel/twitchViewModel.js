import { getTranslation, translate, infoPanel, get, put } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let module = 'twitch';
    let language = await getTranslation(module);
    let userData;
    let userDataChannel;

    await load();

    translation();
    initialize();
    
    infoPanel();
    
    //#region Initialize
    function initialize() {
        $('#responsive-box').dxResponsiveBox({
            rows: [
                { ratio: 1 },
                { ratio: 0 },
                { ratio: 1 },
            ],
            cols: [
                { ratio: 1 },
                { ratio: 0, screen: 'lg' },
                { ratio: 1 },
            ],
            singleColumnScreen: 'sm',
            screenByWidth(width) {
                return (width < 1080) ? 'sm' : 'lg';
            },
        });

        $("#streamer").dxButton({
            text: translate(language, userDataChannel ? 'streamerButtonRefresh' : 'streamerButton'),
            onClick: async function() {
                $("#streamer").dxButton('instance').option('disabled', true);
                await fetch('./api/twitch/', {
                    method: 'post',
                    headers: {
                        'Content-type': 'application/json'
                    }
                }).then(async function (res) {
                    if (res.status == 200) {
                        $("#streamer").dxButton('instance').option('disabled', false);
                        window.location = "/streamer"
                    }
                });
            } 
        });

        $("#viewer").dxButton({
            text: translate(language, 'viewerButton'),
            onClick: function() {
                window.location = "/streamer"
            } 
        });

        if(userDataChannel) {
            $("#deactivate").dxButton({
                text: translate(language, 'streamerButtonDeactivate'),
                icon: "trash",
                type: "danger",
                onClick: function() {
                    setDeactivatePopup();
                } 
            });
        }
    }

    function setDeactivatePopup() {
        if(userDataChannel) {
            let popup = $('#deactivatePopup').dxPopup({
                visible: true,
                hideOnOutsideClick: true,
                showTitle: true,
                title: translate(language, 'streamerButtonDeactivate'),
                width: 600,
                height: 400,
                resizeEnabled: false,
                dragEnabled: true,
                position: 'center',
                showCloseButton: true
            }).dxPopup('instance');
    
            $('#deactivateInformation').dxTextArea({
                value: translate(language, "streamerDeactivate"),
                height: 250,
                stylingMode:"outlined",
                readOnly: true
            });

            $("#deactivateYes").dxButton({
                text: translate(language, 'yes'),
                icon: "check",
                type: "danger",
                onClick: async function() {
                    await fetch('./api/twitch/deactivate', {
                        method: 'post',
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }).then(async function (res) {
                        if (res.status == 200) {
                            $("#streamer").dxButton('instance').option('disabled', false);
                            window.location = "/"
                        }
                    });
                    
                } 
            });
    
            $("#deactivateNo").dxButton({
                text: translate(language, 'no'),
                icon: "close",
                type: "success",
                onClick: function() {
                    popup.hide();
                } 
            });
        }
    }
    //#endregion

    //#region Load
    async function load() {
        userData = await get(`/twitch/userdata`, language);
        userDataChannel = await get(`/node/information/${userData.login}`, language);
    }
    //#endregion

    //#region Translation
    function translation() {
        document.getElementById("labelTitle").textContent = translate(language, 'title');
        document.getElementById("streamerTitle").textContent = translate(language, 'streamer');
        document.getElementById("viewerTitle").textContent = translate(language, 'viewer');

        if(userDataChannel) {
            document.getElementById("streamerInformation").textContent = translate(language, 'streamerInformationRefresh').replace('$1', translate(language, 'streamerButtonRefresh'));
        } else {
            document.getElementById("streamerInformation").textContent = translate(language, 'streamerInformation').replace('$1', translate(language, 'streamerButton'));
        }

        document.getElementById("viewerInformation").textContent = translate(language, 'viewerInformation').replace('$1', translate(language, 'viewerButton'));
        document.getElementById("welcome").textContent = translate(language, 'welcome').replace('$1', userData != null ? userData.display_name : "");
    }
    //#endregion
});
