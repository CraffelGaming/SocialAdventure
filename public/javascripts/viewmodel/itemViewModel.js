import { getTranslation, translate, infoPanel, tableExport, getEditing, notify, get } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let language = await getTranslation('item');
    let languageItemCategory = await getTranslation('itemCategory');
    let languageItemCategoryList = await getTranslation('itemCategoryList');
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
                { dataField: "value", caption: translate(language, 'value'), validationRules: [{ type: "required" }]  },
                { dataField: "gold", caption: translate(language, 'gold'), validationRules: [{ type: "required" }], width: 200 },
                {
                  dataField: 'category.handle',
                  caption: translate(languageItemCategory , 'value'), width: 300,
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
                        return item && translate(languageItemCategoryList, item.value);
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
