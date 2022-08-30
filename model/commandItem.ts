
import { Sequelize } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./commandItem.json');

export class CommandItem{
    module: string;
    command: string;
    isMaster: boolean;
    translation: string;

    constructor(){
        this.module = "";
        this.command = "";
        this.isMaster = false;
        this.translation = "";
    }

    static initialize(sequelize){
        sequelize.define('command', {
            module: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            command: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            isMaster: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            translation: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as CommandItem[];

            for(const item of items){
                if(await sequelize.models.command.count({where: {module: item.module, command: item.command}}) === 0){
                    await sequelize.models.command.create(item as any);
                } else await sequelize.models.command.update(item, {where: {module: item.module, command: item.command}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}

module.exports.default = CommandItem;