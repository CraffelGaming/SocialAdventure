import { getTranslation, translate, infoPanel, get, copyToClipboard } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let language = await getTranslation('command');
    
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
                key: "command",
                loadMode: "raw",
                load: async function (loadOptions) {
                    return await get('/command/default/loot', language);
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
                {
                    type: "buttons",
                    buttons: [{
                        icon: "link",
                        hint: translate(language, "copyToClipboard"),
                        onClick: function (e) {
                            copyToClipboard(e.row.values[1]);
                        }
                    }]
                },
                {
                    caption: translate(language, 'command'), width: 200,
                    calculateCellValue(data) {
                      return "!" + data.command;
                    }
                },
                { dataField: "isMaster", caption: translate(language, 'isMaster'), width: 200 },
                {
                    caption: translate(language, 'description'),
                    calculateCellValue(data) {
                      return translate(language, data.translation)
                    },
                    cellTemplate: function(element, info) {
                        $("<div>")
                            .appendTo(element)
                            .text(info.value)
                            .css("width", info.column.width - 20)
                            .css("height", 40)
                            .css("white-space", "normal")
                            .css("overflow-wrap", 'break-word'); 
                    }
                }
            ],
            export: {
                enabled: true,
                formats: ['xlsx', 'pdf']
            },
            onExporting(e) {
                tableExport(e, translate(language, 'title'))
            },
            onEditorPreparing(e) {
                var names = ["command"];

                if (names.includes(e.dataField) && e.parentType === "dataRow") {
                    e.editorOptions.disabled = e.row.isNewRow ? false : true;
                }

                if (e.dataField === "isActive" && e.parentType === "dataRow") {
                    if (e.row.isNewRow) {
                        e.editorOptions.value = true;
                    }
                }
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
