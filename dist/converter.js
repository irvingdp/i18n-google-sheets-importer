"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const lodash_1 = __importDefault(require("lodash"));
const flat_1 = __importDefault(require("flat"));
const papaparse_1 = __importDefault(require("papaparse"));
const encoding = require('encoding');
const DEFAULT_ENCODING = 'utf8';
function generateCSV(baseJSONPath, csvPath) {
    const translationFileNames = findJSONTranslationFileNames(baseJSONPath);
    const translationFiles = readJSONTranslationFiles(baseJSONPath, translationFileNames);
    const languageKeys = translationFileNames.map(name => name.substr(0, 2));
    const keys = extractKeys(translationFiles);
    const output = papaparse_1.default.unparse({
        fields: ['id', ...languageKeys],
        data: keys.map(key => [key, ...translationFiles.map(file => file[key])]),
    }, {
        quotes: true,
        delimiter: ',',
    });
    const outputPath = path_1.default.join(csvPath);
    const encodedData = encoding.convert(output, DEFAULT_ENCODING);
    writeCSVFile(outputPath, encodedData);
}
exports.generateCSV = generateCSV;
function importCSV(csvPath, outputPath) {
    const csv = fs_1.default.readFileSync(csvPath, { encoding: DEFAULT_ENCODING });
    const output = papaparse_1.default.parse(csv, { header: true, encoding: DEFAULT_ENCODING });
    const languages = output.meta.fields.slice(1);
    generateJSONs(outputPath, languages, output.data);
}
exports.importCSV = importCSV;
function importTranslationsFromSpreadsheet(spreadsheetData, outputPath) {
    const rows = spreadsheetData.data.values;
    if (!rows.length) {
        return console.error('No data found in the spreadsheet');
    }
    const header = rows[0];
    const languages = header.slice(1);
    const data = rows.slice(1).map(row => {
        const result = {
            id: row[0],
        };
        for (let i = 0; i < languages.length; i += 1) {
            result[languages[i]] = row[i + 1] || '';
        }
        return result;
    });
    generateJSONs(outputPath, languages, data);
}
exports.importTranslationsFromSpreadsheet = importTranslationsFromSpreadsheet;
function writeCSVFile(outputPath, encodedData) {
    fs_1.default.writeFileSync(outputPath, encodedData, { encoding: 'binary' });
}
function extractKeys(translationFiles) {
    const keys = lodash_1.default.uniq(lodash_1.default.flatten(translationFiles.map(Object.keys)));
    keys.sort();
    return keys;
}
function readJSONTranslationFiles(basePath, translationFileNames) {
    return translationFileNames
        .map(file => {
        const rawData = fs_1.default.readFileSync(path_1.default.join(basePath, file), DEFAULT_ENCODING);
        return JSON.parse(rawData);
    })
        .map(value => flat_1.default(value));
}
function findJSONTranslationFileNames(translationJSONFolderPath) {
    let translationFileNames = fs_1.default
        .readdirSync(translationJSONFolderPath)
        .filter(file => file.endsWith('.json') && file !== 'package.json');
    return lodash_1.default.reverse(translationFileNames);
}
function generateJSONs(outputPath, languages, data) {
    if (!fs_1.default.existsSync(outputPath)) {
        fs_1.default.mkdirSync(outputPath);
    }
    languages.forEach(lng => {
        const translations = {};
        data.forEach(translation => {
            lodash_1.default.set(translations, translation.id, translation[lng]);
        });
        fs_1.default.writeFileSync(path_1.default.join(outputPath, `${lng}.json`), JSON.stringify(translations, null, 2));
    });
}
