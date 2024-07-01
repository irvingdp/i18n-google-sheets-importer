"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converter_1 = require("../converter");
const command = {
    command: 'import-csv',
    aliases: ['importCsv', 'importCSV'],
    describe: 'Generate JSON translation files from a single CSV file',
    builder: {
        input: {
            default: 'translations.csv',
            description: 'Path to the CSV file with translations`',
        },
        output: {
            default: 'translations',
            description: 'Path to a folder where generated JSON files should be saved',
        },
    },
    handler: argv => {
        converter_1.importCSV(argv.input, argv.output);
    },
};
module.exports = command;
