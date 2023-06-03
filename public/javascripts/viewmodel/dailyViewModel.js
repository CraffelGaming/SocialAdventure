import { getTranslation, translate, infoPanel, getEditing, get, put, remove, getList, tableExport } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let module = 'daily';
    let language = await getTranslation(module);
    let validation = await get(`/validation/${module}`);

    translation();
    await initialize()
    load();
    infoPanel();

    //#region Initialize
    async function initialize() {

    }
    //#endregion

    //#region Load
    async function load() {
        $("#dataGrid").dxDataGrid({
            dataSource: new DevExpress.data.CustomStore({
                key: "handle",
                loadMode: "raw",
                load: async function (loadOptions) {
                    return await getList(`/daily/default`, language);
                },
                insert: async function (values) {
                    await put('/daily/default', values, 'put', language);
                },
                update: async function (key, values) {
                    values.handle = key;
                    await put('/daily/default', values, 'put', language);
                },
                remove: async function (key) {
                    await remove(`/daily/default/${key}`, language);
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
                { dataField: "value", caption: translate(language, 'value'), validationRules: [{ type: "required" }], width: 200, sortIndex: 0, sortOrder: "asc" },
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
                { dataField: "experienceMin", caption: translate(language, 'experienceMin'), validationRules: [{ type: "required" }], width: 150, editorOptions: { min: validation.find(x => x.handle == 'experienceMin').min, max: validation.find(x => x.handle == 'experienceMin').max } },
                { dataField: "experienceMax", caption: translate(language, 'experienceMax'), validationRules: [{ type: "required" }], width: 150, editorOptions: { min: validation.find(x => x.handle == 'experienceMax').min, max: validation.find(x => x.handle == 'experienceMax').max } },
                { dataField: "goldMin", caption: translate(language, 'goldMin'), validationRules: [{ type: "required" }], width: 150, editorOptions: { min: validation.find(x => x.handle == 'goldMin').min, max: validation.find(x => x.handle == 'goldMin').max } },
                { dataField: "goldMax", caption: translate(language, 'goldMax'), validationRules: [{ type: "required" }], width: 150, editorOptions: { min: validation.find(x => x.handle == 'goldMax').min, max: validation.find(x => x.handle == 'goldMax').max } }
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
                e.data.experienceMin = 100;
                e.data.experienceMax = 500;
                e.data.goldMin = 100;
                e.data.goldMax = 500;
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