import { getTranslation, translate, infoPanel } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let language = await getTranslation('hero');
    let languageItem = await getTranslation('item');
    let languageWallet = await getTranslation('wallet');
    let languageTrait = await getTranslation('trait');
    
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
            masterDetail: {
                enabled: true,
                template: masterDetailTemplate
            },
            columns: [
                { dataField: "name", caption: translate(language, 'name') },

                {
                    caption: translate(language, 'lastSteal'), width: 200,
                    calculateCellValue(data) {
                        return new Date(data.lastSteal).toLocaleDateString() + " " + new Date(data.lastSteal).toLocaleTimeString();
                    }
                },
                {
                    caption: translate(language, 'lastJoin'), width: 200,
                    calculateCellValue(data) {
                        return new Date(data.lastJoin).toLocaleDateString() + " " + new Date(data.lastJoin).toLocaleTimeString();
                    }
                },

                { dataField: "experience", caption: translate(language, 'experience'), width: 300 }, 
                { dataField: "isActive", caption: translate(language, 'isActive'), width: 120 }
            ],
            export: {
                enabled: true,
                formats: ['xlsx', 'pdf']
            },
            onExporting(e) {
                tableExport(e, translate(language, 'title'))
            }
        });

        function masterDetailTemplate(_, masterDetailOptions) {
            return $('<div>').dxTabPanel({
                items: [{
                    title: translate(language, 'inventory'),
                    template: createItemTabTemplate(masterDetailOptions.data, 1),
                }, {
                    title: translate(language, 'wallet'),
                    template: createWalletTabTemplate(masterDetailOptions.data, 1),
                }, {
                    title: translate(language, 'trait'),
                    template: createTraitTabTemplate(masterDetailOptions.data, 1),
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
                        { dataField: "item.gold", caption: translate(languageItem, 'gold'), width: 200 },
                        { dataField: "quantity", caption: translate(language, 'quantity'), width: 200 },
                        {
                            caption: translate(language, 'total'), width: 250,
                            calculateCellValue(data) {
                                console.log(data);
                              return data.quantity * data.item.gold;
                            }
                        }
                    ]
                });
            };
        }

        function createWalletTabTemplate(masterDetailData) {
            return function () {
                return $('<div>').dxDataGrid({
                    dataSource: new DevExpress.data.CustomStore({
                        key: ["heroName"],
                        loadMode: "raw",
                        load: async function () {
                            var properties;
                            await fetch('./api/herowallet/default/hero/' + masterDetailData.name, {
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
                        { dataField: "gold", caption: translate(languageWallet, 'gold') },
                        { dataField: "diamond", caption: translate(languageWallet, 'diamond') },
                        { dataField: "blood", caption: translate(languageWallet, 'blood') },
                        {
                            caption: translate(languageWallet, 'lastBlood'), width: 200,
                            calculateCellValue(data) {
                                return new Date(data.lastBlood).toLocaleDateString() + " " + new Date(data.lastBlood).toLocaleTimeString();
                            }
                        }
                    ]
                });
            };
        }

        function createTraitTabTemplate(masterDetailData) {
            return function () {
                return $('<div>').dxDataGrid({
                    dataSource: new DevExpress.data.CustomStore({
                        key: ["heroName"],
                        loadMode: "raw",
                        load: async function () {
                            var properties;
                            await fetch('./api/herotrait/default/hero/' + masterDetailData.name, {
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
                        { dataField: "goldMultipler", caption: translate(languageTrait, 'goldMultipler') },
                        { dataField: "stealMultipler", caption: translate(languageTrait, 'stealMultipler') },
                        { dataField: "defenceMultipler", caption: translate(languageTrait, 'defenceMultipler') },
                        { dataField: "workMultipler", caption: translate(languageTrait, 'workMultipler') }
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
