import { getTranslations, translate, infoPanel, tableExport, getEditing, notify, isMaster, get, put, getList } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let module = 'itemCategory';
    let languageStorage = await getTranslations([module, 'item']);
    let language = languageStorage.filter(x => x.page == module);
    let languageItem = languageStorage.filter(x => x.page == 'item');

    translation();
    initialize();
    await loadStreamer();
    await loadShop();
    infoPanel();

    //#region Initialize
    function initialize() {

    }
    //#endregion

    //#region Load Streamer
    async function loadStreamer() {
        $("#dataGridStreamer").dxDataGrid({
            dataSource: new DevExpress.data.CustomStore({
                key: "handle",
                loadMode: "raw",
                load: async function (loadOptions) {
                    return await getList(`/itemCategory/default`, language);
                },
                insert: async function (values) {
                    await fetch('./api/itemCategory/default', {
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

                    if(item.category != null)
                        item.categoryHandle = item.category.handle;

                    await fetch('./api/itemCategory/default', {
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
                    await fetch('./api/itemCategory/default/' + key, {
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
            filterRow: { visible: false },
            filterPanel: { visible: false },
            searchPanel: { visible: false },
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
            masterDetail: {
                enabled: true,
                template(container, options) {
                    container.append($("<div>").dxDataGrid({
                        dataSource: options.data.items,
                        allowColumnReordering: true,
                        allowColumnResizing: true,
                        columns: [
                            { dataField: "handle", caption: translate(languageItem, 'handle'), allowEditing: false, width: 100  },
                            { dataField: "value", caption: translate(languageItem, 'value'), validationRules: [{ type: "required" }]  },
                            { dataField: "gold", caption: translate(languageItem, 'gold'), validationRules: [{ type: "required" }], width: 200}
                        ]
                    }));
                }
            },
            editing: await getEditing(),
            columns: [
                { dataField: "value", caption: translate(language, 'value') },
                {
                    caption: translate(language, 'count'), width: 250,
                    calculateCellValue(data) {
                        if(data.items != null) {
                            return data.items.length;
                        } else {
                            return 0;
                        }
                    }, allowEditing: false 
                }
            ],
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
                items: ["groupPanel", "addRowButton", "columnChooserButton", {
                    widget: 'dxButton', options: { icon: 'refresh', onClick() { $('#dataGridStreamer').dxDataGrid('instance').refresh(); }}
                }, { 
                    widget: 'dxButton', options: { icon: 'revert', onClick: async function () { $('#dataGridStreamer').dxDataGrid('instance').state(null); }}
                    }, "searchPanel", "exportButton"]
            }
        });
    }
    //#endregion
       
    //#region Load Shop
    async function loadShop() {
        $("#dataGridShop").dxDataGrid({
            dataSource: new DevExpress.data.CustomStore({
                key: "handle",
                loadMode: "raw",
                load: async function (loadOptions) {
                    return await getList(`/itemCategory`, language);
                }
            }),
            filterRow: { visible: false },
            filterPanel: { visible: false },
            searchPanel: { visible: false },
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
            masterDetail: {
                enabled: true,
                template(container, options) {
                    container.append($("<div>").dxDataGrid({
                        dataSource: options.data.items,
                        allowColumnReordering: true,
                        allowColumnResizing: true,
                        columns: [
                            { dataField: "handle", caption: translate(languageItem, 'handle'), allowEditing: false, width: 100  },
                            { dataField: "value", caption: translate(languageItem, 'value'), validationRules: [{ type: "required" }]  },
                            { dataField: "gold", caption: translate(languageItem, 'gold'), validationRules: [{ type: "required" }], width: 200 }
                        ]
                    }));
                }
            },
            columns: [
                { dataField: "value", caption: translate(language, 'value') },
                {
                    caption: translate(language, 'count'), width: 250,
                    calculateCellValue(data) {
                        if(data.items != null) {
                            return data.items.length;
                        } else {
                            return 0;
                        }
                    }
                },
                {
                    type: "buttons",
                    visible: await isMaster(),
                    buttons: [{
                        icon: "check",
                        hint: translate(language, "checkHint"),
                        onClick: function (e) {
                            fetch(`./api/itemCategory/default/transfer/${e.row.key}`, {
                                method: 'post',
                                headers: {
                                    'Content-type': 'application/json'
                                }
                            }).then(async function (res) {
                                switch(res.status){
                                    case 201:
                                        notify(translate(language, res.status), "success");
                                        $("#dataGridStreamer").dxDataGrid('instance').refresh();
                                        infoPanel();
                                        break;
                                    default:
                                        notify(translate(language, res.status), "error");
                                        break;
                                }
                            });
                        }
                    }]
                }
            ],
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
                items: ["groupPanel", "addRowButton", "columnChooserButton", {
                    widget: 'dxButton', options: { icon: 'refresh', onClick() { $('#dataGridShop').dxDataGrid('instance').refresh(); }}
                }, { 
                    widget: 'dxButton', options: { icon: 'revert', onClick: async function () { $('#dataGridShop').dxDataGrid('instance').state(null); }}
                    }, "searchPanel", "exportButton"]
            }
        });
    }
    //#endregion

    //#region Translation
    function translation() {
        document.getElementById("labelTitle").textContent = translate(language, 'title');
        document.getElementById("labelShop").textContent = translate(language, 'shop');
    }
    //#endregion
});
