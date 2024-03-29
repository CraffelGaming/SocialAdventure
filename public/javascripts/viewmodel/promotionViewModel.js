import { getTranslations, translate, infoPanel, get, isMaster, notify, getEditing, put, remove, getList, tableExport } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;
    let module = 'promotion';
    let userdata = await get(`/twitch/userdata`);

    if (!userdata) {
        window.location = (await get('/twitch?redirect=promotion')).url;
    }

    let languageStorage = await getTranslations([module, 'item', 'wallet', 'hero']);
    let language = languageStorage.filter(x => x.page == module);
    let languageItem = languageStorage.filter(x => x.page == 'item');
    let languageWallet = languageStorage.filter(x => x.page == 'wallet');
    let languageHero = languageStorage.filter(x => x.page == 'hero');
    let validation = await get(`/validation/${module}`);
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
                recipient: userdata?.login,
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
                editorOptions: await buildHeroDropdown(userdata?.login)
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
                    onClick: async function (e) {
                        let formData = $("#form").dxForm('instance').option("formData");

                        await fetch(`./api/promotion/default/redeem/${formData.code}/${formData.recipient}`, {
                            method: 'post',
                            headers: {
                                'Content-type': 'application/json'
                            }
                        }).then(async function (res) {
                            switch (res.status) {
                                case 200:
                                    var data = await res.json();
                                    var item;

                                    if (data?.item > 0) {
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
        if (master) {
            $("#dataGrid").dxDataGrid({
                dataSource: new DevExpress.data.CustomStore({
                    key: "handle",
                    loadMode: "raw",
                    load: async function (loadOptions) {
                        return await getList('/promotion/default', language);
                    },
                    insert: async function (values) {
                        await put('/promotion/default', values, 'put', language);
                    },
                    update: async function (key, values) {
                        values.handle = key;
                        await put('/promotion/default', values, 'put', language);
                    },
                    remove: async function (key) {
                        await remove(`/promotion/default/${key}`, language);
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
                    pageSize: 25
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
                    { dataField: "handle", caption: translate(language, 'title'), validationRules: [{ type: "required" }], sortIndex: 0, sortOrder: "asc" },
                    { dataField: "gold", caption: translate(languageWallet, 'gold'), validationRules: [{ type: "required" }], width: 150, editorOptions: { min: validation.find(x => x.handle == 'gold').min, max: validation.find(x => x.handle == 'gold').max } },
                    { dataField: "diamond", caption: translate(languageWallet, 'diamond'), validationRules: [{ type: "required" }], width: 150, editorOptions: { min: validation.find(x => x.handle == 'diamond').min, max: validation.find(x => x.handle == 'diamond').max } },
                    { dataField: "experience", caption: translate(languageHero, 'experience'), validationRules: [{ type: "required" }], width: 150, editorOptions: { min: validation.find(x => x.handle == 'experience').min, max: validation.find(x => x.handle == 'experience').max } },
                    { dataField: "validFrom", caption: translate(language, 'validFrom'), dataType: 'date', editorType: "dxDateBox", validationRules: [{ type: "required" }], width: 150 },
                    { dataField: "validTo", caption: translate(language, 'validTo'), dataType: 'date', editorType: "dxDateBox", validationRules: [{ type: "required" }], width: 150 },
                    { dataField: "isMaster", caption: translate(language, 'isMaster'), editorType: "dxCheckBox", width: 150 },
                    {
                        dataField: 'item',
                        caption: translate(languageItem, 'item'), width: 150,
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
                            displayExpr: function (item) {
                                return item && item.value;
                            }
                        },
                    }
                ],
                editing: await getEditing(true, true, true, 'row'),
                onInitNewRow(e) {
                    e.data.isMaster = false;
                    e.data.gold = 1000;
                    e.data.diamond = 100;
                    e.data.experience = 5000;
                    e.data.validFrom = new Date();
                    e.data.validTo = new Date().setMonth(new Date().getMonth() + 1);
                },
                export: {
                    enabled: true,
                    formats: ['xlsx', 'pdf']
                },
                onExporting(e) {
                    tableExport(e, translate(language, 'title'))
                },
                stateStoring: {
                    enabled: true,
                    type: "custom",
                    customLoad: async function () {
                        var state = (await get(`/stateStorage/${module}`))?.storage;
                        if (state)
                            return JSON.parse(state);
                        return null;
                    },
                    customSave: async function (state) {
                        await put('/stateStorage', { 'handle': module, 'name': 'Standard', 'storage': JSON.stringify(state) }, "put");
                    }
                },
                toolbar: {
                    items: [
                        "groupPanel", "addRowButton", "columnChooserButton", {
                            widget: 'dxButton', options: { icon: 'refresh', onClick() { $('#dataGrid').dxDataGrid('instance').refresh(); } }
                        }, {
                            widget: 'dxButton', options: { icon: 'revert', onClick: async function () { $('#dataGrid').dxDataGrid('instance').state(null); } }
                        }, "searchPanel", "exportButton"
                    ]
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
            showCloseButton: true,
            title: "Belohnung",
            width: 500,
            height: 180,
            resizeEnabled: true,
            contentTemplate: () => {
                let content = $("<div/>");

                if (data?.gold > 0) {
                    content.append($(`<div>${translate(languageWallet, "gold")}: ${data?.gold}</div>`));
                }

                if (data?.diamond > 0) {
                    content.append($(`<div>${translate(languageWallet, "diamond")}: ${data?.diamond}</div>`));
                }

                if (data?.experience > 0) {
                    content.append($(`<div>${translate(languageHero, "experience")}: ${data?.experience}</div>`));
                }

                if (item) {
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
