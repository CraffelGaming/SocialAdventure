import { getTranslations, translate, infoPanel, tableExport, getEditing, notify, get, put } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let module = 'item';
    let languageStorage = await getTranslations([module, 'itemCategory']);
    let language = languageStorage.filter(x => x.page == module);
    let languageItemCategory = languageStorage.filter(x => x.page == 'itemCategory');

    let validation = await get(`/validation/${module}`);
    let category = await get('/itemCategory/default?childs=false');

    translation();
    initialize();
    await load();
    infoPanel();

    //#region Initialize
    function initialize() {

    }
    //#endregion

    //#region Load
    async function load() {
        $("#dataGrid").dxDataGrid({
            dataSource: new DevExpress.data.CustomStore({
                key: "handle",
                loadMode: "raw",
                load: async function (loadOptions) {
                    return await get('/item/default', language);
                },
                insert: async function (values) {
                    if(values.category != null)
                    values.categoryHandle = values.category.handle;
                    await fetch('./api/item/default', {
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

                    await fetch('./api/item/default', {
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
                    await fetch('./api/item/default/' + key, {
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
                { dataField: "handle", caption: translate(language, 'handle'), allowEditing: false, width: 100  },
                { dataField: "value", caption: translate(language, 'value'), validationRules: [{ type: "required" }]  },
                { dataField: "gold", caption: translate(language, 'gold'), validationRules: [{ type: "required" }], width: 200, editorOptions: { min: validation.find(x => x.handle == 'gold').min, max: validation.find(x => x.handle == 'gold').max }},
                {
                  dataField: 'category.handle',
                  caption: translate(languageItemCategory , 'value'), width: 300,
                  groupIndex: 0,
                  lookup: {
                    dataSource(options) {
                      return {
                        store: {  
                            type: 'array',  
                            data: category,  
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
                    widget: 'dxButton', options: { icon: 'refresh', onClick() { $('#dataGrid').dxDataGrid('instance').refresh(); }}
                }, { 
                    widget: 'dxButton', options: { icon: 'revert', onClick: async function () { $('#dataGrid').dxDataGrid('instance').state(null); }}
                    }, "searchPanel", "exportButton"]
            }
        });
    }
    //#endregion

    //#region Translation
    function translation() {
        document.getElementById("labelTitle").textContent = translate(language, 'title');
    }
    //#endregion
});
