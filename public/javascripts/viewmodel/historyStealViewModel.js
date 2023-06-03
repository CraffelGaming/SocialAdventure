import { getTranslation, translate, infoPanel, get, put, getList, tableExport } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let module = 'historySteal';
    let language = await getTranslation(module);

    translation();
    initialize();
    load();
    infoPanel();

    //#region Initialize
    function initialize() {

    }
    //#endregion

    //#region Load
    function load() {
        $("#dataGrid").dxDataGrid({
            dataSource: new DevExpress.data.CustomStore({
                key: "handle",
                loadMode: "raw",
                load: async function (loadOptions) {
                    return await getList(`/historySteal/default`, language);
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
                { dataField: "handle", caption: translate(language, 'handle'), visible: false },
                { dataField: "date", caption: translate(language, 'date'), dataType: 'datetime', sortIndex: 0, sortOrder: "desc" },
                { dataField: "sourceHeroName", caption: translate(language, 'sourceHeroName') },
                { dataField: "targetHeroName", caption: translate(language, 'targetHeroName') },
                { dataField: "rollSource", caption: translate(language, 'rollSource') },
                { dataField: "rollSourceCount", caption: translate(language, 'rollSourceCount') },
                { dataField: "rollTarget", caption: translate(language, 'rollTarget') },
                { dataField: "rollTargetCount", caption: translate(language, 'rollTargetCount') },
                { dataField: "isSuccess", caption: translate(language, 'isSuccess') },
                { dataField: "itemName", caption: translate(language, 'itemName') }
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
