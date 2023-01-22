# Social Adventure bloodpoints

Social Adventure ist eine kostenlose Twitch-Bot Alternative zu Streamlabs, Nightbot, Moobot und co. Neben den Standard Features wie automatische und manuelle Nachrichten, Death-Counter und Shoutouts bietet Social Adventure ein komplettes Browser und Chat basiertes Spiel, bei dem du deinen Helden verbessern und deine Unterstützung zum Streamer zeigen kannst. Social Adventure wurde von Craffel entwickelt und wird immer wieder mit neuen Features ausgestattet.
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
- [ ]  Item Verwendungen
- [ ]  Validation Engine A < > != B

### Release 1.5.0 
- [ ]  Englisch
- [ ]  Keyschleuder
- [ ]  Dungeons / Enemy / Item / Category export / import
- [ ]  Housing
- [ ]  Live Push Notification
- [ ]  Handbuch
- [ ]  UI Design überarbeiten -> Profi suchen
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