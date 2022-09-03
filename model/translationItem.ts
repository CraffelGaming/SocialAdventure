import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./translationItem.json');
@Table({ tableName: "translation", modelName: "translation"})
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

    constructor(page? : string, handle? : string, language? : string, translation? : string){
        super();
        this.page = page;
        this.handle = handle;
        this.language = language;
        this.translation = translation;
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
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
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as TranslationItem[];

            for(const item of items){
                if(await sequelize.models.translation.count({where: {page: item.page, handle: item.handle, language: item.language}}) === 0){
                    await sequelize.models.translation.create(item as any);
                } else await sequelize.models.translation.update(item, {where: {page: item.page, handle: item.handle, language: item.language}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }

    static translate(translation: TranslationItem[], handle: string): string {
        const value = translation.find(x => x.handle === handle)
        if (value && value.translation)
            return value.translation;

        return '[missing translation]';
    }
}

module.exports.default = TranslationItem;