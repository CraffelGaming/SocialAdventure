import { getTranslation, translate, infoPanel, get, notify, put } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let module = 'help';
    let language = await getTranslation(module);
    let userdata = await get(`/twitch/userdata`);
    let node = await get(`/node/default`);

    translation();
    initialize();
    load();
    infoPanel();
    
    //#region Initialize
    function initialize() {
        $("#form").dxForm({
            formData: {
                name: userdata?.display_name,
                node: node.name,
                mail: userdata?.email,
                content: ""
            },
            items: [{
                    dataField: "name",
                    isRequired: true,
                    label: {
                        text: translate(language, 'name')
                        },
                    editorOptions: {
                    }            
                }, {
                    dataField: "node",
                    isRequired: true,
                    disabled: true,
                    label: {
                        text: translate(language, 'node')
                        },
                    editorOptions: {
                    }            
                }, {     
                    dataField: "mail",
                    isRequired: true,
                    label: {
                        text: translate(language, 'mail')
                        },
                    editorOptions: {
                        mode:"email"
                    }   
                }, {
                    dataField: "content",
                    isRequired: true,
                    editorType: "dxTextArea",
                    label: {
                        text: translate(language, 'content')
                    },
                    editorOptions: {
                        height: 300,
                        maxLength: 800
                    }
                }, {
                    itemType: "button",
                    buttonOptions: {
                        text: translate(language, 'send'),
                        useSubmitBehavior: true,
                        onClick: async function(e){
                            let formData = $("#form").dxForm('instance').option("formData");

                            await fetch(`./api/help/default/`, {
                                method: 'put',
                                headers: {
                                    'Content-type': 'application/json'
                                }, 
                                body: JSON.stringify(formData)
                            }).then(async function (res) {
                                switch(res.status){
                                    case 201:
                                        notify(translate(language, res.status), "success");
                                        formData.content = "";
                                        $("#form").dxForm('instance').option("formData", formData);
                                        break;
                                    default:
                                        notify(translate(language, res.status), "error");
                                        break;
                                }
                            });
                        }
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
