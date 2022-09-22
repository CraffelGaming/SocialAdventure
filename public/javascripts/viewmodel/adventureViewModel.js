import { getTranslation, translate, infoPanel, tableExport, getEditing, get } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let language = await getTranslation('adventure');
    let languageItem = await getTranslation('item');
    let languageTrait = await getTranslation('trait');
    let languageItemCategory = await getTranslation('itemCategory');
    let languageLocation = await getTranslation('location');

    let dungeons = await get('/location/default/active', language);
    let category = await get('/itemcategory/default/', language);

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
        $('#multiview-container').dxMultiView({
            height: 250,
            dataSource: dungeons,
            selectedIndex: 0,
            loop: true,
            animationEnabled: true,
            itemTemplate: function(itemData, itemIndex, itemElement) {
                var container = $("<div style='margin:25px;'>");
                container.append("<h4>" + itemData.name + "</h4>");
                var info = $("<div style='text-align:left;'>");

                info.append(itemData.description + "</b></p>");
                info.append("<p>" + translate(languageLocation, 'difficulty') + ": <b>" + itemData.difficulty + "</b></p>");
                info.append("<p>" + translate(languageItemCategory, 'value') + ": <b>"+ category.find(x => x.handle == itemData.categoryHandle).value + "</b></p>");

                container.append(info);
                itemElement.append(container);
            },
            onSelectionChanged(e) {
                $('#informationDungeon').text(translate(language, 'informationDungeon').replace('$1',  e.component.option('selectedIndex') + 1).replace('$2',  dungeons.length));
            },
        });

        $('#informationDungeon').text(translate(language, 'informationDungeon').replace('$1',  1).replace('$2',  dungeons.length));

        $("#dataGrid").dxDataGrid({
            dataSource: new DevExpress.data.CustomStore({
                key: ["itemHandle", "heroName"],
                loadMode: "raw",
                load: async function (loadOptions) {
                    return await get('/adventure/default', language);
                },
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
                { dataField: "item.value", caption: translate(language, 'item'), validationRules: [{ type: "required" }]},
                {
                    dataField: 'item.categoryHandle',
                    caption: translate(languageItemCategory , 'value'), width: 300,
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
                { dataField: "item.gold", caption: translate(languageItem, 'gold'), validationRules: [{ type: "required" }], width: 300 },
                { dataField: "hero.name", caption: translate(language, 'owner'), validationRules: [{ type: "required" }]}
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

    function masterDetailTemplate(_, masterDetailOptions) {
        return $('<div>').dxTabPanel({
            items: [{
                title: translate(language, 'trait'),
                template: createTraitTabTemplate(masterDetailOptions.data, 1),
            }],
        });
    }

    function createTraitTabTemplate(masterDetailData) {
        return function () {
            return $('<div>').dxDataGrid({
                dataSource: new DevExpress.data.CustomStore({
                    key: ["heroName"],
                    loadMode: "raw",
                    load: async function () {
                        return await get(`/herotrait/default/hero/${masterDetailData.hero.name}`, language);
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
    //#endregion

    
    //#region Translation
    function translation() {
        document.getElementById("labelTitle").textContent = translate(language, 'title');
        document.getElementById("informationDungeon").textContent = translate(language, 'informationDungeon');
    }
    //#endregion
});
