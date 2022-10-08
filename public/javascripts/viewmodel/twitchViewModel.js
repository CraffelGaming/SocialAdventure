import { getTranslation, translate, infoPanel, get } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let module = 'twitch';
    let language = await getTranslation(module);
    let userData;
    
    translation();
    initialize();
    await load();
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
            text: translate(language, 'streamerButton'),
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
    }
    //#endregion

    //#region Load
    async function load() {
        userData = await get(`/twitch/userdata`, language);
        document.getElementById("welcome").textContent = translate(language, 'welcome').replace('$1', userData != null ? userData.display_name : "");
    }
    //#endregion

    //#region Translation
    function translation() {
        document.getElementById("labelTitle").textContent = translate(language, 'title');
        document.getElementById("streamerTitle").textContent = translate(language, 'streamer');
        document.getElementById("viewerTitle").textContent = translate(language, 'viewer');
        document.getElementById("streamerInformation").textContent = translate(language, 'streamerInformation').replace('$1', translate(language, 'streamerButton'));;
        document.getElementById("viewerInformation").textContent = translate(language, 'viewerInformation').replace('$1', translate(language, 'viewerButton'));;
    }
    //#endregion
});
