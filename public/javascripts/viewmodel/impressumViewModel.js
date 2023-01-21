import { getTranslations, translate, infoPanel, notify} from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let module = 'impressum';
    let languageStorage = await getTranslations([module]);
    let language = languageStorage.filter(x => x.page == module);

    translation();
    initialize();
    infoPanel();
    
    //#region Initialize
    function initialize() {

    }
    //#endregion


    //#region Translation
    function translation() {
        document.getElementById("labelTitle").textContent = translate(language, 'Information');
    }
    //#endregion
});
