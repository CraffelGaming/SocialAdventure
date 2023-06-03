import { getTranslations, translate, infoPanel, getEditing, remove, get, copyToClipboard, put, getList, isMaster, isStreamer, loadUserData, tableExport } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let module = 'say';
    let languageStorage = await getTranslations([module, 'command', 'placeholder']);
    let language = languageStorage.filter(x => x.page == module);
    let languageCommand = languageStorage.filter(x => x.page == 'command');
    let languagePlaceholder = languageStorage.filter(x => x.page == 'placeholder');

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
                    return await getList(`/say/default`, language);
                },
                insert: async function (values) {
                    await put('/say/default', values, 'put', language);
                },
                update: async function (key, values) {
                    values.command = key;
                    await put('/say/default', values, 'put', language);
                },
                remove: async function (key) {
                    await remove(`/say/default/${key}`, language);
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
                template: masterDetailTemplate
            },
            columns: [
                { dataField: "command", caption: translate(language, 'command'), validationRules: [{ type: "required" }], width: 200, sortIndex: 0, sortOrder: "asc" },
                {
                    dataField: "text", caption: translate(language, 'text'), editorType: "dxTextArea", editorOptions: { autoResizeEnabled: true }, validationRules: [{ type: "required" }],
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
                { dataField: "minutes", caption: translate(language, 'minutes'), validationRules: [{ type: "required" }], width: 120 },
                { dataField: "delay", caption: translate(language, 'delay'), validationRules: [{ type: "required" }], width: 160 },
                { dataField: "timeout", caption: translate(language, 'timeout'), validationRules: [{ type: "required" }], width: 120 },
                { dataField: "shortcuts", caption: translate(language, 'shortcuts'), visible: false },
                {
                    dataField: "isShoutout", caption: translate(language, 'isShoutout'), editorType: "dxCheckBox", width: 120,
                    calculateCellValue(data) {
                        if (data.isShoutout != null) {
                            return data.isShoutout == 1 ? true : false;
                        } else {
                            return false;
                        }
                    }
                },
                {
                    dataField: "isCounter", caption: translate(language, 'isCounter'), editorType: "dxCheckBox", width: 120,
                    calculateCellValue(data) {
                        if (data.isCounter != null) {
                            return data.isCounter == 1 ? true : false;
                        } else {
                            return false;
                        }
                    }
                },
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
                },
                {
                    type: 'buttons',
                    buttons: ['edit', 'delete', {
                        icon: 'copy',
                        visible: (await isStreamer() && !await isMaster()),
                        hint: translate(language, "copyToOwnChannel"),
                        onClick: async function (e) {
                            let userData = await loadUserData();
                            e.row.data.count = 0;
                            e.row.data.countRuns = 0;
                            e.row.data.lastRun = null;
                            e.row.data.lastRun = null;
                            await put(`/say/${userData.login}`, e.row.data, 'put', language);
                        }
                    }]
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
            onInitNewRow(e) {
                e.data.minutes = 60;
                e.data.delay = 5;
                e.data.timeout = 10;

                e.data.isShoutout = false;
                e.data.isCounter = false;
                e.data.isLiveAutoControl = true;
                e.data.isActive = false;
            },
            onEditorPreparing(e) {
                var names = ["command"];

                if (names.includes(e.dataField) && e.parentType === "dataRow") {
                    e.editorOptions.disabled = e.row.isNewRow ? false : true;
                }
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

    //#region MasterDetail
    function masterDetailTemplate(_, masterDetailOptions) {
        return $('<div>').dxTabPanel({
            items: [{
                title: translate(language, 'overview'),
                template: createOverviewTabTemplate(masterDetailOptions.data),
            }, {
                title: translate(language, 'statistic'),
                template: createStatisticTabTemplate(masterDetailOptions.data),
            }, {
                title: translate(language, 'placeholder'),
                template: createPlaceholderTabTemplate(masterDetailOptions.data),
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
                    { dataField: 'lastRun', caption: translate(language, 'lastRun'), dataType: 'datetime', width: 200 },
                    { dataField: 'count', caption: translate(language, 'count') }
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
                    { dataField: "isModerator", caption: translate(languageCommand, 'isModerator'), width: 200 },
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

    function createPlaceholderTabTemplate(masterDetailData) {
        return function () {
            return $('<div>').dxDataGrid({
                dataSource: new DevExpress.data.CustomStore({
                    key: "handle",
                    loadMode: "raw",
                    load: async function () {
                        let items = await get(`/placeholder`, languagePlaceholder);

                        if (!masterDetailData.isCounter) {
                            items = items.filter(x => !x.isCounter)
                        }
                        if (!masterDetailData.isShoutout) {
                            items = items.filter(x => !x.isShoutout)
                        }
                        return items;
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
                    { dataField: "handle", caption: translate(languagePlaceholder, 'title'), width: 200 },
                    {
                        caption: translate(languagePlaceholder, 'description'),
                        calculateCellValue(data) {
                            return translate(languagePlaceholder, data.translation)
                        }
                    }
                ]
            });
        };
    }
    //#endregion

    //#region Translation
    function translation() {
        document.getElementById("labelTitle").textContent = translate(language, 'title');
    }
    //#endregion
});
