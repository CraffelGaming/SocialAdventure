import { getTranslation, translate, infoPanel, get, loadUserData } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;

    let language = await getTranslation('taverne');
    let languageHealing = await getTranslation('healing');
    let languageTrainer = await getTranslation('trainer');
    let languageWallet = await getTranslation('wallet');
    let languageHero = await getTranslation('hero');

    let userdata = {};
    let hero = {};
    let heroWallet = {};

    
    await initialize();
    translation();
    loadHealing();
    loadTrainer();
    infoPanel();

    //#region Initialize
    async function initialize() {
        userdata = await loadUserData();
        hero = await get('/hero/default/' + userdata.login);
        heroWallet = await get('/heroWallet/default/hero/' + userdata.login);
        
        $('#responsive-box').dxResponsiveBox({
            rows: [
                { ratio: 1 },
                { ratio: 1 },
                { ratio: 1 },
            ],
            cols: [
                { ratio: 1 },
                { ratio: 1, screen: 'lg' },
                { ratio: 1 },
            ],
            singleColumnScreen: 'sm',
            screenByWidth(width) {
                return (width < 1080) ? 'sm' : 'lg';
            },
        });
    }
    //#endregion

    //#region Load
    function loadHealing() {
        $('#heroWallet').dxDataGrid({
            dataSource: new DevExpress.data.CustomStore({
                key: ["heroName"],
                loadMode: "raw",
                load: async function () {
                    return [await get(`/herowallet/default/hero/${hero.name}`, language)];
                }
            }),
            columns: [
                { caption: translate(languageHero, 'hitpoints'), 
                    cellTemplate: function (container, options) {  
                        $("<div />").attr({ 'class': 'cls', 'data-key': hero.name }).dxProgressBar({  
                            min: 0,  
                            max: hero.hitpointsMax,
                            value: hero.hitpoints,
                            statusFormat: function(){
                                return hero.hitpoints + '/' + hero.hitpointsMax
                            }  
                        }).appendTo(container);  
                    }
                },
                { dataField: "gold", caption: translate(languageWallet, 'gold'), width: 200 },
                { dataField: "diamond", caption: translate(languageWallet, 'diamond'), width: 200 }
            ]
        });

        $("#healingDataGrid").dxDataGrid({
            dataSource: new DevExpress.data.CustomStore({
                key: "handle",
                loadMode: "raw",
                load: async function (loadOptions) {
                    return await get(`/healingPotion/default`, language);
                }
            }),
           
            columns: [
                {
                    dataField: 'Picture',
                    caption: "",
                    width: 100,
                    allowFiltering: false,
                    allowSorting: false,
                    cellTemplate(container, options) {
                    $('<div>')
                        .append($('<img>', { src: options.data.image != null ?options.data.image : options.row.data.image, width: 64, height: 64 }))
                        .appendTo(container);
                    },
                },
                { dataField: "value", caption: translate(languageHealing, 'value'), width: 250 },
                { dataField: "description", caption: translate(languageHealing, 'description'),
                    cellTemplate: function(element, info) {
                    $("<div>")
                        .appendTo(element)
                        .text(info.value)
                        .css("width", info.column.width - 20)
                        .css("height", 100)
                        .css("white-space", "normal")
                        .css("overflow-wrap", 'break-word'); 
                }},
                { dataField: "isRevive", caption: translate(languageHealing, 'isRevive'), width: 200, editorType: "dxCheckBox", width: 120 },
                { dataField: "percent", caption: translate(languageHealing, 'percent'), width: 150 },
                { dataField: "gold", caption: translate(languageHealing, 'gold'), width: 150 },
                {
                    type: "buttons",
                    buttons: [{
                        icon: "check",
                        hint: translate(language, "checkHint"),
                        onClick: function (e) {
                            
                        }
                    }]
                }
            ]
        });
    }

    function loadTrainer() {
        $("#trainerDataGrid").dxDataGrid({
            dataSource: new DevExpress.data.CustomStore({
                key: "handle",
                loadMode: "raw",
                load: async function (loadOptions) {
                    return await get(`/trainer/default`, language);
                }
            }),
            columns: [
                {
                    dataField: 'Picture',
                    caption: "",
                    width: 100,
                    allowFiltering: false,
                    allowSorting: false,
                    cellTemplate(container, options) {
                    $('<div>')
                        .append($('<img>', { src: options.data.image != null ?options.data.image : options.row.data.image, width: 64, height: 64 }))
                        .appendTo(container);
                    },
                },
                { dataField: "value", caption: translate(languageTrainer, 'value')},
                { dataField: "description", caption: translate(languageTrainer, 'description')},
                { dataField: "gold", caption: translate(languageTrainer, 'gold'), width: 150 },
                {
                    type: "buttons",
                    buttons: [{
                        icon: "check",
                        hint: translate(language, "checkHint"),
                        onClick: function (e) {
                            
                        }
                    }]
                }
            ]
        });
    }
    //#endregion

    //#region Translation
    function translation() {
        document.getElementById("labelTitle").textContent = translate(language, 'title');
        document.getElementById("description").textContent = translate(language, 'description').replace('$1', hero.name);
    }
    //#endregion
});
