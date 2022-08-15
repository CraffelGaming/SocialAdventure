import { getTranslation, translate } from './globalData.js';

$(async () => {
    let language = await getTranslation('streamer');
    window.jsPDF = window.jspdf.jsPDF;
    
    translation();
    load();

    //#region Load
    function load() {
        $("#dataGrid").dxDataGrid({
            dataSource: new DevExpress.data.CustomStore({
                key: "name",
                loadMode: "raw",
                load: async function (loadOptions) {
                    var items;
                    await fetch('./api/node', {
                        method: 'get',
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }).then(async function (res) {
                        if (res.status == 200) {
                            return res.json();
                        }
                    }).then(async function (json) {
                        items = json;
                    });
                    return items;
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
                { dataField: "name", caption: translate(language, 'name'), visible: false  },
                { dataField: "displayName", caption: translate(language, 'displayName') },
                { dataField: "language", caption: translate(language, 'language') },
                { dataField: "isActive", caption: translate(language, 'isActive'), dataType:"boolean", alignment: "left" },
                { dataField: "endpoint", caption: translate(language, 'endpoint')},
                {
                    type: "buttons",
                    buttons: [{
                        text: "Auswählen",
                        icon: "check",
                        hint: "Alles von diesem Streamer anzeigen.",
                        onClick: function (e) {
                            fetch(`./api/node/default?node=${e.row.key}`, {
                                method: 'post',
                                headers: {
                                    'Content-type': 'application/json'
                                }
                            }).then(async function (res) {
                                if (res.status == 200) {
                                    return res.json();
                                }
                            }).then(async function (json) {
                                alert(json.node);
                            });
                        }
                    }]
                }
            ],
            export: {
                enabled: true,
                formats: ['xlsx', 'pdf']
            },
            onExporting(e) {
                if (e.format === 'xlsx') {
                    const workbook = new ExcelJS.Workbook();
                    const worksheet = workbook.addWorksheet("Main sheet");
                    DevExpress.excelExporter.exportDataGrid({
                        worksheet: worksheet,
                        component: e.component,
                    }).then(function () {
                        workbook.xlsx.writeBuffer().then(function (buffer) {
                            saveAs(new Blob([buffer], { type: "application/octet-stream" }), translate(language, 'title') + ".xlsx");
                        });
                    });
                    e.cancel = true;
                }
                else if (e.format === 'pdf') {
                    const doc = new jsPDF();
                    DevExpress.pdfExporter.exportDataGrid({
                        jsPDFDocument: doc,
                        component: e.component,
                    }).then(() => {
                        doc.save(translate(language, 'title') + '.pdf');
                    });
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
