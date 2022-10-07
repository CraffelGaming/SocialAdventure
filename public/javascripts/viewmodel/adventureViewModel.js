import { getTranslations, translate, infoPanel, tableExport, get } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let languageStorage = await getTranslations(['adventure', 'item', 'trait', 'itemCategory', 'location']);
    let language = languageStorage.filter(x => x.page == 'adventure');
    let languageItem = languageStorage.filter(x => x.page == 'item');
    let languageTrait = languageStorage.filter(x => x.page == 'trait');
    let languageItemCategory = languageStorage.filter(x => x.page == 'itemCategory');
    let languageLocation = languageStorage.filter(x => x.page == 'location');

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
                        return [await get(`/herotrait/default/hero/${masterDetailData.hero.name}`, language)];
                    }
                }),
                columns: [
                    { dataField: "goldMultipler", caption: translate(languageTrait, 'goldMultipler') },
                    { dataField: "stealMultipler", caption: translate(languageTrait, 'stealMultipler') },
                    { dataField: "defenceMultipler", caption: translate(languageTrait, 'defenceMultipler') },
                    { dataField: "workMultipler", caption: translate(languageTrait, 'workMultipler') },
                    { dataField: "hitpointMultipler", caption: translate(languageTrait, 'hitpointMultipler') },
                    { dataField: "strengthMultipler", caption: translate(languageTrait, 'strengthMultipler') }
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
