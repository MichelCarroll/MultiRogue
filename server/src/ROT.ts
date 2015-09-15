/**
 * Created by michelcarroll on 15-03-29.
 */

///<reference path='./../ts-definitions/node.d.ts' />

var fs = require('fs');
var window = {};
eval(fs.readFileSync(__dirname+'/../bower_components/rot.js/rot.js','utf8'));
export = ROT;