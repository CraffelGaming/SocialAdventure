import { getTranslation, translate, infoPanel, get, put } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let module = 'streamer';
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
                key: "name",
                loadMode: "raw",
                load: async function (loadOptions) {
                    return await get(`/node`, language);
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
                {
                    dataField: 'Picture',
                    caption: "",
                    width: 100,
                    allowFiltering: false,
                    allowSorting: false,
                    cellTemplate(container, options) {
                      $('<div>')
                        .append($('<img>', { src: options.data.twitchUser.profileImageUrl != null ?options.data.twitchUser.profileImageUrl : '/images/twitch-logo.png', width: 64, height: 64 }))
                        .appendTo(container);
                    },
                },
                { dataField: "name", caption: translate(language, 'name'), visible: false },
                { dataField: "displayName", caption: translate(language, 'displayName'), overflow: 'hidden' },
                { dataField: "language", caption: translate(language, 'language'), width: 120 },
                { dataField: "isActive", caption: translate(language, 'isActive'), dataType:'boolean', alignment: 'left', width: 120 },
                { dataField: "isLive", caption: translate(language, 'isLive'), dataType:'boolean', alignment: 'left', width: 120 },
                { dataField: "endpoint", caption: translate(language, 'endpoint'), width: 250, editorType: "dxTextBox", editorOptions: { type: 'url' }},
                {
                    type: "buttons",
                    buttons: [{
                        icon: "check",
                        hint: translate(language, "checkHint"),
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
                                infoPanel();
                            });
                        }
                    },
                    {
                        icon: "link",
                        hint: translate(language, "checkTwitch"),
                        onClick: function (e) {
                            $("<a>").prop({
                                target: "_blank",
                                href: e.row.data.endpoint
                            })[0].click();
                        }
                    }]
                }
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
                items: ["groupPanel", "addRowButton", "columnChooserButton", {
                    widget: 'dxButton', options: { icon: 'refresh', onClick() { $('#dataGrid').dxDataGrid('instance').refresh(); }}
                }, { 
                    widget: 'dxButton', options: { icon: 'revert', onClick: async function () { $('#dataGrid').dxDataGrid('instance').state(null); }}
                    }, "searchPanel", "exportButton"]
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