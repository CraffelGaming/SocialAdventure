import { getTranslation, translate, infoPanel, put } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let module = 'statistic';
    let language = await getTranslation(module);

    translation();
    initialize();
    load();
    infoPanel();

    //#region Initialize
    function initialize() {

    }
    //#endregion

    //#region Load
    function load() {

    }
    //#endregion

    //#region Translation
    function translation() {
        document.getElementById("labelTitle").textContent = translate(language, 'title');
    }
    //#endregion
});
