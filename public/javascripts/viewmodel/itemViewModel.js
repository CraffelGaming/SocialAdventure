import { getTranslation, translate } from './globalData.js';

$(async () => {
    let language = await getTranslation('item');
    window.jsPDF = window.jspdf.jsPDF;
    
    translation();
    load();

    //#region Load
    function load() {
        fetch('./api/item/default', {
            method: 'get',
            headers: {
                'Content-type': 'application/json'
            }
        }).then(async function (res) {
            if (res.status == 200) {
                return res.json();
            }
        }).then(async function (json) {
            $("#dataGrid").dxDataGrid({
                dataSource: json,
                keyExpr: "handle",
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
                    { dataField: "handle", caption: translate(language, 'handle') },
                    { dataField: "value", caption: translate(language, 'value') },
                    { dataField: "gold", caption: translate(language, 'gold') },
                    { dataField: "type", caption: translate(language, 'type') }
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
        });
    }
    //#endregion

    //#region Translation
    function translation() {
        document.getElementById("labelTitle").textContent = translate(language, 'title');
    }
    //#endregion
});
