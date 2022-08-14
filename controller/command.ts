export class  Command {
    name: string;
    message: string;
    target: string;
    source: string;
    parameters: string[];

    constructor(message: string, context : any){
        this.name = "";
        this.message =  message;
        this.target = "";
        this.source =  context.username;
        this.parameters = [];

        const parts = message.match(/(?:[^\s:"]+|"[^"]*")+/g)

        for(const part in parts){
            if(parts[part].trim().startsWith("!"))
                this.name = parts[part].trim().toLowerCase().replaceAll('!','');
            else if(parts[part].startsWith("@"))
                this.target = parts[part].trim().toLowerCase();
            else this.parameters.push(parts[part].replaceAll('"', '').trim());
        }
    }
}