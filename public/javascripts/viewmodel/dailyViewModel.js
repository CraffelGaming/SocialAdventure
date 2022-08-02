import { getTranslation, translate } from './globalData.js';

$(async () => {
    let language = await getTranslation('daily');
    window.jsPDF = window.jspdf.jsPDF;
    
    translation();
    load();

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
