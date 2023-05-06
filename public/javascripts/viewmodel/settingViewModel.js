import { getTranslation, translate, infoPanel, getEditing, notify, get, put, getList } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let module = 'setting';
    let language = await getTranslation(module);

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
                key: "command",
                loadMode: "raw",
                load: async function (loadOptions) {
                    return await getList(`/loot/default`, language);
                },
                update: async function (key, values) {
                    values.command = key;
                    await put('/loot/default', values, 'put', language);
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
                {
                    dataField: "command", caption: translate(language, 'command'), allowEditing: false,
                    calculateCellValue(data) {
                        return translate(language, data.command)
                    }, sortIndex: 0, sortOrder: "asc"
                },
                { dataField: "minutes", caption: translate(language, 'minutes'), validationRules: [{ type: "required" }], width: 120 },
                { dataField: "countUses", caption: translate(language, 'countUses'), validationRules: [{ type: "required" }], width: 180, allowEditing: false },
                { dataField: "countRuns", caption: translate(language, 'countRuns'), validationRules: [{ type: "required" }], width: 180, allowEditing: false },
                {
                    dataField: "isActive", caption: translate(language, 'isActive'), editorType: "dxCheckBox", width: 120,
                    calculateCellValue(data) {
                        if (data.isActive != null) {
                            return data.isActive == 1 ? true : false;
                        } else {
                            return false;
                        }
                    }
                },
                {
                    dataField: "isLiveAutoControl", caption: translate(language, 'isLiveAutoControl'), editorType: "dxCheckBox", width: 160,
                    calculateCellValue(data) {
                        if (data.isLiveAutoControl != null) {
                            return data.isLiveAutoControl == 1 ? true : false;
                        } else {
                            return false;
                        }
                    }
                }
            ],
            editing: await getEditing(true, false, false, 'row'),
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
    //#endregion

    //#region Translation
    function translation() {
        document.getElementById("labelTitle").textContent = translate(language, 'title');
    }
    //#endregion
});
