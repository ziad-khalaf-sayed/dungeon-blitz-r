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

function methodCode(swfPath: string, methodIdx: number): Buffer {
    const ctx = parseSwf(swfPath);
    const abc = parseAbc(ctx);
    const methodBody = abc.methodBodies.get(methodIdx);
    assert.ok(methodBody, `method ${methodIdx} body not found`);
    return Buffer.from(ctx.body.subarray(methodBody.codeStart, methodBody.codeStart + methodBody.codeLen));
}

function methodPushedStrings(swfPath: string, methodIdx: number): string[] {
    const ctx = parseSwf(swfPath);
    const abc = parseAbc(ctx);
    const methodBody = abc.methodBodies.get(methodIdx);
    assert.ok(methodBody, `method ${methodIdx} body not found`);
    const code = ctx.body.subarray(methodBody.codeStart, methodBody.codeStart + methodBody.codeLen);
    return disassemble(code, `method-${methodIdx}`)
        .filter((instruction) => instruction.opcode === 0x2c)
        .map((instruction) => abc.stringValues[instruction.operands[0]?.[1] ?? 0]);
}

function testPortugueseRewardMethodsMatchEnglish(): void {
    const baseSwf = resolveBaseSwfPath();
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ptbr-reward-swf-parity-'));
    const englishPath = path.join(tempDir, 'DungeonBlitz.en.swf');
    const portuguesePath = path.join(tempDir, 'DungeonBlitz.pt-br.swf');

    fs.writeFileSync(englishPath, buildDungeonBlitzSwfVariantBuffer(baseSwf, 'local', 'en'));
    fs.writeFileSync(portuguesePath, buildDungeonBlitzSwfVariantBuffer(baseSwf, 'local', 'pt-br'));

    try {
        const rewardAndLootMethods = [
            801,  // grant reward packet handling
            2167, // pickup loot drop handling
            2422, // Loot constructor/visual setup
            2423, // material pickup/loot drop path
            3515, // receive loot drop packet handling
            3471, // receive reward/loot drop path
            3633  // reward/loot packet registration
        ];

        for (const methodIdx of rewardAndLootMethods) {
            assert.deepEqual(
                methodCode(portuguesePath, methodIdx),
                methodCode(englishPath, methodIdx),
                `PT-BR DungeonBlitz.swf reward method ${methodIdx} should match EN bytecode`
            );
        }

        assert.deepEqual(
            methodPushedStrings(portuguesePath, 2422),
            methodPushedStrings(englishPath, 2422),
            'PT-BR Loot constructor pushed strings should match EN so asset URLs stay canonical'
        );
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
}

function main(): void {
    testPortugueseRewardMethodsMatchEnglish();
    console.log('ptbr_reward_swf_parity_regression: ok');
}

main();
