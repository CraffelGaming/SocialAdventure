
import { Column, Table, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
@Table({ tableName: "heroWallet", modelName: "heroWallet" })
export class HeroWalletItem {
    @PrimaryKey
    @Column
    heroName: string;
    @Column
    gold: number = 1000;
    @Column
    diamond: number = 0
    @Column
    blood: number = 0
    @Column
    lastBlood: Date = new Date(2020, 1, 1);

    constructor(heroName: string) {
        this.heroName = heroName;
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }) {
        sequelize.define('heroWallet', {
            heroName: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            gold: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1000
            },
            diamond: {
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
        }, { freezeTableName: true });
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }) {
        sequelize.models.heroWallet.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName' });
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: HeroWalletItem }): Promise<number> {
        try {
            if (element.heroName !== null && element.heroName !== "") {
                if (await sequelize.models.heroWallet.count({ where: { heroName: element.heroName } }) === 0) {
                    await sequelize.models.heroWallet.create(element as any);
                } else await sequelize.models.heroWallet.update(element, { where: { heroName: element.heroName } });
                return 201;
            } else return 406;

        } catch (ex) {
            global.worker.log.error(ex);
            return 500;
        }
    }
}