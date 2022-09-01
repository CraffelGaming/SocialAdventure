
import { Sequelize, Model, PrimaryKey, Column, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./commandItem.json');

@Table({ tableName: "command", modelName: "command"})
export class CommandItem extends Model<CommandItem>{
    @PrimaryKey
    @Column
    module: string = "";

    @Column
    command: string= "";

    @Column
    isMaster: boolean = false;

    @Column
    translation: string= "";

    constructor(){
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
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