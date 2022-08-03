export class  Command {
    name: string;
    message: string;
    target: string;
    parameters: string[];

    constructor(message: string){
        this.name = "";
        this.message =  message;
        this.target = "";
        this.parameters = [];

        const parts = message.match(/(?:[^\s:"]+|"[^"]*")+/g)

        global.worker.log.trace(parts);

        for(const part in parts){
            if(parts[part].trim().startsWith("!"))
                this.name = parts[part].trim().toLowerCase();
            else if(parts[part].startsWith("@"))
                this.target = parts[part].trim().toLowerCase();
            else this.parameters.push(parts[part].replaceAll('"', '').trim());
        }
    }
}