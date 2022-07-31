import { getTranslation, translate } from './globalData.js';

$(async () => {
    let language = await getTranslation('navigation');
    let menus = await getMenu();

    initialize();

    //#region Initialize
    function initialize() {
        var items = [];

        items.push({
            icon: '/images/favicon.png',
            href: '/'
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
        var subs = menus.filter(x => x.parent && x.parent.url == item.url).sort(function (a, b) {
            return a.order - b.order;
        });
        if (subs.length == 0) {
            parent.push({
                text: translate(language, item.name),
                href: item.url
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

    //#region Menu
    async function getMenu() {
        return await fetch('./api/menu/', {
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
    //#endregion
});