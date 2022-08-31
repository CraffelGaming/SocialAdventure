//#region Translation
export async function getTranslation(page, language = 'de-DE') {
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

export function translate(language, handle) {
    if (language && handle) {
        var value = language.find(x => x.handle == handle)

        if (value && value.translation)
            return value.translation;
    }
    return '[missing translation]'; 
}
//#endregion

//#region InfoPanel  
export async function infoPanel() {
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
export async function loadUserData() {
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

export async function loadDefaultNode() {
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
            width: 300,
            position: {
                my: "bottom",
                at: "center",
                of: "#sticky-footer"
            }
        },
        type,
        2000
    );
}
//#endregion

//#region Editing
export async function getEditing() {
    let userData = await loadUserData();
    let defaultNode = await loadDefaultNode();

    /*
    return {
        mode: "popup",
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true
    }
    */

    if(userData != null && defaultNode.node != null){
        return {
            mode: "popup",
            allowUpdating: userData.login === defaultNode.node,
            allowDeleting: userData.login === defaultNode.node,
            allowAdding: userData.login === defaultNode.node,
        }
    } else {
        return {
            mode: "popup",
            allowUpdating: false,
            allowDeleting: false,
            allowAdding: false
        }
    }

}
//#endregion

//#region Editing
export async function isMaster() {
    let userData = await loadUserData();
    let defaultNode = await loadDefaultNode();

    if(userData != null && defaultNode.node != null){
        return userData.login === defaultNode.node;
    }
    return false; //true

}
//#endregion