import { Column, Table, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { HeroTraitItem } from './heroTraitItem.js';
import { HeroWalletItem } from './heroWalletItem.js';
@Table({ tableName: "hero", modelName: "hero" })
export class HeroItem {
    @PrimaryKey
    @Column
    name: string;
    @Column
    lastSteal: Date = new Date(2020, 1, 1);
    @Column
    lastJoin: Date = new Date(2020, 1, 1);
    @Column
    lastLeave: Date = new Date(2020, 1, 1);
    @Column
    lastGive: Date = new Date(2020, 1, 1);
    @Column
    lastDaily: Date = new Date(2020, 1, 1);
    @Column
    startIndex: number = 0;
    @Column
    experience: number = 0;
    @Column
    prestige: number = 0;
    @Column
    hitpoints: number = 100;
    @Column
    hitpointsMax: number = 100;
    @Column
    isActive: boolean = false;
    @Column
    isFounder: boolean = false;
    @Column
    level: number = 1;
    @Column
    strength: number = 20;

    constructor(name: string){
        this.name = name;
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('hero', {
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
            lastLeave: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            },
            lastDaily: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            },
            lastGive: {
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
            prestige: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            hitpoints: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            hitpointsMax: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            isFounder: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            strength: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 20
            }
          }, {freezeTableName: true});
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }){
            sequelize.models.hero.hasOne(sequelize.models.heroTrait, { as: 'trait', foreignKey: 'heroName'});
            sequelize.models.hero.hasOne(sequelize.models.adventure, { as: 'adventure', foreignKey: 'heroName'});
            sequelize.models.hero.hasOne(sequelize.models.heroWallet, { as: 'wallet', foreignKey: 'heroName'});
            sequelize.models.hero.hasMany(sequelize.models.heroInventory, { as: 'inventory', foreignKey: 'heroName'});
            sequelize.models.hero.hasMany(sequelize.models.heroPromotion, { as: 'promotion', foreignKey: 'heroName'});
            sequelize.models.hero.hasMany(sequelize.models.raidHero, { as: 'raids', foreignKey: 'heroName'});
    }

    static async calculateHero({ sequelize, element }: { sequelize: Sequelize, element: HeroItem }): Promise<boolean>{
        const level = await sequelize.models.level.findOne({
            attributes:[[sequelize.fn('max', sequelize.col('experienceMax')),'max']]
        });
        const maxExperience = level.getDataValue("max");

        if(element.experience >= maxExperience){
            await sequelize.models.hero.decrement('experience', { by: maxExperience, where: { name: element.name }});
            await sequelize.models.hero.increment('prestige', { by: 1, where: { name: element.name }});
        }

        return true;
    }

    static async put({ sequelize, element, onlyCreate }: { sequelize: Sequelize, element: HeroItem, onlyCreate: boolean }): Promise<number>{
        let result = 201;
        try{
            if(element.name !== null && element.name !== ""){
                element.name.toLowerCase();
                if(await sequelize.models.hero.count({where: {name: element.name}}) === 0){
                    await sequelize.models.hero.create(element as any);
                    await HeroTraitItem.put({sequelize, element: new HeroTraitItem(element.name)});
                    await HeroWalletItem.put({sequelize, element: new HeroWalletItem(element.name)});
                } else if(!onlyCreate) {
                    await sequelize.models.hero.update(element, {where: {name: element.name}})
                }
                HeroItem.calculateHero({sequelize, element});
            } else result = 406;
        } catch(ex){
            global.worker.log.error(ex);
            result = 500;
        }
        return result;
    }
}