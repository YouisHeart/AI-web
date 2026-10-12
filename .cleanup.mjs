import fs from "node:fs";

const root = "F:/company_pro/ai-pojo/ai-pojo/.tmp-chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function collectDirs(dir, out = []) {
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
    for (const e of entries) {
        const p = `${dir}/${e.name}`;
        if (e.isDirectory()) { out.push(p); collectDirs(p, out); }
        else { try { fs.rmSync(p, { force: true }); } catch {} }
    }
    return out;
}

let remaining = [];
for (let round = 0; round < 20; round++) {
    const dirs = collectDirs(root).sort((a, b) => b.length - a.length);
    if (!dirs.length) break;
    for (const d of dirs) { try { fs.rmdirSync(d); } catch {} }
    const left = collectDirs(root);
    remaining = left;
    if (!left.length) break;
    if (round > 0 && left.length === dirs.length) await sleep(2500);
    else await sleep(200);
}

let top = [];
try { top = fs.readdirSync(root); } catch { top = []; }
if (!top.length) {
    try { fs.rmdirSync(root); console.log("全部清理完成"); } catch (e) { console.log("根目录删除失败:", e.code); }
} else {
    console.log("仍有未删除目录数:", collectDirs(root).length, "顶层:", top.join(","));
}
console.log("root exists:", fs.existsSync(root));