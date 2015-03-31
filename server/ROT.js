/**
 * Created by michelcarroll on 15-03-29.
 */
///<reference path='./bower_components/rot.js-TS/rot.d.ts' />
///<reference path='./ts-definitions/node.d.ts' />
var fs = require('fs');
eval(fs.readFileSync(__dirname + '/node_modules/rot.js/rot.js/rot.js', 'utf8'));
module.exports = ROT;
//# sourceMappingURL=ROT.js.map