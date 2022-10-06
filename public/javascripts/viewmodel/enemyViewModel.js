import { getTranslation, translate, infoPanel, tableExport, getEditing, notify, get } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let language = await getTranslation('enemy');

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
                key: "handle",
                loadMode: "raw",
                load: async function (loadOptions) {
                    return await get('/enemy/default', language);
                },
                insert: async function (values) {
                    await fetch('./api/enemy/default', {
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
                    item.handle = key;

                    await fetch('./api/enemy/default', {
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
                    await fetch('./api/enemy/default/' + key, {
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
                        dataSource: [options.data],
                        allowColumnReordering: true,
                        allowColumnResizing: true,
                        columns: [
                            { dataField: "experienceMin", caption: translate(language, 'experienceMin'), validationRules: [{ type: "required" }]},
                            { dataField: "experienceMax", caption: translate(language, 'experienceMax'), validationRules: [{ type: "required" }]},
                            { dataField: "GoldMin", caption: translate(language, 'GoldMin'), validationRules: [{ type: "required" }]},
                            { dataField: "GoldMax", caption: translate(language, 'GoldMax'), validationRules: [{ type: "required" }]},
                        ]
                    }));
                }
            },
            columns: [
                { dataField: "name", caption: translate(language, 'name'), validationRules: [{ type: "required" }], width: 150 },
                { dataField: "description", caption: translate(language, 'description'), validationRules: [{ type: "required" }],
                    cellTemplate: function(element, info) {
                        $("<div>")
                            .appendTo(element)
                            .text(info.value)
                            .css("width", info.column.width - 20)
                            .css("height", 40)
                            .css("white-space", "normal")
                            .css("overflow-wrap", 'break-word'); 
                }},
                { dataField: "difficulty", caption: translate(language, 'difficulty'), validationRules: [{ type: "required" }], width: 150},
                { dataField: "hitpoints", caption: translate(language, 'hitpoints'), validationRules: [{ type: "required" }], width: 150},
                { dataField: "strength", caption: translate(language, 'strength'), validationRules: [{ type: "required" }], width: 150},
                { dataField: "experienceMin", caption: translate(language, 'experienceMin'), validationRules: [{ type: "required" }], visible: false},
                { dataField: "experienceMax", caption: translate(language, 'experienceMax'), validationRules: [{ type: "required" }], visible: false},
                { dataField: "goldMin", caption: translate(language, 'goldMin'), validationRules: [{ type: "required" }], visible: false},
                { dataField: "goldMax", caption: translate(language, 'goldMax'), validationRules: [{ type: "required" }], visible: false},
                { dataField: "isActive", caption: translate(language, 'isActive'), width: 200, editorType: "dxCheckBox", width: 120 }
            ],
            editing: await getEditing(),
            export: {
                enabled: true,
                formats: ['xlsx', 'pdf']
            },
            onExporting(e) {
                tableExport(e, translate(language, 'title'))
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
