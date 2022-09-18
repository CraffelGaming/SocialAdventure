import { getTranslation, translate, infoPanel, get } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let language = await getTranslation('taverne');
    let languageHealing = await getTranslation('healing');
    let languageTrainer = await getTranslation('trainer');
    
    translation();
    initialize();
    loadHealing();
    loadTrainer();
    infoPanel();

    //#region Initialize
    function initialize() {
        $('#responsive-box').dxResponsiveBox({
            rows: [
                { ratio: 1 },
                { ratio: 1 },
                { ratio: 1 },
            ],
            cols: [
                { ratio: 1 },
                { ratio: 1, screen: 'lg' },
                { ratio: 1 },
            ],
            singleColumnScreen: 'sm',
            screenByWidth(width) {
                return (width < 1080) ? 'sm' : 'lg';
            },
        });
    }
    //#endregion

    //#region Load
    function loadHealing() {
        $("#healingDataGrid").dxDataGrid({
            dataSource: new DevExpress.data.CustomStore({
                key: "handle",
                loadMode: "raw",
                load: async function (loadOptions) {
                    return await get(`/healingPotion/default`, language);
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
                { dataField: "value", caption: translate(languageHealing, 'value'), width: 250 },
                { dataField: "description", caption: translate(languageHealing, 'description') },
                { dataField: "percent", caption: translate(languageHealing, 'percent'), width: 150 },
                { dataField: "gold", caption: translate(languageHealing, 'gold'), width: 150 },
            ],
            export: {
                enabled: true,
                formats: ['xlsx', 'pdf']
            },
            onExporting(e) {
                tableExport(e, translate(languageHealing, 'title'))
            }
        });
    }

    function loadTrainer() {
        $("#trainerDataGrid").dxDataGrid({
            dataSource: new DevExpress.data.CustomStore({
                key: "handle",
                loadMode: "raw",
                load: async function (loadOptions) {
                    return await get(`/trainer/default`, language);
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
                { dataField: "value", caption: translate(languageTrainer, 'value')},
                { dataField: "description", caption: translate(languageTrainer, 'description')},
                { dataField: "gold", caption: translate(languageTrainer, 'gold'), width: 150 },
            ],
            export: {
                enabled: true,
                formats: ['xlsx', 'pdf']
            },
            onExporting(e) {
                tableExport(e, translate(languageTrainer, 'title'))
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
