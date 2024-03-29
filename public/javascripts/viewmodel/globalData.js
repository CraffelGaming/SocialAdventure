//#region Translation
export async function getTranslation(page, language = 'de-DE') {
    return await get(`/translation/${page.replace('/', '').replace('\\', '')}?language=${language}`);
}

export async function getTranslations(pages, language = 'de-DE') {
    return await put(`/translation?language=${language}`, { 'pages': pages }, 'post');
}

export function translate(language, handle) {
    if (language && handle) {
        var value = language.find(x => x.handle == handle)

        if (value && value.translation)
            return value.translation;
    }
    return '';
}
//#endregion

//#region InfoPanel  
export async function infoPanel() {
    let languageInfo = await getTranslation('information');
    let userData = await loadUserData();
    let defaultNode = await loadDefaultNode();

    $("#info-panel").dxButtonGroup({
        width: "100%",
        items: [{
            text: (userData != null) ? translate(languageInfo, 'login').replace('$1', userData.display_name) : translate(languageInfo, 'noLogin'),
            disabled: true,
            stylingMode: "text",
            elementAttr: {
                id: 'loginInfo'
            }
        }, {
            text: (defaultNode != null) ? translate(languageInfo, 'streamer').replace('$1', defaultNode.displayName) : translate(languageInfo, 'noStreamer'),
            disabled: true,
            stylingMode: "text",
            elementAttr: {
                id: 'selectedInfo'
            }
        }],
    });
}
//#endregion

//#region Load
export async function loadUserData() {
    return await get(`/twitch/userdata`);
}

export async function loadDefaultNode() {
    return await get(`/node/default`);
}

export async function loadNode(name) {
    return await get(`/node/information/${name}`);;
}
//#endregion

//#region Export
export function tableExport(e, name) {
    if (e.format === 'xlsx') {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Main sheet");
        DevExpress.excelExporter.exportDataGrid({
            worksheet: worksheet,
            component: e.component,
        }).then(function () {
            workbook.xlsx.writeBuffer().then(function (buffer) {
                saveAs(new Blob([buffer], { type: "application/octet-stream" }), name + ".xlsx");
            });
        });
        e.cancel = true;
    }
    else if (e.format === 'pdf') {
        const doc = new jsPDF();
        DevExpress.pdfExporter.exportDataGrid({
            jsPDFDocument: doc,
            component: e.component,
        }).then(() => {
            doc.save(name + '.pdf');
        });
    }
}
//#endregion

//#region Notify
export function notify(message, type) {
    //type: error, info, success, warning;
    DevExpress.ui.notify(
        {
            message: message,
            width: 350,
            position: {
                my: "top",
                at: "center",
                of: "#notification"
            },
            closeOnClick: true,
            hideOnParentScroll: true
        },
        type,
        600
    );
}
//#endregion

//#region Editing
export async function getEditing(allowUpdating = true, allowAdding = true, allowDeleting = true, mode = "popup") {
    let master = await isMaster();

    if (master) {
        return {
            mode: mode,
            allowUpdating: master && allowUpdating,
            allowDeleting: master && allowDeleting,
            allowAdding: master && allowAdding,
        }
    } else {
        return {
            mode: mode,
            allowUpdating: false,
            allowDeleting: false,
            allowAdding: false
        }
    }
}

export async function getEditingHero(heroName, allowUpdating = true, allowAdding = true, allowDeleting = true, mode = "popup") {
    let hero = isHero(heroName);
    if (hero) {
        return {
            mode: mode,
            allowUpdating: hero && allowUpdating,
            allowDeleting: hero && allowDeleting,
            allowAdding: hero && allowAdding,
        }
    } else {
        return {
            mode: mode,
            allowUpdating: false,
            allowDeleting: false,
            allowAdding: false
        }
    }
}
//#endregion

//#region Authorisation
export async function isMaster() {
    let userData = await loadUserData();
    let defaultNode = await loadDefaultNode();

    if (userData != null && defaultNode?.name != null) {
        return userData.login === defaultNode.name;
    }
    return false;
}

export async function isStreamer() {
    let userData = await loadUserData();
    let node = await loadNode(userData.login);

    if (node?.name?.length > 0) {
        return true;
    }
    return false;
}

export async function isHero(heroName) {
    let userData = await loadUserData();

    if (userData != null && heroName != null) {
        return userData.login === heroName;
    }
    return false;
}
//#endregion

//#region Get
export async function getList(endpoint, language = undefined) {
    let item = await get(endpoint, language);

    if (!item) {
        return [];
    } else if (Array.isArray(item)) {
        return item;
    } else {
        return [item];
    }
}

export async function get(endpoint, language = undefined) {
    let items;

    if (endpoint) {
        await fetch('./api' + endpoint, {
            method: 'get',
            headers: {
                'Content-type': 'application/json'
            }
        }).then(async function (res) {
            switch (res.status) {
                case 200:
                case 201:
                    items = await res.json();
                    break;
                default:
                    if (language != undefined)
                        notify(translate(language, res.status), 'error');
                    break;
            }
            return items;
        });
    }

    return items;
}
//#endregion

//#region Put
export async function put(endpoint, body, type = 'put', language = undefined) {
    let items;

    if (endpoint) {
        await fetch('./api' + endpoint, {
            method: type,
            headers: {
                'Content-type': 'application/json'
            }, body: JSON.stringify(body)
        }).then(async function (res) {
            switch (res.status) {
                case 200:
                case 201:
                    if (language != undefined)
                        notify(translate(language, res.status), "success");
                    items = await res.json();
                    break;
                case 204:
                    if (language != undefined)
                        notify(translate(language, res.status), "success");
                    break;
                default:
                    if (language != undefined)
                        notify(translate(language, res.status), 'error');
                    break;
            }
            return items;
        });
    }

    return items;
}
//#endregion

//#region Delete
export async function remove(endpoint, language = undefined) {
    let result = false;

    if (endpoint) {
        await fetch('./api' + endpoint, {
            method: 'delete',
            headers: {
                'Content-type': 'application/json'
            }
        }).then(async function (res) {
            //console.log(res);
            switch (res.status) {
                case 204:
                    if (language != undefined)
                        notify(translate(language, res.status), "success");
                    result = true;
                    break;
                case 201:
                    if (language != undefined)
                        notify(translate(language, res.status), "success");
                    break;
                default:
                    if (language != undefined)
                        notify(translate(language, res.status), 'error');
                    break;
            }
            return result;
        });
    }

    return result;
}
//#endregion

//#region Clipboard
export function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
}
//#endregion