import { getTranslation, translate, infoPanel, get } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let language = await getTranslation('help');
    let userdata = await get(`/twitch/userdata`);

    translation();
    initialize();
    load();
    infoPanel();
    
    //#region Initialize
    function initialize() {
        $("#form").dxForm({
            formData: {
                name: userdata?.display_name,
                mail: userdata?.email,
                content: ""
            },
            items: [{
                    dataField: "name",
                    editorOptions: {
                    }            
                }, {     
                    dataField: "mail",
                    editorOptions: {
                        mode:"email"
                    }   
                }, {
                dataField: "content",
                editorType: "dxTextArea",
                editorOptions: {
                    height: 300
                }
            }]
        });
    }
    //#endregion

    //#region Load
    function load() {
      
    }
    //#endregion

    //#region Translation
    function translation() {
        document.getElementById("labelTitle").textContent = translate(language, 'title');
        document.getElementById("information").textContent = translate(language, 'information');
    }
    //#endregion
});
