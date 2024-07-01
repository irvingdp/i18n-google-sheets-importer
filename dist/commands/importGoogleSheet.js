"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleApi_1 = require("../googleApi");
const converter_1 = require("../converter");
const command = {
    command: 'import-google-sheet',
    aliases: ['importGoogleSheet'],
    describe: 'Generates JSON translation files from a Google Drive spreadsheet',
    builder: {
        spreadsheetId: {
            required: true,
            description: 'Spreadsheet ID',
        },
        output: {
            default: 'translations',
            description: 'Path to a folder where generated JSON files should be saved',
        },
        sheetName: {
            default: 'Sheet1',
            description: 'Name of the sheet which contains translations',
        },
        credentials: {
            default: 'credentials.json',
            description: 'File with Google API credentials. It can be generated on https://developers.google.com/sheets/api/quickstart/nodejs',
        },
        token: {
            default: 'token.json',
            description: 'File with Google API token. If it has not been generated yet, the script will create it',
        },
    },
    handler: argv => {
        googleApi_1.initGoogleAPIByKeyFile(argv.keyFilePath, async (auth) => {
            const spreadsheet = await googleApi_1.downloadSpreadsheet(auth, argv.spreadsheetId, argv.sheetName);
            converter_1.importTranslationsFromSpreadsheet(spreadsheet, argv.output);
        });
    },
};
module.exports = command;
