import { getTranslation, translate, infoPanel, getEditing, notify } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let language = await getTranslation('say');
    
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
                    var items;
                    await fetch('./api/say/default', {
                        method: 'get',
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }).then(async function (res) {
                        switch(res.status){
                            case 200:
                                return res.json();
                        }
                    }).then(async function (json) {
                        items = json;
                    });
                    return items;
                },
                insert: async function (values) {
                    await fetch('./api/say/default', {
                        method: 'put',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify(values)
                    }).then(async function (res) {
                        switch(res.status){
                            case 201:
                                notify(translate(language, res.status), "success");
                            break;
                            default:
                                notify(translate(language, res.status), "error");
                            break;
                        }
                    });
                },
                update: async function (key, values) {
                    var item = values;
                    item.command = key;
                    await fetch('./api/say/default', {
                        method: 'put',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify(item)
                    }).then(async function (res) {
                        switch(res.status){
                            case 201:
                                notify(translate(language, res.status), "success");
                                break;
                            default:
                                notify(translate(language, res.status), "error");
                            break;
                        }
                    });
                },
                remove: async function (key) {
                    console.log(key);
                    await fetch('./api/say/default/' + key, {
                        method: 'delete',
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }).then(async function (res) {
                        switch(res.status){
                            case 204:
                                notify(translate(language, res.status), "success");
                                break;
                            default:
                                notify(translate(language, res.status), "error");
                            break;
                        }
                    });
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
                template(container, options) {
                    container.append($("<div>").dxDataGrid({
                        dataSource: new Array(options.data),
                        allowColumnReordering: true,
                        allowColumnResizing: true,
                        columns: [
                            { dataField: "countUses", caption: translate(language, 'countUses') },
                            { dataField: "countRuns", caption: translate(language, 'countRuns') }
                        ]
                    }));
                }
            },
            columns: [
                { dataField: "command", caption: translate(language, 'command'), validationRules: [{ type: "required" }], width: 200 },
                { dataField: "text", caption: translate(language, 'text'), validationRules: [{ type: "required" }]  },
                { dataField: "minutes", caption: translate(language, 'minutes'), validationRules: [{ type: "required" }], width: 120 },
                { dataField: "delay", caption: translate(language, 'delay'), validationRules: [{ type: "required" }], width: 120 },
                {
                    caption: translate(language, 'lastRun'), allowEditing: false, width: 160,
                    calculateCellValue(data) {
                        if(data.lastRun != null){
                            return new Date(data.lastRun).toLocaleDateString() + " " + new Date(data.lastRun).toLocaleTimeString();
                        } else {
                            return '';
                        } 
                    }
                },
                { dataField: "isActive", caption: translate(language, 'isActive'), editorType: "dxCheckBox", width: 120,
                    calculateCellValue(data) {
                        if(data.isActive != null){
                            return data.isActive == 1 ? true : false;
                        } else {
                            return false;
                        } 
                    } 
                }
            ],
            editing: await getEditing(),
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
