import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import json = require('./nodeItem.json');

@Table({
    tableName: 'node'
  })
export class NodeItem extends Model {

    @PrimaryKey
    @Column
    override id?: number;

    @Column
    name?: string;

    constructor({ id }: { id: number; }, { name }: { name: string; }){
        super();
        this.name = name;
        this.id= id;
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        const items = JSON.parse(JSON.stringify(json));
        for(const item of items){
            if(await sequelize.models.NodeItem.count({where: {id: item.id}}) === 0){
                await new NodeItem({id: item.id}, {name: item.name}).save();
            } else sequelize.models.NodeItem.update({name: item.name},{where: {id: item.id}});
        }
    }
}

module.exports.default = NodeItem;