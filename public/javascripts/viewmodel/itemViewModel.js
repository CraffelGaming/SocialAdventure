import { getTranslations, translate, infoPanel, tableExport, getEditing, get, put, remove, getList } from './globalData.js';

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
                    return await getList('/item/default', language);
                },
                insert: async function (values) {
                    if (values.category != null)
                        values.categoryHandle = values.category.handle;
                    await put('/item/default', values, 'put', language);
                },
                update: async function (key, values) {
                    if (values.category != null)
                        values.categoryHandle = values.category.handle;
                    values.handle = key;
                    await put('/item/default', values, 'put', language);
                },
                remove: async function (key) {
                    await remove(`/item/default/${key}`, language);
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
                { dataField: "handle", caption: translate(language, 'handle'), allowEditing: false, width: 100, sortIndex: 0, sortOrder: "desc" },
                { dataField: "value", caption: translate(language, 'value'), validationRules: [{ type: "required" }] },
                { dataField: "gold", caption: translate(language, 'gold'), validationRules: [{ type: "required" }], width: 200, editorOptions: { min: validation.find(x => x.handle == 'gold').min, max: validation.find(x => x.handle == 'gold').max } },
                {
                    dataField: 'category.handle',
                    caption: translate(languageItemCategory, 'value'), width: 300,
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
                        displayExpr: function (item) {
                            return item && item.value;
                        }
                    },
                }
            ],
            editing: await getEditing(true, true, true, 'row'),
            export: {
                enabled: true,
                formats: ['xlsx', 'pdf']
            },
            onExporting(e) {
                tableExport(e, translate(language, 'title'))
            },
            onInitNewRow(e) {
                e.data.gold = 100;
                if (category?.length > 0)
                    e.data.category = category[0];
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
    //#endregion

    //#region Translation
    function translation() {
        document.getElementById("labelTitle").textContent = translate(language, 'title');
    }
    //#endregion
});
