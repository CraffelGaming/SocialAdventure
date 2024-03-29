import { Column, Table, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ tableName: "heroTrait", modelName: "heroTrait" })
export class HeroTraitItem {
    @PrimaryKey
    @Column
    heroName: string;
    @Column
    goldMultipler: number = 1;
    @Column
    stealMultipler: number = 1;
    @Column
    defenceMultipler: number = 1;
    @Column
    workMultipler: number = 1;
    @Column
    strengthMultipler: number = 1;
    @Column
    hitpointMultipler: number = 1;
    @Column
    perceptionMultipler: number = 1;

    constructor(heroName: string) {
        this.heroName = heroName;
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }) {
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
            },
            strengthMultipler: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            hitpointMultipler: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            perceptionMultipler: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            }
        }, { freezeTableName: true });
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }) {
        sequelize.models.heroTrait.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName' });
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: HeroTraitItem }): Promise<number> {
        try {
            if (element.heroName !== null && element.heroName !== "") {
                if (await sequelize.models.heroTrait.count({ where: { heroName: element.heroName } }) === 0) {
                    await sequelize.models.heroTrait.create(element as any);
                } else await sequelize.models.heroTrait.update(element, { where: { heroName: element.heroName } });
                return 200;
            } else return 406;

        } catch (ex) {
            global.worker.log.error(ex);
            return 500;
        }
    }
}