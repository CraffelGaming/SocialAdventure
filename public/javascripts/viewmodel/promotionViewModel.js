import { getTranslation, translate, infoPanel, get, isMaster, notify } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let language = await getTranslation('promotion');
    let userdata = await get(`/twitch/userdata`);

    translation();
    await initialize();
    load();
    infoPanel();
    
    //#region Initialize
    async function initialize() {
        $("#form").dxForm({
            formData: {
                recipient: userdata?.display_name,
                code: ""
            },
            items: [{
                    dataField: "recipient",
                    isRequired: true,
                    disabled: !await isMaster(),
                    label: {
                        text: translate(language, 'recipient')
                    },
                    editorType: 'dxDropDownBox',
                    editorOptions: await buildHeroDropdown(userdata?.display_name)   
                },
                {
                    dataField: "code",
                    isRequired: true,
                    label: {
                        text: translate(language, 'code')
                    },
                    editorOptions: {
                    }         
                }, 
                {
                itemType: "button",
                buttonOptions: {
                    text: translate(language, 'redeem'),
                    useSubmitBehavior: true,
                    onClick: async function(e){
                        let formData = $("#form").dxForm('instance').option("formData");

                        await fetch(`./api/promotion/default/redeem/${formData.code}/${formData.recipient}`, {
                            method: 'post',
                            headers: {
                                'Content-type': 'application/json'
                            }
                        }).then(async function (res) {
                            switch(res.status){
                                case 200:
                                    notify(translate(language, res.status), "success");
                                    break;
                                default:
                                    notify(translate(language, res.status), "error");
                                    break;
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

    //#region Connections
    async function buildHeroDropdown(selectedHero) {
        return {
            value: selectedHero,
            valueExpr: 'name',
            displayExpr: 'name',
            dataSource: new DevExpress.data.ArrayStore({
                data: await get('/hero/default', language),
                key: 'name'
            }),
            keyExpr: 'name',
            contentTemplate: function (e) {
                const $dataGrid = $('<div>').dxDataGrid({
                    dataSource: e.component.option('dataSource'),
                    columns: ['name'],
                    height: 265,
                    selection: { mode: 'single' },
                    selectedRowKeys: [selectedHero],
                    onSelectionChanged: function (selectedItems) {
                        const keys = selectedItems.selectedRowKeys,
                            hasSelection = keys.length;
                        e.component.option('value', hasSelection ? keys[0] : null);
                        e.component.close();
                    }
                });
                return $dataGrid;
            }
        }
    }
    //#endregion
});
