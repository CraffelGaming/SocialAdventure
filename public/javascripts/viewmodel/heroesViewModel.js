import { getTranslations, translate, infoPanel, get, put } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let module = 'hero';
    let languageStorage = await getTranslations([module, 'item', 'wallet', 'trait', 'adventure', 'level', 'itemCategory', 'promotion']);
    let language = languageStorage.filter(x => x.page == module);
    let languageItem = languageStorage.filter(x => x.page == 'item');
    let languageWallet = languageStorage.filter(x => x.page == 'wallet');
    let languageTrait = languageStorage.filter(x => x.page == 'trait');
    let languageAdventure = languageStorage.filter(x => x.page == 'adventure');
    let languageLevel = languageStorage.filter(x => x.page == 'level');
    let languageItemCategory = languageStorage.filter(x => x.page == 'itemCategory');
    let languagePromotion = languageStorage.filter(x => x.page == 'promotion');

    let validation = await get(`/validation/${module}`);
    let category = await get('/itemcategory/default/', language);
    let levels = [];
    
    translation();
    await initialize();
    load();
    infoPanel();
    
    //#region Initialize
    async function initialize() {
        levels = await get('/level/default/', language)
    }
    //#endregion

    //#region Load
    function load() {
        $("#dataGrid").dxDataGrid({
            dataSource: new DevExpress.data.CustomStore({
                key: "name",
                loadMode: "raw",
                load: async function (loadOptions) {
                    return await get('/hero/default', language);
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
                {
                    dataField: 'Picture',
                    caption: "",
                    width: 125,
                    allowFiltering: false,
                    allowSorting: false,
                    cellTemplate(container, options) {
                        var template =  $('<div>');
                        template.append($('<img>', { src: options.data.profileImageUrl != null ?options.data.profileImageUrl : '/images/prestige/' + options.row.data.prestige + '.png', width: 64, height: 64 }))
                        if(options.data.isFounder)
                            template.append($('<img>', { src: '/images/hero/founder.png', width: 32, height: 32 }))
                        template.appendTo(container);
                    },
                },
                { dataField: "name", caption: translate(language, 'name'), minWidth: 100 },
                { caption: translate(languageLevel, 'handle'), width: 100,
                    calculateCellValue(data) {
                        return levels.find(x => x.experienceMax >= data.experience && x.experienceMin <= data.experience).handle;
                }}, 
                { dataField: "experience", caption: translate(language, 'experience'), width: 250, 
                    cellTemplate: function (container, options) {  
                        let level = levels.find(x => x.experienceMax >= options.data.experience && x.experienceMin <= options.data.experience);
                        $("<div />").attr({ 'class': 'cls', 'data-key': options.data.name }).dxProgressBar({  
                            min: level.experienceMin,  
                            max: level.experienceMax,
                            value: options.data.experience,
                            statusFormat: function(){
                                return options.data.experience + ' / ' + level.experienceMax
                            }  
                        }).appendTo(container);  
                    }
                },
                { dataField: "hitpoints", caption: translate(language, 'hitpoints'), width: 250, 
                    cellTemplate: function (container, options) {  
                        $("<div />").attr({ 'class': 'cls', 'data-key': options.data.name }).dxProgressBar({  
                            min: 0,  
                            max: options.data.hitpointsMax,
                            value: options.data.hitpoints,
                            statusFormat: function(){
                                return options.data.hitpoints + '/' + options.data.hitpointsMax
                            }  
                        }).appendTo(container);  
                    }  
                }, 
                { dataField: 'strength', caption: translate(language, 'strength'), width: 150 },
                { dataField: "isActive", caption: translate(language, 'isActive'), width: 200 }
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
                }, {
                    title: translate(languageAdventure, 'adventure'),
                    template: createAdventureTabTemplate(masterDetailOptions.data, 1),
                }, {
                    title: translate(language, 'time'),
                    template: createTimeTabTemplate(masterDetailOptions.data, 1),
                }, {
                    title: translate(language, 'usedPromoCodes'),
                    template: createPromoCodeTabTemplate(masterDetailOptions.data, 1),
                }],
            });
        }

        function createAdventureTabTemplate(masterDetailData) {
            return function () {
                return $('<div>').dxDataGrid({
                    dataSource: new DevExpress.data.CustomStore({
                        key: ["itemHandle", "heroName"],
                        loadMode: "raw",
                        load: async function () {
                            return await get(`/adventure/default/hero/${masterDetailData.name}`, language);
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
                        { dataField: "item.handle", caption: translate(languageItem, 'handle'), allowEditing: false, width: 100  },
                        { dataField: "item.value", caption: translate(languageItem, 'value') },
                        { dataField: "item.gold", caption: translate(languageItem, 'gold'), width: 200 }
                    ]
                });
            };
        }

        function createItemTabTemplate(masterDetailData) {
            return function () {
                return $('<div>').dxDataGrid({
                    dataSource: new DevExpress.data.CustomStore({
                        key: ["itemHandle", "heroName"],
                        loadMode: "raw",
                        load: async function () {
                            return await get(`/heroinventory/default/hero/${masterDetailData.name}`, language);
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
                        { dataField: "item.handle", caption: translate(languageItem, 'handle'), allowEditing: false, width: 100  },
                        { dataField: "item.value", caption: translate(languageItem, 'value') },
                        {
                            dataField: 'item.categoryHandle',
                            caption: translate(languageItemCategory , 'value'), width: 200,
                            lookup: {
                              dataSource(options) {
                                return {
                                  store: {  
                                      type: 'array',  
                                      data: category,  
                                      key: "handle"  
                                    }
                                };
                              },
                              valueExpr: 'handle',
                              displayExpr: function(item) {
                                return item && item.value;
                              }
                            },
                        },
                        { dataField: "item.gold", caption: translate(languageItem, 'gold'), width: 100 },
                        { dataField: "quantity", caption: translate(language, 'quantity'), width: 100 },
                        {
                            caption: translate(language, 'total'), width: 250,
                            calculateCellValue(data) {
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
                            return [await get(`/herowallet/default/hero/${masterDetailData.name}`, language)];
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
                        { dataField: "gold", caption: translate(languageWallet, 'gold')},
                        { dataField: "diamond", caption: translate(languageWallet, 'diamond')},
                        { dataField: "blood", caption: translate(languageWallet, 'blood') },
                        { dataField: 'lastBlood', caption: translate(languageWallet, 'lastBlood'), dataType: 'datetime', width: 150 }
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
                            return [await get(`/herotrait/default/hero/${masterDetailData.name}`, language)];
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
                        { dataField: "goldMultipler", caption: translate(languageTrait, 'goldMultipler'), 
                            calculateCellValue(data) {
                                return `${data.goldMultipler} / ${validation.find(x => x.handle == 'goldMultipler').max}`
                        }},
                        { dataField: "stealMultipler", caption: translate(languageTrait, 'stealMultipler'), 
                            calculateCellValue(data) {
                                return `${data.stealMultipler} / ${validation.find(x => x.handle == 'stealMultipler').max}`
                        }},
                        { dataField: "defenceMultipler", caption: translate(languageTrait, 'defenceMultipler'), 
                            calculateCellValue(data) {
                                return `${data.defenceMultipler} / ${validation.find(x => x.handle == 'defenceMultipler').max}`
                        }},
                        { dataField: "workMultipler", caption: translate(languageTrait, 'workMultipler'), 
                            calculateCellValue(data) {
                                return `${data.workMultipler} / ${validation.find(x => x.handle == 'workMultipler').max}`
                        }},
                        { dataField: "hitpointMultipler", caption: translate(languageTrait, 'hitpointMultipler'), 
                            calculateCellValue(data) {
                                return `${data.hitpointMultipler} / ${validation.find(x => x.handle == 'hitpointMultipler').max}`
                        }},
                        { dataField: "strengthMultipler", caption: translate(languageTrait, 'strengthMultipler'), 
                            calculateCellValue(data) {
                                return `${data.strengthMultipler} / ${validation.find(x => x.handle == 'strengthMultipler').max}`
                        }}
                    ]
                });
            };
        }

        function createTimeTabTemplate(masterDetailData) {
            return function () {
                return $("<div>").dxDataGrid({
                    dataSource: [masterDetailData],
                    allowColumnReordering: true,
                    allowColumnResizing: true,
                    columns: [
                        { dataField: 'lastSteal', caption: translate(language, 'lastSteal'), dataType: 'datetime'},
                        { dataField: 'lastJoin', caption: translate(language, 'lastJoin'), dataType: 'datetime' },
                        { dataField: 'lastDuell', caption: translate(language, 'lastDuell'), dataType: 'datetime' },
                        { dataField: 'lastDaily', caption: translate(language, 'lastDaily'), dataType: 'date' },
                    ]
                });
            };
        }

        function createPromoCodeTabTemplate(masterDetailData) {
            return function () {
                return $('<div>').dxDataGrid({
                    dataSource: new DevExpress.data.CustomStore({
                        key: ["hero.mame", "promotion.handle"],
                        loadMode: "raw",
                        load: async function () {
                            return await get(`/heropromotion/default/hero/${masterDetailData.name}`, language);
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
                        { dataField: "promotion.handle", caption: translate(languagePromotion, 'title')},
                        { dataField: "promotion.gold", caption: translate(languageWallet, 'gold')},
                        { dataField: "promotion.diamond", caption: translate(languageWallet, 'diamond') },
                        { dataField: 'promotion.experience', caption: translate(language, 'experience') },
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
