import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { buildDungeonBlitzSwfVariantBuffer } from '../core/DungeonBlitzSwf';
import { disassemble, parseAbc, parseSwf } from '../scripts/swfPatchUtils';

function resolveBaseSwfPath(): string {
    const candidates = [
        path.resolve(__dirname, '../../client/content/localhost/p/cbp/DungeonBlitz.swf'),
        path.resolve(__dirname, '../../../client/content/localhost/p/cbp/DungeonBlitz.swf'),
        path.resolve(process.cwd(), 'src/client/content/localhost/p/cbp/DungeonBlitz.swf')
    ];

    return candidates.find((candidate) => fs.existsSync(candidate)) ?? candidates[0];
}

function collectMethodStrings(swfPath: string, methodIdx: number): string[] {
    const ctx = parseSwf(swfPath);
    const abc = parseAbc(ctx);
    const methodBody = abc.methodBodies.get(methodIdx);
    assert.ok(methodBody, `method ${methodIdx} body not found`);

    const code = ctx.body.subarray(methodBody.codeStart, methodBody.codeStart + methodBody.codeLen);
    return disassemble(code, `m${methodIdx}`)
        .filter((instruction) => instruction.opcode === 0x2c)
        .map((instruction) => abc.stringValues[instruction.operands[0]?.[1]]);
}

function withPortugueseDungeonBlitzSwf(callback: (swfPath: string) => void): void {
    const buffer = buildDungeonBlitzSwfVariantBuffer(resolveBaseSwfPath(), 'local', 'pt-br');
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ptbr-item-type-labels-'));
    const tempPath = path.join(tempDir, 'DungeonBlitz.pt-br.swf');
    fs.writeFileSync(tempPath, buffer);

    try {
        callback(tempPath);
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
}

function testPortugueseItemTypeLabelsAreVisualOnly(): void {
    withPortugueseDungeonBlitzSwf((swfPath) => {
        assert.equal(collectMethodStrings(swfPath, 1998).includes('Montaria'), true);
        assert.equal(collectMethodStrings(swfPath, 2008).includes('Montaria'), true);
        assert.equal(collectMethodStrings(swfPath, 2182).includes('Comida de Pet'), true);
        assert.equal(collectMethodStrings(swfPath, 1540).includes('Catalisador'), true);
        assert.equal(collectMethodStrings(swfPath, 2321).includes('Catalisador'), true);
        assert.equal(collectMethodStrings(swfPath, 2246).includes('Gema'), true);
        assert.equal(collectMethodStrings(swfPath, 1520).includes('Materiais de Criação'), true);

        const consumableTooltipStrings = collectMethodStrings(swfPath, 1999);
        assert.equal(consumableTooltipStrings.includes('Poção'), true);
        assert.equal(consumableTooltipStrings.includes('Catalisador'), true);
        assert.equal(consumableTooltipStrings.includes('Comida de Pet'), true);
        assert.equal(consumableTooltipStrings.includes('Potion'), true);

        const storeCardStrings = collectMethodStrings(swfPath, 2124);
        assert.equal(storeCardStrings.includes('Montaria'), true);
        assert.equal(storeCardStrings.includes('Poção'), true);
        assert.equal(storeCardStrings.includes('Gema'), true);
        assert.equal(storeCardStrings.includes('Catalisador'), true);
        assert.equal(storeCardStrings.includes('Comida de Pet'), true);
        assert.equal(storeCardStrings.includes('Mount'), true);
        assert.equal(storeCardStrings.includes('Charm'), true);

        const storeCardRendererStrings = collectMethodStrings(swfPath, 2130);
        assert.equal(storeCardRendererStrings.includes('Montaria'), true);
        assert.equal(storeCardRendererStrings.includes('Gema'), true);
        assert.equal(storeCardRendererStrings.includes('Catalisador'), true);

        const inventoryCategoryStrings = collectMethodStrings(swfPath, 3359);
        assert.equal(inventoryCategoryStrings.includes('Charm'), true);
        assert.equal(inventoryCategoryStrings.includes('Material'), true);
        assert.equal(inventoryCategoryStrings.includes('Gemas'), true);
        assert.equal(inventoryCategoryStrings.includes('Materiais de Criação'), true);
    });
}

function main(): void {
    testPortugueseItemTypeLabelsAreVisualOnly();
    console.log('ptbr_item_type_labels_regression: ok');
}

main();
