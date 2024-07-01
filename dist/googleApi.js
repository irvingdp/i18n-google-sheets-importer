"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const google_auth_library_1 = require("google-auth-library");
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
const GOOGLE_API_VERSION = 'v4';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
async function downloadSpreadsheet(auth, spreadsheetId, sheetName) {
    const sheets = googleapis_1.google.sheets({ version: GOOGLE_API_VERSION, auth });
    return await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: sheetName,
    });
}
exports.downloadSpreadsheet = downloadSpreadsheet;
function initGoogleAPI(credentialsPath, tokenPath, callback) {
    const rawCredentials = fs_1.default.readFileSync(credentialsPath, 'utf8');
    const credentials = JSON.parse(rawCredentials);
    authorize(credentials, tokenPath, callback);
}
exports.initGoogleAPI = initGoogleAPI;
function initGoogleAPIByKeyFile(keyfilePath, callback) {
    const SCOPES = [
        'https://www.googleapis.com/auth/spreadsheets.readonly',
    ];
    const auth = new google_auth_library_1.GoogleAuth({
        keyFile: keyfilePath,
        scopes: SCOPES,
    });
    auth.getClient().then((authClient) => callback(authClient));
}
exports.initGoogleAPIByKeyFile = initGoogleAPIByKeyFile;
function authorize(credentials, tokenPath, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    // Check if we have previously stored a token.
    fs_1.default.readFile(tokenPath, 'utf8', (err, token) => {
        if (err) {
            return getNewToken(tokenPath, oAuth2Client, callback);
        }
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}
function getNewToken(tokenPath, oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', code => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err || !token) {
                return console.error('Error while trying to retrieve access token', err);
            }
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs_1.default.writeFile(tokenPath, JSON.stringify(token), error => {
                if (error) {
                    return console.error(error);
                }
                console.log('Token stored to', tokenPath);
            });
            callback(oAuth2Client);
        });
    });
}
