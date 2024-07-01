"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converter_1 = require("../converter");
const command = {
    command: 'export-csv',
    aliases: ['exportCsv', 'exportCSV'],
    describe: 'Exports JSON translation files to a CSV file',
    builder: {
        input: {
            default: 'translations',
            description: 'Path to a folder where JSON translation files are located',
        },
        output: {
            default: 'translations.csv',
            description: 'Path to which the result CSV file should be saved',
        },
    },
    handler: argv => {
        converter_1.generateCSV(argv.input, argv.output);
    },
};
module.exports = command;
