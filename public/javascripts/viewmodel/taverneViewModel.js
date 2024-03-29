import { getTranslations, translate, infoPanel, get, loadUserData, notify, getList } from './globalData.js';

$(async () => {
    window.jsPDF = window.jspdf.jsPDF;
    let userdata = await loadUserData();

    if (!userdata) {
        window.location = (await get('/twitch?redirect=taverne')).url;
    }

    let module = 'taverne';
    let languageStorage = await getTranslations([module, 'healing', 'trainer', 'wallet', 'trait', 'hero', 'daily']);
    let language = languageStorage.filter(x => x.page == module);
    let languageHealing = languageStorage.filter(x => x.page == 'healing');
    let languageTrainer = languageStorage.filter(x => x.page == 'trainer');
    let languageWallet = languageStorage.filter(x => x.page == 'wallet');
    let languageTrait = languageStorage.filter(x => x.page == 'trait');
    let languageHero = languageStorage.filter(x => x.page == 'hero');
    let languageDaily = languageStorage.filter(x => x.page == 'daily');

    let validation = await get(`/validation/hero`);
    let hero = {};
    let heroWallet = {};
    let heroTrait = {};
    let dailies = [];

    await initialize();
    await refreshHero();
    loadDaily();
    translation();
    await loadWallet();
    await loadTrait();
    loadHealing();
    loadTrainer();
    infoPanel();

    //#region Initialize
    async function initialize() {
        userdata = await loadUserData();
    }

    async function refreshHero() {
        if (userdata) {
            dailies = await get(`/daily/default/current/3/hero/${userdata.login}`, languageDaily);
            hero = await get(`/hero/default/${userdata.login}`);
            heroWallet = await get(`/heroWallet/default/hero/${userdata.login}`);
            heroTrait = await get(`/heroTrait/default/hero/${userdata.login}`);
        }
    }

    //#endregion

    //#region Daily
    async function loadDaily() {
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

        for (let i = 0; i < 3; i++) {
            if (dailies) {
                document.getElementById(`daily${i}Title`).textContent = dailies[i].value;
                document.getElementById(`daily${i}Information`).textContent = dailies[i].description;
                document.getElementById(`daily${i}gold`).textContent = translate(languageWallet, 'gold') + ': ' + dailies[i].gold;
                document.getElementById(`daily${i}xp`).textContent = translate(languageHero, 'experience') + ': ' + dailies[i].experience;
            }

            $(`#daily${i}`).dxButton({
                text: translate(languageDaily, 'work'),
                type: "success",
                disabled: new Date(hero?.lastDaily).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0),
                onClick: function (e) {
                    let handle = 0;
                    switch (e.element[0].id) {
                        case "daily0":
                            handle = 1;
                            break;
                        case "daily1":
                            handle = 2;
                            break;
                        case "daily2":
                            handle = 3;
                            break;
                    }

                    fetch(`./api/daily/default/redeem/${handle}/hero/${hero.name}/`, {
                        method: 'post',
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }).then(async function (res) {
                        switch (res.status) {
                            case 200:
                                for (let i = 0; i < 3; i++) {
                                    $(`#daily${i}`).dxButton('instance').option("disabled", true);
                                }
                                await refreshHero();
                                await loadWallet();
                                notify(translate(languageDaily, `${res.status}_redeem`), "success");
                                break;
                            default:
                                notify(translate(languageDaily, `${res.status}_redeem`), "error");
                                break;
                        }
                    });
                }
            });
        }
    }
    //#endregion

    //#region Load
    async function loadWallet() {
        $('#heroWallet').dxDataGrid({
            dataSource: new DevExpress.data.CustomStore({
                key: ["heroName"],
                loadMode: "raw",
                load: async function () {
                    return await getList(`/herowallet/default/hero/${hero?.name}`, language);
                }
            }),
            columns: [
                {
                    caption: translate(languageHero, 'hitpoints'),
                    cellTemplate: function (container, options) {
                        $("<div />").attr({ 'class': 'cls', 'data-key': hero?.name }).dxProgressBar({
                            min: 0,
                            max: hero.hitpointsMax,
                            value: hero.hitpoints,
                            statusFormat: function () {
                                return hero.hitpoints + '/' + hero.hitpointsMax
                            }
                        }).appendTo(container);
                    }
                },
                { dataField: "gold", caption: translate(languageWallet, 'gold'), width: 200 },
                { dataField: "diamond", caption: translate(languageWallet, 'diamond'), width: 200 }
            ]
        });
    }

    async function loadTrait() {

        $('#heroTrait').dxDataGrid({
            dataSource: new DevExpress.data.CustomStore({
                key: ["heroName"],
                loadMode: "raw",
                load: async function () {
                    return await getList(`/heroTrait/default/hero/${hero?.name}`, language);
                }
            }),
            columns: [
                {
                    dataField: "goldMultipler", caption: translate(languageTrait, 'goldMultipler'),
                    calculateCellValue(data) {
                        return `${data.goldMultipler} / ${validation.find(x => x.handle == 'goldMultipler').max}`
                    }
                },
                {
                    dataField: "stealMultipler", caption: translate(languageTrait, 'stealMultipler'),
                    calculateCellValue(data) {
                        return `${data.stealMultipler} / ${validation.find(x => x.handle == 'stealMultipler').max}`
                    }
                },
                {
                    dataField: "defenceMultipler", caption: translate(languageTrait, 'defenceMultipler'),
                    calculateCellValue(data) {
                        return `${data.defenceMultipler} / ${validation.find(x => x.handle == 'defenceMultipler').max}`
                    }
                },
                {
                    dataField: "workMultipler", caption: translate(languageTrait, 'workMultipler'),
                    calculateCellValue(data) {
                        return `${data.workMultipler} / ${validation.find(x => x.handle == 'workMultipler').max}`
                    }
                },
                {
                    dataField: "hitpointMultipler", caption: translate(languageTrait, 'hitpointMultipler'),
                    calculateCellValue(data) {
                        return `${data.hitpointMultipler} / ${validation.find(x => x.handle == 'hitpointMultipler').max}`
                    }
                },
                {
                    dataField: "strengthMultipler", caption: translate(languageTrait, 'strengthMultipler'),
                    calculateCellValue(data) {
                        return `${data.strengthMultipler} / ${validation.find(x => x.handle == 'strengthMultipler').max}`
                    }
                },
                {
                    dataField: "perceptionMultipler", caption: translate(languageTrait, 'perceptionMultipler'),
                    calculateCellValue(data) {
                        return `${data.perceptionMultipler} / ${validation.find(x => x.handle == 'perceptionMultipler').max}`
                    }
                },
                {
                    dataField: "gold", caption: translate(languageWallet, 'gold'), width: 200,
                    calculateCellValue(data) {
                        return heroWallet.gold;
                    }
                },
                {
                    dataField: "diamond", caption: translate(languageWallet, 'diamond'), width: 200,
                    calculateCellValue(data) {
                        return heroWallet.diamond;
                    }
                }
            ]
        });
    }

    function loadHealing() {
        $("#healingDataGrid").dxDataGrid({
            dataSource: new DevExpress.data.CustomStore({
                key: "handle",
                loadMode: "raw",
                load: async function (loadOptions) {
                    return await getList(`/healingPotion/default`, language);
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
                            .append($('<img>', { src: options.data.image != null ? options.data.image : options.row.data.image, width: 64, height: 64 }))
                            .appendTo(container);
                    },
                },
                { dataField: "value", caption: translate(languageHealing, 'value'), width: 250 },
                {
                    dataField: "description", caption: translate(languageHealing, 'description'),
                    cellTemplate: function (element, info) {
                        $("<div>")
                            .appendTo(element)
                            .text(info.value)
                            .css("width", info.column.width - 20)
                            .css("height", 100)
                            .css("white-space", "normal")
                            .css("overflow-wrap", 'break-word');
                    }
                },
                { dataField: "isRevive", caption: translate(languageHealing, 'isRevive'), width: 200, editorType: "dxCheckBox", width: 120 },
                { dataField: "percent", caption: translate(languageHealing, 'percent'), width: 150 },
                { dataField: "gold", caption: translate(languageHealing, 'gold'), width: 150 },
                {
                    type: "buttons",
                    buttons: [{
                        icon: "check",
                        hint: translate(language, "checkHint"),
                        onClick: function (e) {
                            fetch(`./api/healingPotion/default/heal/${e.row.key}/hero/${hero?.name}`, {
                                method: 'post',
                                headers: {
                                    'Content-type': 'application/json'
                                }
                            }).then(async function (res) {
                                switch (res.status) {
                                    case 200:
                                        await refreshHero();
                                        await loadWallet();
                                        await loadTrait();
                                        await loadHealing();
                                        notify(translate(languageHealing, res.status), "success");
                                        break;
                                    default:
                                        notify(translate(languageHealing, res.status), "error");
                                        break;
                                }
                            });
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
                    return await getList(`/trainer/default`, language);
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
                            .append($('<img>', { src: options.data.image != null ? options.data.image : options.row.data.image, width: 64, height: 64 }))
                            .appendTo(container);
                    },
                },
                { dataField: "value", caption: translate(languageTrainer, 'value') },
                { dataField: "description", caption: translate(languageTrainer, 'description') },
                {
                    dataField: "gold", caption: translate(languageTrainer, 'gold'), width: 150,
                    calculateCellValue(data) {
                        return data.gold * heroTrait[data.handle + "Multipler"];
                    }
                },
                {
                    type: "buttons",
                    buttons: [{
                        icon: "check",
                        hint: translate(language, "checkHint"),
                        onClick: function (e) {
                            fetch(`./api/trainer/default/training/${e.row.key}/hero/${hero?.name}`, {
                                method: 'post',
                                headers: {
                                    'Content-type': 'application/json'
                                }
                            }).then(async function (res) {
                                switch (res.status) {
                                    case 200:
                                        await refreshHero();
                                        await loadWallet();
                                        await loadTrait();
                                        await loadTrainer();
                                        notify(translate(languageTrainer, res.status), "success");
                                        break;
                                    default:
                                        notify(translate(languageTrainer, res.status), "error");
                                        break; v
                                }
                            });
                        }
                    }]
                }
            ]
        });
    }
    //#endregion

    //#region Translation
    function translation() {
        document.getElementById("description").textContent = translate(language, 'description').replace('$1', hero?.name);
        document.getElementById("lastDaily").textContent = translate(languageDaily, 'lastDaily').replace('$1', new Date(hero?.lastDaily).toLocaleDateString());
    }
    //#endregion
});
