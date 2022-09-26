import { getTranslation, translate, infoPanel, getEditing, notify, get, copyToClipboard } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let language = await getTranslation('say');
    let languageCommand = await getTranslation('command');

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
                    return await get(`/say/default`, language);
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
                remove: async function (key) {;
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
                template: masterDetailTemplate
            },
            columns: [
                { dataField: "command", caption: translate(language, 'command'), validationRules: [{ type: "required" }], width: 200 },
                { dataField: "text", caption: translate(language, 'text'), validationRules: [{ type: "required" }]  },
                { dataField: "minutes", caption: translate(language, 'minutes'), validationRules: [{ type: "required" }], width: 120 },
                { dataField: "delay", caption: translate(language, 'delay'), validationRules: [{ type: "required" }], width: 120 },
                { dataField: "isShoutout", caption: translate(language, 'isShoutout'), editorType: "dxCheckBox", width: 120,
                    calculateCellValue(data) {
                        if(data.isShoutout != null){
                            return data.isShoutout == 1 ? true : false;
                        } else {
                            return false;
                        } 
                    } 
                },
                { dataField: "isCounter", caption: translate(language, 'isCounter'), editorType: "dxCheckBox", width: 120,
                    calculateCellValue(data) {
                        if(data.isCounter != null){
                            return data.isCounter == 1 ? true : false;
                        } else {
                            return false;
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

        function masterDetailTemplate(_, masterDetailOptions) {
            return $('<div>').dxTabPanel({
                items: [{
                    title: translate(language, 'overview'),
                    template: createOverviewTabTemplate(masterDetailOptions.data, 1),
                }, {
                    title: translate(language, 'statistic'),
                    template: createStatisticTabTemplate(masterDetailOptions.data, 1),
                }],
            });
        }

        function createStatisticTabTemplate(masterDetailData) {
            return function () {
                return $('<div>').dxDataGrid({
                    dataSource: new Array(masterDetailData),
                    allowColumnReordering: true,
                    allowColumnResizing: true,
                    selection: { mode: "single" },
                    columns: [
                        { dataField: "countUses", caption: translate(language, 'countUses') },
                        { dataField: "countRuns", caption: translate(language, 'countRuns') },
                        { dataField: 'lastRun', caption: translate(language, 'lastRun')},
                        { dataField: 'count', caption: translate(language, 'count')}
                    ]
                });
            };
        }

        function createOverviewTabTemplate(masterDetailData) {
            return function () {
                return $('<div>').dxDataGrid({
                    dataSource: new DevExpress.data.CustomStore({
                        key: ["module", "command"],
                        loadMode: "raw",
                        load: async function () {
                            console.log(masterDetailData);
                            return await get(`/command/default/say?counter=${masterDetailData.isCounter}`, language);
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
                            caption: translate(languageCommand, 'command'), width: 200,
                            calculateCellValue(data) {
                              return "!" + masterDetailData.command + data.command;
                            }
                        },
                        { dataField: "isMaster", caption: translate(languageCommand, 'isMaster'), width: 200 },
                        {
                            caption: translate(languageCommand, 'description'),
                            calculateCellValue(data) {
                              return translate(languageCommand, data.translation)
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
