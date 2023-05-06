import { getTranslations, translate, infoPanel, tableExport, getEditing, remove, get, put, getList } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let module = 'raidBoss';
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
                    return await getList('/raidBoss/default', language);
                },
                insert: async function (values) {
                    if (values.category != null)
                        values.categoryHandle = values.category.handle;
                    await put('/raidBoss/default', values, 'put', language);
                },
                update: async function (key, values) {
                    values.handle = key;

                    if (values.category != null)
                        values.categoryHandle = values.category.handle;
                    await put('/raidBoss/default', values, 'put', language);
                },
                remove: async function (key) {
                    await remove(`/raidBoss/default/${key}`, language);
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
                { dataField: "name", caption: translate(language, 'name'), validationRules: [{ type: "required" }], width: 150, sortIndex: 0, sortOrder: "asc" },
                {
                    dataField: "description", caption: translate(language, 'description'), validationRules: [{ type: "required" }],
                    cellTemplate: function (element, info) {
                        $("<div>")
                            .appendTo(element)
                            .text(info.value)
                            .css("width", info.column.width - 20)
                            .css("height", 40)
                            .css("white-space", "normal")
                            .css("overflow-wrap", 'break-word');
                    }
                },
                { dataField: "hitpoints", width: 120, caption: translate(language, 'hitpoints'), validationRules: [{ type: "required" }], width: 150, editorOptions: { min: validation.find(x => x.handle == 'hitpoints').min, max: validation.find(x => x.handle == 'hitpoints').max } },
                { dataField: "strength", width: 120, caption: translate(language, 'strength'), validationRules: [{ type: "required" }], width: 150, editorOptions: { min: validation.find(x => x.handle == 'strength').min, max: validation.find(x => x.handle == 'strength').max } },
                { dataField: "gold", width: 180, caption: translate(language, 'gold'), validationRules: [{ type: "required" }], editorOptions: { min: validation.find(x => x.handle == 'gold').min, max: validation.find(x => x.handle == 'gold').max } },
                { dataField: "diamond", width: 180, caption: translate(language, 'diamond'), validationRules: [{ type: "required" }], editorOptions: { min: validation.find(x => x.handle == 'diamond').min, max: validation.find(x => x.handle == 'diamond').max } },
                { dataField: "experience", width: 180, caption: translate(language, 'experience'), validationRules: [{ type: "required" }], editorOptions: { min: validation.find(x => x.handle == 'experience').min, max: validation.find(x => x.handle == 'experience').max } },
                {
                    dataField: 'category.handle',
                    caption: translate(languageItemCategory, 'value'), width: 150,
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
                },
                { dataField: "isActive", caption: translate(language, 'isActive'), width: 200, editorType: "dxCheckBox", width: 120 }
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
                e.data.hitpoints = 1500;
                e.data.strength = 10;
                e.data.gold = 5000;
                e.data.diamond = 100;
                e.data.experience = 5000;
                e.data.isActive = true;

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
