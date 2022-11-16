import { Column, Table, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'placeholderItem.json')).toString());
@Table({ tableName: "placeholder", modelName: "placeholder"})
export class PlaceholderItem {
    @PrimaryKey
    @Column
    handle: string;
    @Column
    translation: string;
    @Column
    isCounter : boolean = false;
    @Column
    isShoutout : boolean = false;
    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('placeholder', {
            handle: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            translation: {
                type: DataTypes.STRING,
                allowNull: false
            },
            isCounter: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isShoutout: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as PlaceholderItem[];

            for(const item of items){
                if(await sequelize.models.placeholder.count({where: {handle: item.handle}}) === 0){
                    await sequelize.models.placeholder.create(item as any);
                } else await sequelize.models.placeholder.update(item, {where: {handle: item.handle}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}