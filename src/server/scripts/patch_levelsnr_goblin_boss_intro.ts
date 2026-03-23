import * as path from "path";
import {
  applyPatchesToBody,
  BytePatch,
  defaultLevelsNrPath,
  ensureBackup,
  parseAbc,
  parseSwf,
  PatchError,
  writeSwf,
  writeU30,
} from "./swfPatchUtils";

const OLD_LINE = "4 Boss <Goto Red 1>You're the one that killed our Kraken!";
const NEW_LINE = "4 Boss You're the one that killed our Kraken!";

function resolveSwfPath(args: string[]): string {
  const idx = args.indexOf("--swf-path");
  if (idx !== -1 && idx + 1 < args.length) {
    return path.resolve(args[idx + 1]);
  }
  return defaultLevelsNrPath();
}

function hasFlag(args: string[], flag: string): boolean {
  return args.includes(flag);
}

function findLinePatch(swfPath: string): { ctx: ReturnType<typeof parseSwf>; patches: BytePatch[]; currentLine: string } {
  const ctx = parseSwf(swfPath);
  const abc = parseAbc(ctx);

  if (abc.stringValues.includes(NEW_LINE)) {
    return { ctx, patches: [], currentLine: NEW_LINE };
  }

  const idx = abc.stringValues.indexOf(OLD_LINE);
  if (idx === -1) {
    throw new PatchError("Goblin boss intro line not found in ABC string pool");
  }

  const lenPos = abc.stringLenPositions[idx];
  const dataPos = abc.stringDataPositions[idx];
  const oldBytes = Buffer.from(OLD_LINE, "utf8");
  const newBytes = Buffer.from(NEW_LINE, "utf8");
  const patch: BytePatch = {
    key: "levelsnr_goblin_boss_intro",
    start: lenPos,
    end: dataPos + oldBytes.length,
    data: Buffer.concat([writeU30(newBytes.length), newBytes]),
    detail: "Remove broken <Goto Red 1> token from Goblin boss intro cutscene",
  };

  return { ctx, patches: [patch], currentLine: OLD_LINE };
}

function main(): number {
  const args = process.argv.slice(2);
  const swfPath = resolveSwfPath(args);
  const verifyOnly = hasFlag(args, "--verify") || hasFlag(args, "--dry-run");

  try {
    const { ctx, patches, currentLine } = findLinePatch(swfPath);
    console.log(`SWF: ${swfPath}`);
    console.log(`Current line: ${currentLine}`);
    console.log(`Replacement:  ${NEW_LINE}`);

    if (patches.length === 0) {
      console.log("No changes needed.");
      return 0;
    }

    console.log(`Patch: ${patches[0].detail}`);
    if (verifyOnly) {
      return 0;
    }

    ensureBackup(swfPath);
    const { body, delta } = applyPatchesToBody(ctx.body, patches);
    writeSwf(ctx, body, delta);
    console.log("Patch apply complete.");
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Patch error: ${message}`);
    return 1;
  }
}

process.exit(main());
