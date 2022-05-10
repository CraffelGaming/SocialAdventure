import { Column, Table, Model, Sequelize } from 'sequelize-typescript';
import json from './versionItem.json';

@Table
export class VersionItem extends Model {
    @Column
    version: string;

    constructor(){
        super();
        this.version = "1.0.0";
    }

    static async updateTable(sequelize: Sequelize){
        const items: VersionItem[] = JSON.parse(JSON.stringify(json));
        for(const item of items)
            if(await sequelize.models.version.count({ where: { version: item.version } }) === 0)
                await item.save();// sequelize.models.version.create(item);
            else await sequelize.models.version.update({ version: item.version }, { where: { version: item.version }})
    }
}