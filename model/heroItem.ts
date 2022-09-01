
import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./heroItem.json');

@Table({ tableName: "hero", modelName: "hero"})
export class HeroItem extends Model<HeroItem> {
    @PrimaryKey
    @Column
    name: string;
    @Column
    lastSteal: Date = new Date(2020, 1, 1);
    @Column
    lastJoin: Date = new Date(2020, 1, 1);
    @Column
    startIndex: number = 0;
    @Column
    experience: number = 0;
    @Column
    isActive: boolean = false;

    constructor(){
        super();
        this.name = "";
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        const a = sequelize.define('hero', {
            name: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            lastSteal: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            },
            lastJoin: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            },
            startIndex: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            experience: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
          }, {freezeTableName: true});

          global.worker.log.error(a);
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }){
            sequelize.models.hero.hasOne(sequelize.models.heroTrait, { as: 'trait', foreignKey: 'heroName'});
            sequelize.models.hero.hasOne(sequelize.models.heroWallet, { as: 'wallet', foreignKey: 'heroName'});
            sequelize.models.hero.hasMany(sequelize.models.heroInventory, { as: 'inventory', foreignKey: 'heroName'});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as HeroItem[];

            for(const item of items){
                if(await sequelize.models.hero.count({where: {name: item.name}}) === 0){
                    await sequelize.models.hero.create(item as any);
                } else await sequelize.models.hero.update(item, {where: {name: item.name}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}

module.exports.default = HeroItem;