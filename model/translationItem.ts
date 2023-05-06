import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'translationItem.json')).toString());
@Table({ tableName: "translation", modelName: "translation" })
export class TranslationItem extends Model<TranslationItem>{
    @PrimaryKey
    @Column
    page: string;
    @PrimaryKey
    @Column
    handle: string;
    @PrimaryKey
    @Column
    language: string = "de-DE";
    @Column
    translation: string;

    constructor(page?: string, handle?: string, language?: string, translation?: string) {
        super();
        this.page = page;
        this.handle = handle;
        this.language = language;
        this.translation = translation;
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }) {
        sequelize.define('translation', {
            page: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            handle: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            language: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "de-DE",
                primaryKey: true
            },
            translation: {
                type: DataTypes.STRING,
                allowNull: false
            },
        }, { freezeTableName: true });
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void> {
        try {
            const items = JSON.parse(JSON.stringify(json)) as TranslationItem[];

            for (const item of items) {
                if (await sequelize.models.translation.count({ where: { page: item.page, handle: item.handle, language: item.language } }) === 0) {
                    await sequelize.models.translation.create(item as any);
                } else await sequelize.models.translation.update(item, { where: { page: item.page, handle: item.handle, language: item.language } });
            }
        } catch (ex) {
            global.worker.log.error(ex);
        }
    }

    static translate(translation: Model<TranslationItem>[], handle: string): string {
        const value = translation.find(x => x.getDataValue('handle') === handle)
        if (value && value.getDataValue('translation'))
            return value.getDataValue('translation');

        return '';
    }
}