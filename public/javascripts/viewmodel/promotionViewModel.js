import { getTranslations, translate, infoPanel, get, isMaster, notify, getEditing } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let languageStorage = await getTranslations(['promotion', 'item', 'wallet', 'hero']);
    let language = languageStorage.filter(x => x.page == 'promotion');
    let languageItem = languageStorage.filter(x => x.page == 'item');
    let languageWallet = languageStorage.filter(x => x.page == 'wallet');
    let languageHero = languageStorage.filter(x => x.page == 'hero');

    let userdata = await get(`/twitch/userdata`);
    let item = await get('/item/default');
    let master = await isMaster();

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
                    disabled: !master,
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
                                    var data = await res.json();
                                    var item;

                                    if(data?.item > 0){
                                        item = await get(`/item/default/${data?.item}`, language);
                                    }

                                    reward(data, item);
                                    notify(translate(language, res.status + '_redeem'), "success");
                                    break;
                                default:
                                    notify(translate(language, res.status + '_redeem'), "error");
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
    async function load() {
        if(master){
            $("#dataGrid").dxDataGrid({
                dataSource: new DevExpress.data.CustomStore({
                    key: "handle",
                    loadMode: "raw",
                    load: async function (loadOptions) {
                        return await get('/promotion/default', language);
                    },
                    insert: async function (values) {
                        await fetch('./api/promotion/default', {
                            method: 'put',
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify(values)
                        }).then(async function (res) {
                            switch(res.status){
                                case 201:
                                    notify(translate(language, res.status), "success");
                                break;
                                default:
                                    notify(translate(language, res.status), "error");
                                break;
                            }
                        });
                    },
                    update: async function (key, values) {
                        var item = values;
                        item.handle = key;
    
                        await fetch('./api/promotion/default', {
                            method: 'put',
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify(item)
                        }).then(async function (res) {
                            switch(res.status){
                                case 201:
                                    notify(translate(language, res.status), "success");
                                    break;
                                default:
                                    notify(translate(language, res.status), "error");
                                break;
                            }
                        });
                    },
                    remove: async function (key) {
                        await fetch('./api/promotion/default/' + key, {
                            method: 'delete',
                            headers: {
                                'Content-type': 'application/json'
                            }
                        }).then(async function (res) {
                            switch(res.status){
                                case 204:
                                    notify(translate(language, res.status), "success");
                                    break;
                                default:
                                    notify(translate(language, res.status), "error");
                                break;
                            }
                        });
                    }
                }),
                filterRow: { visible: true },
                filterPanel: { visible: true },
                searchPanel: { visible: true },
                allowColumnReordering: true,
                allowColumnResizing: true,
                groupPanel: { visible: true },
                selection: { mode: "single" },
                paging: {
                    pageSize: 10
                },
                pager: {
                    visible: true,
                    allowedPageSizes: [10, 25, 50, 100, 'all'],
                    showPageSizeSelector: true,
                    showInfo: true,
                    showNavigationButtons: true,
                },
                columnChooser: {
                    enabled: true,
                    allowSearch: true,
                },
                showRowLines: true,
                showBorders: true,
                columns: [
                    { dataField: "handle", caption: translate(language, 'title'), validationRules: [{ type: "required" }]},
                    { dataField: "gold", caption: translate(languageWallet, 'gold'), validationRules: [{ type: "required" }], width: 150},
                    { dataField: "diamond", caption: translate(languageWallet, 'diamond'), validationRules: [{ type: "required" }], width: 150},
                    { dataField: "experience", caption: translate(languageHero, 'experience'), validationRules: [{ type: "required" }], width: 150},
                    { dataField: "validFrom", caption: translate(language, 'validFrom'), dataType: 'date', editorType: "dxDateBox", validationRules: [{ type: "required" }], width: 150},
                    { dataField: "validTo", caption: translate(language, 'validTo'), dataType: 'date', editorType: "dxDateBox", validationRules: [{ type: "required" }], width: 150},
                    { dataField: "isMaster", caption: translate(language, 'isMaster'), editorType: "dxCheckBox", width: 150},
                    {
                        dataField: 'item',
                        caption: translate(languageItem , 'item'), width: 150, 
                        editorOptions: {  
                            showClearButton: true  
                        },
                        lookup: {
                            dataSource(options) {
                                return {
                                store: {  
                                    type: 'array',  
                                    data: item,
                                    key: "handle"
                                    }
                                };
                            },
                            valueExpr: 'handle',
                            displayExpr: function(item) {
                                return item && item.value;
                            }
                        },
                    }
                ],
                editing: await getEditing(),
                onInitNewRow(e) {
                    e.data.isMaster = false;
                    e.data.gold = 0;
                    e.data.diamond = 0;
                    e.data.experience = 0;
                    e.data.validFrom = new Date();
                    e.data.validTo = new Date();
                },
                export: {
                    enabled: true,
                    formats: ['xlsx', 'pdf']
                },
                onExporting(e) {
                    tableExport(e, translate(language, 'title'))
                }
            });
        }
    }
    //#endregion

    //#region Reward
    function reward(data, item) {
        $('#popup').dxPopup({
            visible: false,
            hideOnOutsideClick: true,
            showTitle: true,
            showCloseButton:true,
            title: "Belohnung",
            width: 500,
            height: 180,
            resizeEnabled: true,
            contentTemplate: () => {
                let content =  $("<div/>");

                if(data?.gold > 0){
                    content.append($(`<div>${translate(languageWallet, "gold")}: ${data?.gold}</div>`));
                }

                if(data?.diamond > 0){
                    content.append($(`<div>${translate(languageWallet, "diamond")}: ${data?.diamond}</div>`));
                }

                if(data?.experience > 0){
                    content.append($(`<div>${translate(languageHero, "experience")}: ${data?.experience}</div>`));
                }

                if(item){
                    content.append($(`<div>${translate(languageItem, "title")}: ${item?.value}</div>`));
                }

                return content;
            },
        });
        $('#popup').dxPopup('instance').show();
    }
    //#endregion

    //#region Translation
    function translation() {
        document.getElementById("labelTitle").textContent = translate(language, 'title');
        document.getElementById("information").textContent = translate(language, 'information');
    }
    //#endregion

    //#region Hero
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
