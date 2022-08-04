
import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./heroTraitItem.json');

export class HeroTraitItem{
    heroName: string;
    goldMultipler: number;
    stealMultipler: number;
    defenceMultipler: number;
    workMultipler: number;

    constructor(){
        this.heroName = "";
    }

    static initialize(sequelize){
        sequelize.define('heroTrait', {
            heroName: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            goldMultipler: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            stealMultipler: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            defenceMultipler: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            workMultipler: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            }
          }, {freezeTableName: true});
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }){
        sequelize.models.heroTrait.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName'});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as HeroTraitItem[];

            for(const item of items){
                if(await sequelize.models.heroTrait.count({where: {heroName: item.heroName}}) === 0){
                    await sequelize.models.heroTrait.create(item as any);
                } else await sequelize.models.heroTrait.update(item, {where: {heroName: item.heroName}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}

module.exports.default = HeroTraitItem;