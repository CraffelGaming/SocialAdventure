import { getTranslation, translate, infoPanel } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let language = await getTranslation('streamer');
    let streamer;
    
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
                    await fetch('./api/node', {
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
                    dataField: 'Picture',
                    caption: "",
                    width: 100,
                    allowFiltering: false,
                    allowSorting: false,
                    cellTemplate(container, options) {
                        console.log(options);
                      $('<div>')
                        .append($('<img>', { src: options.data.profileImageUrl != null ?options.data.profileImageUrl : '/images/twitch-logo.png', width: 64, height: 64 }))
                        .appendTo(container);
                    },
                },
                { dataField: "name", caption: translate(language, 'name'), visible: false },
                { dataField: "displayName", caption: translate(language, 'displayName'), width: 400, overflow: 'hidden' },
                { dataField: "language", caption: translate(language, 'language'), width: 120 },
                { dataField: "isActive", caption: translate(language, 'isActive'), dataType:'boolean', alignment: 'left', width: 120 },
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
                                streamer = json;
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