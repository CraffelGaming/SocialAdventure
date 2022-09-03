import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./nodeItem.json');
@Table({ tableName: "node", modelName: "node"})
export class NodeItem extends Model<NodeItem>{
    @PrimaryKey
    @Column
    name: string;
    @Column
    displayName: string;
    @Column
    language: string = "DE-de"
    @Column
    isActive: boolean = true;
    @Column
    endpoint : string = '/';
    @Column
    type: string;
    @Column
    broadcasterType: string;
    @Column
    description: string;
    @Column
    profileImageUrl: string;
    @Column
    eMail: string;

    constructor(name? : string, displayName? : string, language? : string, isActive? : boolean){
        super();
        this.name = name;
        this.displayName = displayName;
        this.language = language;
        this.isActive = isActive;
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('node', {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            displayName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            language: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "de-DE",
            },
            isActive: {
               type: DataTypes.BOOLEAN,
               allowNull: false,
               defaultValue: true,
            },
            endpoint: {
               type: DataTypes.STRING,
               allowNull: false,
               defaultValue: '/'
            },
            type: {
               type: DataTypes.STRING,
               allowNull: true
            },
            broadcasterType: {
               type: DataTypes.STRING,
               allowNull: true
            },
            description: {
               type: DataTypes.STRING,
               allowNull: true
            },
            profileImageUrl: {
               type: DataTypes.STRING,
               allowNull: true
            },
            eMail: {
               type: DataTypes.STRING,
               allowNull: true
            }
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as NodeItem[];

            for(const item of items){
                if(await sequelize.models.node.count({where: {name: item.name}}) === 0){
                    await sequelize.models.node.create(item as any);
                } else await sequelize.models.node.update(item, {where: {name: item.name}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}

module.exports.default = NodeItem;