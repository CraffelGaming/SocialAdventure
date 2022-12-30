import { getTranslations, translate, get } from './globalData.js';
import { getCookie, setCookie } from './cookieViewModel.js';

$(async () => {
    let module = 'navigation';
    let languageStorage = await getTranslations([module, 'cookie']);
    let language = languageStorage.filter(x => x.page == module);
    let languageCookie = languageStorage.filter(x => x.page == 'cookie');

    let menus = await get(`/menu`, language);
    let twitch = await get(`/twitch`, language);
    let node = await get(`/node/default`, language);
    
    initialize();

    cookie();

    //#region Cookie
    function cookie() {
        if (!getCookie('allowCookies')) {
            $('#cookie').dxPopup({
                showTitle: true,
                title: "Lust auf Cookies?",
                resizeEnabled: false,
                width: 600,
                height: 400,
                visible: true
            });
    
            //$('#cookieText').html(translate(languageCookie, "Text"));
            $('#cookieText').dxTextArea({
                value: translate(languageCookie, "Text"),
                height: 250,
                stylingMode:"outlined",
                readOnly: true
            });
    
            $('#cookieAllow').dxButton({
                text: translate(languageCookie, "Allow"),
                onClick: function() {
                    setCookie('allowCookies', '1', 365);
                    $('#cookie').dxPopup('instance').hide();
                } 
            });
        } 

    }

    //#endregion

    //#region Initialize
    function initialize() {
        var items = [];

        items.push({
            icon: node?.twitchUser?.profileImageUrl != null ? node.twitchUser.profileImageUrl : '/images/favicon.png',
            href: '/',
            text: translate(language, "title")
        });

        var menu = menus.filter(x => !x.parent).sort(function (a, b) {
            return a.order - b.order;
        });

        for (let i = 0; i < menu.length; i++) {
            SetMenu(menu[i], items);
        }

        $("#menu").dxMenu({
            adaptivityEnabled: true,
            items: items,
            onItemClick: function (e) {
                if (e.itemData.href) {
                    window.location.href = e.itemData.href;
                }
            }
        }).dxMenu('instance');
    }

    function SetMenu(item, parent) {
        
        var subs = menus.filter(x => x.parent && x.parent.endpoint == item.endpoint).sort(function (a, b) {
            return a.order - b.order;
        });

        if (subs.length == 0) {
            parent.push({
                text: translate(language, item.name),
                href: item.name != 'login' ? item.endpoint : twitch.url
            });
        } else {
            var elements = [];

            for (let i = 0; i < subs.length; i++) {
                SetMenu(subs[i], elements);
            }

            parent.push({
                text: translate(language, item.name),
                items: elements 
            });
        }
    }
    //#endregion
});