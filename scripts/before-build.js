// before-build.js
import fs from "fs";
import path from "path";
import jsonFormat from "json-format";

console.log("Running before-build.js");

const VERSION = fs.readFileSync(path.resolve(__dirname, "../VERSION")).toString().trim();
const PATH_PACKAGEJSON = path.resolve(__dirname, "../package.json");

let json = JSON.parse(fs.readFileSync(PATH_PACKAGEJSON).toString());
json.version = VERSION;
fs.writeFileSync(PATH_PACKAGEJSON, jsonFormat(json, {
    type: 'space',
    size: 2
}));

const PATH_GLOBALJS = path.resolve(__dirname, "../docs/global.js");
let globaljs = fs.readFileSync(PATH_GLOBALJS).toString();
let winversion = globaljs.match(/window\.VERSION\ ?=\ ?\".*\";/g);
if (winversion != null) {
    winversion = winversion[0];
}
let version = winversion.match(/\".*\"/g)[0].replace(/\"/g, "");
globaljs = globaljs.replace(winversion, winversion.replace(version, VERSION));
fs.writeFileSync(PATH_GLOBALJS, globaljs);

console.log("Completed before-build.js");

// after-build.js
import fs from "fs";
import path from "path";
import { sync as glob } from "glob";

console.log("Running after-build.js");

// let files = glob("*.vsix", { cwd: path.resolve(__dirname, "../"), absolute: true });
// files.forEach((filepath) => {
//     let targetpath = path.resolve(__dirname, "../docs/releases", path.basename(filepath));
//     fs.renameSync(filepath, targetpath);
// })

fs.copyFileSync(
    path.resolve(__dirname, "../CHANGELOG.md"),
    path.resolve(__dirname, "../docs/CHANGELOG.md")
)

console.log("Completed after-build.js");
