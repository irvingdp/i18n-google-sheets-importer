#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const packageName = require('../package.json').name;
yargs_1.default
    .commandDir('commands', {
    extensions: ['js', 'ts'],
})
    .scriptName(packageName)
    .demandCommand()
    .help().argv;
