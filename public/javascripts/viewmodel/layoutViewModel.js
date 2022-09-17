import { getTranslation, translate, get } from './globalData.js';

$(async () => {
    let language = await getTranslation('navigation');
    let menus = await get(`/menu`, language);
    let twitch = await get(`/twitch`, language);
    let node = await get(`/node/default`, language);
    
    initialize();

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