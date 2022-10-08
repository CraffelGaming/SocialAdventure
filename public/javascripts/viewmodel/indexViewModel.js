import { getTranslation, translate, infoPanel, get } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;
    
    let module = 'index';
    let language = await getTranslation(module);
    let twitch = await get(`/twitch`, language);

    translation();
    initialize();
    load();
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

        $("#left").dxButton({
            text: translate(language, 'leftButton'),
            onClick: function() {
                window.location = twitch.url;
            } 
        });

        $("#right").dxButton({
            text: translate(language, 'rightButton'),
            onClick: function() {
                window.location = "/streamer"
            } 
        });
    }
    //#endregion

    //#region Load
    function load() {
        const query = new URLSearchParams(window.location.search)
        let node = "";
        if(query.has('node')){
            node = query.get('node')
        }

        if(node != ""){
            document.getElementById("information").textContent = translate(language, 'node').replace('$1', node);
        } else document.getElementById("information").textContent = translate(language, 'information');
        document.getElementById("start").textContent = translate(language, 'start');
    }
    //#endregion

    //#region Translation
    function translation() {
        document.getElementById("labelTitle").textContent = translate(language, 'title');
        document.getElementById("leftTitle").textContent = translate(language, 'left');
        document.getElementById("rightTitle").textContent = translate(language, 'right');
        document.getElementById("leftInformation").textContent = translate(language, 'leftInformation').replace('$1', translate(language, 'leftButton'));;
        document.getElementById("rightInformation").textContent = translate(language, 'rightInformation').replace('$1', translate(language, 'rightButton'));;
    }
    //#endregion
});
