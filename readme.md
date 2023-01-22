# Social Adventure

Social Adventure ist eine kostenlose Twitch-Bot Alternative zu Streamlabs, Nightbot, Moobot und co. Neben den Standard Features wie automatische und manuelle Nachrichten, Death-Counter und Shoutouts bietet Social Adventure ein komplettes Browser und Chat basiertes Spiel, bei dem du deinen Helden verbessern und deine Unterstützung zum Streamer zeigen kannst. Social Adventure wurde von Craffel entwickelt und wird immer wieder mit neuen Features ausgestattet.

## Rechtliches und Lizenz
Der Social Adventure Bot darf für nicht kommerzielle Zwecke verwendet werden. 
Die Angabe des Autors "Craffel (Martin Rosbund)" ist gut ersichtlich im Code und auf jeder Verlinkung / Webseite einzufügen.
## Installation für Entwickler
### Benötigte Anwendungen
- Visual Studio Code:https://code.visualstudio.com/download 
- GIT: https://git-scm.com/downloads
- Node.js: https://nodejs.org/en/download/

### Benötigte Anwendungen
- git clone https://github.com/CraffelGaming/SocialAdventure

### Zusätzliche Dateien
Damit die Anwendung läuft, werden neben den GIT Repository folgende Daten benötigt:

- Twitch-Konfiguration: twitch.json
- SocialAdventure-Konfiguration: bot.json
- SSL-Zertifikat Key: craffel.de_private_key.key
- SSL-Zertifikat: craffel.de_ssl_certificate.cer

### Twitch-Konfiguration
Die Datei “twitch.json” muss im Projekt-Root hinzugefügt werden.

Aufbau der Datei

```
{
    "url_authorize" : "https://id.twitch.tv/oauth2/authorize",
    "url_token" : "https://id.twitch.tv/oauth2/token",
    "url_base" : "https://api.twitch.tv/helix",
    "client_id" : "[API-Zugriff eintragen]",
    "client_secret" : "[API-Zugriff eintragen]",
    "redirect_uri" : "https://localhost/twitch",
    "redirect_uri_echtsystem" : "https://craffel.de/twitch",
    "response_type" : "code",
    "scope" : "chat:read user:read:email",
    "state" : "craffel",
    "grant_type" : "authorization_code",
    "refresh_type" : "refresh_token"
}
```

### API-Zugriff

Erstelle einen neuen Account auf Twitch (https://www.twitch.tv) und erstelle auf folgender Seite eine neue Twitch-Anwendung: https://dev.twitch.tv/console/apps/create.

Trage nun die Client-ID und das Client-Secret in die Datei “twitch.json” ein. Ald URL reicht eine localhost URL. Wenn du kein SSL-Zertifikat hast, kannst du auch http:// anstelle https:// eintragen. http:// ist jedoch nicht für den produktiven Einsatz auf einen Cloud Server möglich.

### SocialAdventure Konfiguration
Die Datei “bot.json” muss im Projekt-Root hinzugefügt werden.
Aufbau der Datei

```
{
    "identity": 
    {
      "username": "[Twitch-Accountname]",
      "password": "oauth:[Twitch-Passwort]"
    },
    "connection": 
    {
      "reconnect": true
    },
    "channels": 
    []
}

```
### Twitch-Bot-Zugriff
Nutze deinen neu angelegten Account und registriere ihn als Bot. Das ist notwendig, damit eine hohe Anzahl von Chat-Nachrichten gesendet werden können und Twitch schreibt dies auch vor, es ist Pflicht. Bot-Accounts werden auch nicht mehr als Viewer während eines Streams berücksichtigt. Hier kannst du deinen Account als Bot registrieren: 
https://twitchapps.com/tmi/

Trage nun das Kennwort und das Passwort deines Accounts in die Datei “twitch.json” ein.

### SSL-Zertifikat
Die Dateien “craffel.de_private_key.key” und “craffel.de_ssl_certificate.cer” müssen im Ordner “ssl” eingefügt werden. Dieser Ordner befindet sich im  Projekt-Root. Zum Testen auf Localhost (127.0.0.1) ist kein Zertifikat notwendig.

## Erster Programmstart
Wenn der SocialAdventure das erste Mal startet, wird eine globale Datenbank im Ordner “database” erstellt. Nun kannst du über den Browser auf den SocialAdventure zugreifen. Der Standard-Port ist 80 bei http:// und 443 bei https://. Zum testen kannst du den Port aber auch jederzeit in der Datei “settings.json” ändern, falls die Ports bereits belegt sind. Die Datei befindet sich im Projekt-Root.

Wenn du nun auf die Seite http://localhost zugreifst, kannst du dich mit Twitch verbinden (Am besten auch mit deinen Bot-Account.

Nach einer erfolgreichen Verbindung, kannst du den Bot für den angemeldeten Account aktivieren, damit du den Chatbot in deinen Chat verwenden kannst: 

Nun wird eine Anwendungsdatenbank erstellt, die ebenfalls im Ordner “database” zu finden ist. Ebenso wird der angemeldete Account nun auf der Streamer-Seite angezeigt:

## http/https
Der Social Adventure Bot kann nur im Testbetrieb über http erreichbar sein. Im Echtbetrieb ist ein SSL-Zertifikat notwendig. 
Um ein SSL-Zertifikat zu installieren wird der Public-Key (.pem) und der Private-Key (.key) benötigt.
Diese können im Installationsverzeichnis unter dem Ordner "cert" mit den Namen "cert.pem" und "cert.key" abgelegt werden.
Sollte der Name anders lauten oder der Pfad einen anderen entsprechen müssen, kann dieser über die JSON-Konfigurationsdatei "settings.json" bearbeitet werden:

```
{
  [...]
  "key": "/cert/cert.key",
  "cert": "/cert/cert.pem",
  [...]
}
```

## Port
Der Social Adventure Bot verwendet 2 Ports, je nachdem ob sich diese im Entwicklungsmodus oder Betriebsmodus befindet.
- Entwicklungsmodus : Port 80
- Betriebsmodus: Port 443
## Node.js
Der Social Adventure Bot liefert keine eigene Node.js Binarys und muss folgende Version verwenden: 18.13.0 LTS

## Roadmap
### Release 1.0.0 
Release Date: 29.10.2022
- [x] Logo des Streamers in der Navigation
- [x] Prestige level für Helden
- [x] Eigene URL für jeden Streamer
- [x] Itemkategorien einbinden
- [x] Loot neue Logik implementieren.
- [x] Counter im Say Modul
- [x] Dice im Say Modul
- [x] Lurk im Say Modul
- [x] Placeholder im Say Modul
- [x] Twitch API Verbindung mit Chat
- [x] Startseite
- [x] SSL-Zertifikat einbinden (https://)
- [x] Datenübernahme vom alten Craffelmat
- [x] Validierung (Min / Max / etc.) in Datenbank speichern
- [x] Hilfe & Feedback Kontaktformular
- [x] Item Kategorien zusenden    
- [x] CopyToClipboard
- [x] Auto / Start / Stop
- [x] Validation-Engine
- [x] Performance
- [x] Refresh Button
- [x] Save Settings
- [x] Start / Stop automation 
- [x] Live Auto Control
- [x] Full qualified API Connection
- [x] Shoutout
- [x] Live Highlight auf Webseite
- [x] Datum Format bei Befehle (Say)

### Release 1.1.0 
Release Date: 31.12.2022
- [X]  !heal im Chat
- [X]  Random Seed in Daly pro Streamer unterschiedlich
- [X]  Item ID in Hero and heros Seite
- [X]  Item Kategorie wird bei hero heros seiten nicht angezeigt...
- [X]  Heal Description
- [X]  Shoutout no target message
- [X]  implement need !loot to use
- [X]  deathcounter + xyz
- [X]  Notify Streamer Change
- [X]  !find / steal / give auch mit Itemname
- [X]  Heal other
- [X]  Befehle anlegen, wenn mit ! dann ! entfernen
### Release 1.2.0 
Release Date: 05.01.2023
- [X]  !raid gegen große bosse
- [X]  !duell
- [X]  Impressum
- [X]  Cookies

### Release 1.3.0 
Release Date: 2023
- [X]  Logs Steal
- [X]  Logs Duell
- [X]  Logs Adventure
- [X]  Wahrnehmung als Trait
- [X]  Kanalinformationen erneuern
- [X]  Bot Deaktivieren
- [X]  Online / Offline Meldung
- [X]  !mission

### Release 1.4.0 
- [ ]  Logs Give
- [ ]  Logs Raid
- [ ]  Logs Blood 
- [ ]  API aufräumen
- [ ]  Datenspeicher für Say-Module
- [ ]  Diamanten
- [ ]  GitHub Readme.md überarbeiten
- [ ]  Validation Engine A < > != B
- [ ]  1000er Trennzeichen überall

### Release 1.5.0 
- [ ]  Englisch
- [ ]  Keyschleuder
- [ ]  Dungeons / Enemy / Item / Category export / import
- [ ]  Housing
- [ ]  Live Push Notification
- [ ]  Handbuch
- [ ]  UI Design überarbeiten -> Profi suchen
- [ ]  Item Verwendungen
## Error Collection
### Say
* E-10000 execute
* E-10001 plus
* E-10002 minus
* E-10003 start
* E-10004 stop
* E-10005 interval
* E-10006 delay
* E-10007 text
* E-10008 shout

### Loot
* E-20000 execute
* E-20001 loot
* E-20002 leave
* E-20003 steal
* E-20004 give
* E-20005 find
* E-20006 rank
* E-20007 lootclear
* E-20008 lootstart
* E-20009 lootstop
* E-20010 hitpoints
* E-20011 adventure
* E-20012 blood
* E-20013 bloodpoints
* E-20014 chest
* E-20015 inventory
* E-20016 level
* E-20017 gold
* E-20018 diamond
* E-20019 heal
* E-20020 heal hero
* E-20021 revive hero
* E-20022 duell

### Raid
* E-30000 raidStart
* E-30001 raidinfo
* E-30002 raid
* E-30003 raidStop


## Abhängigkeiten Productive
`body-parser@1.19.2`
`cookie-parser@1.4.6`
`devextreme@22.1.4`
`express@4.17.3`
`express-session@1.17.2`
`jquery@3.6.0`
`log4js@6.4.3`
`moment@2.29.4`
`morgan@1.10.0`
`popper.js@1.16.1`
`pug@3.0.2`
`reflect-metadata@0.1.13`
`request@2.88.2`
`rotating-file-stream@3.0.3`
`seedrandom@3.0.5`
`sequelize@6.19.0`
`sequelize-typescript@2.1.3`
`serve-favicon@2.5.0`
`sqlite3@5.0.8`
`swagger@0.0.1`
`swagger-jsdoc@6.1.0`
`swagger-ui-express@4.3.0`
`tmi.js@1.8.5`
`uniqid@5.4.0`

## Abhängigkeiten Development
`@types/bluebird@3.5.36`
`@types/cookie-parser@1.4.2`
`@types/express@4.17.13`
`@types/express-session@1.17.4`
`@types/morgan@1.9.3`
`@types/node@17.0.25`
`@types/seedrandom@3.0.2`
`@types/sequelize@4.28.14`
`@types/serve-favicon@2.5.3`
`@types/swagger-jsdoc@6.0.1`
`@types/swagger-ui-express@4.1.3`
`@types/tmi.js@1.8.2`
`@types/uniqid@5.3.2`
`@types/validator@13.7.2`
`tslint@6.1.3`
`typescript@4.6.2`