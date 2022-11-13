import { getTranslation, translate, infoPanel, get, put } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;
    
    let module = 'index';
    let language = await getTranslation(module);
    let twitch = await get(`/twitch`, language);
    let languageStreamer = await getTranslation('streamer');

    translation();
    initialize();
    load();
    loadOnlineStreamer();
    infoPanel();
    
    //#region Initialize
    function initialize() {
        $('#responsive-box').dxResponsiveBox({
            rows: [
                { ratio: 1 },
                { ratio: 0 },
                { ratio: 1 },
            ],
            cols: [
                { ratio: 1 },
                { ratio: 0, screen: 'lg' },
                { ratio: 1 },
            ],
            singleColumnScreen: 'sm',
            screenByWidth(width) {
                return (width < 1080) ? 'sm' : 'lg';
            },
        });

        $("#left").dxButton({
            text: translate(language, 'leftButton'),
            onClick: function() {
                window.location = twitch.url;
            } 
        });

        $("#right").dxButton({
            text: translate(language, 'rightButton'),
            onClick: function() {
                window.location = "/streamer"
            } 
        });
    }
    //#endregion

    //#region Load
    function load() {
        const query = new URLSearchParams(window.location.search)
        let node = "";
        if(query.has('node')){
            node = query.get('node')
        }

        if(node != ""){
            document.getElementById("information").textContent = translate(language, 'node').replace('$1', node);
        } else document.getElementById("information").textContent = translate(language, 'information');
        document.getElementById("start").textContent = translate(language, 'start');
    }
    //#endregion

    //#region Streamer
    function loadOnlineStreamer() {
        $("#dataGrid").dxDataGrid({
            dataSource: new DevExpress.data.CustomStore({
                key: "name",
                loadMode: "raw",
                load: async function (loadOptions) {
                    return await get(`/node/live`, language);
                }
            }),
            searchPanel: { visible: true },
            allowColumnReordering: true,
            allowColumnResizing: true,
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
                      $('<div>')
                        .append($('<img>', { src: options.data.twitchUser.profileImageUrl != null ?options.data.twitchUser.profileImageUrl : '/images/twitch-logo.png', width: 64, height: 64 }))
                        .appendTo(container);
                    },
                },
                { dataField: "name", caption: translate(languageStreamer, 'name'), visible: false },
                { dataField: "displayName", caption: translate(languageStreamer, 'displayName'), overflow: 'hidden' },
                { dataField: "language", caption: translate(languageStreamer, 'language'), width: 120 },
                { dataField: "endpoint", caption: translate(languageStreamer, 'endpoint'), width: 400, editorType: "dxTextBox", editorOptions: { type: 'url' }},
                {
                    type: "buttons",
                    buttons: [{
                        icon: "check",
                        hint: translate(languageStreamer, "checkHint"),
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
                                notify(translate(languageStreamer, 'streamerChanged').replace('$1', json.node.displayName), 'success');
                                infoPanel();
                            });
                        }
                    },
                    {
                        icon: "link",
                        hint: translate(languageStreamer, "checkTwitch"),
                        onClick: function (e) {
                            $("<a>").prop({
                                target: "_blank",
                                href: e.row.data.endpoint
                            })[0].click();
                        }
                    }]
                }
            ],
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
        document.getElementById("leftTitle").textContent = translate(language, 'left');
        document.getElementById("rightTitle").textContent = translate(language, 'right');
        document.getElementById("liveStreamer").textContent = translate(languageStreamer, 'liveStreamer');
        document.getElementById("leftInformation").textContent = translate(language, 'leftInformation').replace('$1', translate(language, 'leftButton'));
        document.getElementById("rightInformation").textContent = translate(language, 'rightInformation').replace('$1', translate(language, 'rightButton'));
    }
    //#endregion
});
