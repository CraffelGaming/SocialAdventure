import { getTranslation, translate, infoPanel, tableExport, getEditing, get, put, remove, getList } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let module = 'enemy';
    let language = await getTranslation(module);
    let validation = await get(`/validation/${module}`);

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
                    return await getList('/enemy/default', language);
                },
                insert: async function (values) {
                    await put('/enemy/default', values, 'put', language);
                },
                update: async function (key, values) {
                    values.handle = key;
                    await put('/enemy/default', values, 'put', language);
                },
                remove: async function (key) {
                    await remove(`/enemy/default/${key}`, language);
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
            masterDetail: {
                enabled: true,
                template(container, options) {
                    container.append($("<div>").dxDataGrid({
                        dataSource: [options.data],
                        allowColumnReordering: true,
                        allowColumnResizing: true,
                        columns: [
                            { dataField: "experienceMin", caption: translate(language, 'experienceMin'), validationRules: [{ type: "required" }] },
                            { dataField: "experienceMax", caption: translate(language, 'experienceMax'), validationRules: [{ type: "required" }] },
                            { dataField: "goldMin", caption: translate(language, 'goldMin'), validationRules: [{ type: "required" }] },
                            { dataField: "goldMax", caption: translate(language, 'goldMax'), validationRules: [{ type: "required" }] },
                        ]
                    }));
                }
            },
            columns: [
                { dataField: "name", caption: translate(language, 'name'), validationRules: [{ type: "required" }], width: 150, sortIndex: 0, sortOrder: "asc"  },
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
                { dataField: "difficulty", caption: translate(language, 'difficulty'), validationRules: [{ type: "required" }], width: 150 },
                { dataField: "hitpoints", caption: translate(language, 'hitpoints'), validationRules: [{ type: "required" }], width: 150, editorOptions: { min: validation.find(x => x.handle == 'hitpoints').min, max: validation.find(x => x.handle == 'hitpoints').max } },
                { dataField: "strength", caption: translate(language, 'strength'), validationRules: [{ type: "required" }], width: 150, editorOptions: { min: validation.find(x => x.handle == 'strength').min, max: validation.find(x => x.handle == 'strength').max } },
                { dataField: "experienceMin", caption: translate(language, 'experienceMin'), validationRules: [{ type: "required" }], visible: false, editorOptions: { min: validation.find(x => x.handle == 'experienceMin').min, max: validation.find(x => x.handle == 'experienceMin').max } },
                { dataField: "experienceMax", caption: translate(language, 'experienceMax'), validationRules: [{ type: "required" }], visible: false, editorOptions: { min: validation.find(x => x.handle == 'experienceMax').min, max: validation.find(x => x.handle == 'experienceMax').max } },
                { dataField: "goldMin", caption: translate(language, 'goldMin'), validationRules: [{ type: "required" }], visible: false, editorOptions: { min: validation.find(x => x.handle == 'goldMin').min, max: validation.find(x => x.handle == 'goldMin').max } },
                { dataField: "goldMax", caption: translate(language, 'goldMax'), validationRules: [{ type: "required" }], visible: false, editorOptions: { min: validation.find(x => x.handle == 'goldMax').min, max: validation.find(x => x.handle == 'goldMax').max } },
                { dataField: "isActive", caption: translate(language, 'isActive'), width: 200, editorType: "dxCheckBox", width: 120 }
            ],
            editing: await getEditing(),
            export: {
                enabled: true,
                formats: ['xlsx', 'pdf']
            },
            onExporting(e) {
                tableExport(e, translate(language, 'title'))
            },
            onInitNewRow(e) {
                e.data.difficulty = 1;
                e.data.hitpoints = 50;
                e.data.strength = 12;
                e.data.experienceMin = 100;
                e.data.experienceMax = 500;
                e.data.goldMin = 100;
                e.data.goldMax = 500;
                e.data.isActive = true;
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
