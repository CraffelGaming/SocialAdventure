export class Command {
    //#region Construct
    constructor(message, context) {
        this.name = "";
        this.message = message;
        this.target = "";
        this.source = context.username.toLowerCase();
        this.parameters = [];
        const parts = message.match(/(?:[^\s:"]+|"[^"]*")+/g);
        try {
            for (const part in parts) {
                if (parts[part].trim().startsWith("!"))
                    this.name = parts[part].trim().toLowerCase().replaceAll('!', '');
                else if (parts[part].startsWith("@"))
                    this.target = parts[part].trim().toLowerCase().replace('@', '');
                else
                    this.parameters.push(parts[part].replaceAll('"', '').trim());
            }
        }
        catch (ex) {
            global.worker.log.error(`command error - function constructor - ${ex.message}`);
        }
    }
}
//# sourceMappingURL=command.js.map