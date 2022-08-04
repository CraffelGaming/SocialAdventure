
import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./heroWalletItem.json');

export class HeroWalletItem{
    heroName: string;
    gold: number;
    diamand: number;
    blood: number;
    lastBlood: Date;

    constructor(){
        this.heroName = "";
    }

    static initialize(sequelize){
        sequelize.define('heroWallet', {
            heroName: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            gold: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            diamand: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            blood: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            lastBlood: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            }
          }, {freezeTableName: true});
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }){
        sequelize.models.heroWallet.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName'});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as HeroWalletItem[];

            for(const item of items){
                if(await sequelize.models.heroWallet.count({where: {heroName: item.heroName}}) === 0){
                    await sequelize.models.heroWallet.create(item as any);
                } else await sequelize.models.heroWallet.update(item, {where: {heroName: item.heroName}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}

module.exports.default = HeroWalletItem;