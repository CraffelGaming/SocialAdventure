import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
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
    isLive: boolean = false;
    @Column
    endpoint : string = '/';

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
            isLive: {
               type: DataTypes.BOOLEAN,
               allowNull: false,
               defaultValue: false,
            },
            endpoint: {
               type: DataTypes.STRING,
               allowNull: false,
               defaultValue: '/'
            }
          }, {freezeTableName: true});
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }){
      sequelize.models.node.belongsTo(sequelize.models.twitch, { as: 'twitch', foreignKey: 'name'});
      sequelize.models.node.belongsTo(sequelize.models.twitchUser, { as: 'twitchUser', foreignKey: 'name'});
    }
}

module.exports.default = NodeItem;