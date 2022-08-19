import { getTranslation, translate, infoPanel } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let language = await getTranslation('hero');
    let languageItem = await getTranslation('item');
    
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
                key: "name",
                loadMode: "raw",
                load: async function (loadOptions) {
                    var items;
                    await fetch('./api/hero/default', {
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
            masterDetail: {
                enabled: true,
                template: masterDetailTemplate
            },
            columns: [
                { dataField: "name", caption: translate(language, 'name') },

                {
                    caption: translate(language, 'lastSteal'),
                    calculateCellValue(data) {
                        return new Date(data.lastSteal).toLocaleDateString() + " " + new Date(data.lastSteal).toLocaleTimeString();
                    }
                },
                {
                    caption: translate(language, 'lastJoin'),
                    calculateCellValue(data) {
                        return new Date(data.lastJoin).toLocaleDateString() + " " + new Date(data.lastJoin).toLocaleTimeString();
                    }
                },

                { dataField: "experience", caption: translate(language, 'experience') },
                { dataField: "isActive", caption: translate(language, 'isActive') }
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

        function masterDetailTemplate(_, masterDetailOptions) {
            return $('<div>').dxTabPanel({
                items: [{
                    title: translate(languageItem, 'title'),
                    template: createItemTabTemplate(masterDetailOptions.data, 1),
                }],
            });
        }

        function createItemTabTemplate(masterDetailData) {
            return function () {
                return $('<div>').dxDataGrid({
                    dataSource: new DevExpress.data.CustomStore({
                        key: ["itemHandle", "heroName"],
                        loadMode: "raw",
                        load: async function () {
                            var properties;
                            await fetch('./api/heroinventory/default/hero/' + masterDetailData.name, {
                                method: 'get',
                                headers: {
                                    'Content-type': 'application/json'
                                }
                            }).then(function (res) {
                                switch (res.status) {
                                    case 200:
                                        return res.json();
                                }
                            }).then(function (json) {
                                if (json != undefined) {
                                    console.log(json);
                                    properties = json;
                                }
                            });
                            return properties;
                        }
                    }),
                    allowColumnReordering: true,
                    allowColumnResizing: true,
                    selection: { mode: "single" },
                    editing: {
                        mode: "row",
                        allowUpdating: false,
                        allowDeleting: false,
                        allowAdding: false
                    },
                    columns: [
                        { dataField: "item.value", caption: translate(languageItem, 'value') },
                        { dataField: "item.gold", caption: translate(languageItem, 'gold') },
                        { dataField: "quantity", caption: translate(language, 'quantity') },
                        {
                            caption: translate(language, 'total'),
                            calculateCellValue(data) {
                                console.log(data);
                              return data.quantity * data.item.gold;
                            }
                        }
                    ]
                });
            };
        }
    }
    //#endregion

    //#region Translation
    function translation() {
        document.getElementById("labelTitle").textContent = translate(language, 'title');
    }
    //#endregion
});
