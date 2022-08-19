//#region Translation
async function getTranslation(page, language = 'de-DE') {
    page = page.replace('/', '').replace('\\', '');
    return await fetch('./api/translation/' + page + "?language=" + language, {
        method: 'get',
        headers: {
            'Content-type': 'application/json'
        }
    }).then(function (res) {
        if (res.status == 200) {
            return res.json();
        }
    }).then(function (json) {
        return json;
    });
}

function translate(language, handle) {
    if (language && handle) {
        var value = language.find(x => x.handle == handle)

        if (value && value.translation)
            return value.translation;
    }
    return '[missing translation]'; 
}
//#endregion

//#region InfoPanel  
async function infoPanel() {
    let languageInfo = await getTranslation('information');
    let userData = await loadUserData();
    let defaultNode = await loadDefaultNode();
    
    $("#info-panel").dxButtonGroup({
        width:"100%",
        items: [{ 
            text: (userData != null) ? translate(languageInfo, 'login').replace('$1', userData.display_name) : translate(languageInfo, 'noLogin'),
            disabled: true, 
            stylingMode: "text" 
        }, {
            text: (defaultNode != null) ? translate(languageInfo, 'streamer').replace('$1', defaultNode.node) : translate(languageInfo, 'noStreamer'),
            disabled: true, 
            stylingMode: "text"
        }],
    });
}
//#endregion

//#region Load
async function loadUserData() {
    let item;
    await fetch('./api/twitch/userdata', {
        method: 'get',
        headers: {
            'Content-type': 'application/json'
        }
    }).then(async function (res) {
        switch(res.status) {
            case 200:
                return res.json();
            case 404:
                break;
        }
    }).then(async function (json) {
        item = json;
    });
    return item;
}

async function loadDefaultNode() {
    let item;
    await fetch('./api/node/default', {
        method: 'get',
        headers: {
            'Content-type': 'application/json'
        }
    }).then(async function (res) {
        switch(res.status) {
            case 200:
                return res.json();
            case 404:
                break;
        }
    }).then(async function (json) {
        item = json;
    });
    return item;
}
//#endregion
export { getTranslation, translate, loadUserData, loadDefaultNode, infoPanel };
