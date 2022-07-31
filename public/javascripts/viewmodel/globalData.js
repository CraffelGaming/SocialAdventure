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
export { getTranslation, translate };
//#endregion