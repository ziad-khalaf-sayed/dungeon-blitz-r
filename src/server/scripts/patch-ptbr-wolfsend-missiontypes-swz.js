#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const DEFAULT_SWZ = path.join('src', 'client', 'content', 'localhost', 'p', 'cbq', 'Game.pt-br.swz');

const MISSION_PATCHES = new Map([
  ['6', {
    Description: 'Alguns goblins agora seguem Nephit, um mestre misterioso escondido numa tumba antiga. Faça uma visita.'
  }],
  ['7', {
    Description: 'Nephit buscava os segredos do Dragão dos Sonhos, mas cavou no lugar errado. Descubra o que ele procurava.'
  }],
  ['9', {
    Description: 'Os goblins roubaram metal dos aldeões. Os mais durões usam tudo como joias. Recupere alguns pertences dos aldeões.'
  }],
  ['12', {
    TrackerReturn: 'Conte a Jerdus que algumas dezenas de goblins já caíram'
  }],
  ['271', {
    TrackerReturn: 'Avise Anna que os goblins acabaram em Fim do Lobo'
  }]
]);

const LEVEL_DISPLAY_NAME_PATCHES = new Map([
  ['GoblinRiverDungeon', 'Acampamento Goblin']
]);

const EGG_DISPLAY_NAME_PATCHES = new Map([
  ['GenericBrown', 'Ovo Branco Pintado'],
  ['CommonBrown', 'Ovo Branco Ornado'],
  ['OrdinaryBrown', 'Ovo Branco Listrado'],
  ['PlainBrown', 'Ovo Branco Brilhante'],
  ['GenericRed', 'Ovo Vermelho Pintado'],
  ['GenericYellow', 'Ovo Amarelo Pintado'],
  ['GenericBlue', 'Ovo Azul Pintado'],
  ['GenericGreen', 'Ovo Verde Pintado']
]);

function repoRoot() {
  return path.resolve(__dirname, '..', '..', '..');
}

function resolvePath(value) {
  return path.isAbsolute(value) ? value : path.join(repoRoot(), value);
}

function rotateKey(key, shift) {
  return (((key << (32 - shift)) >>> 0) | (key >>> shift)) >>> 0;
}

function decodeSwz(buffer) {
  let offset = 0;
  const initialKey = buffer.readUInt32BE(offset);
  let key = initialKey >>> 0;
  offset += 4;
  const count = buffer.readUInt32BE(offset);
  offset += 4;

  const entries = [];
  for (let entryIndex = 0; entryIndex < count; entryIndex += 1) {
    const encodedLength = buffer.readUInt32BE(offset);
    offset += 4;
    const encoded = Buffer.alloc(encodedLength);

    for (let byteIndex = 0; byteIndex < encodedLength; byteIndex += 1) {
      const shift = byteIndex & 7;
      encoded[byteIndex] = buffer[offset++] ^ (key & 0xff);
      key = rotateKey(key, shift);
    }

    const xml = zlib.inflateSync(encoded).toString('utf8');
    entries.push({
      rootName: xml.match(/<([A-Za-z0-9_:-]+)/)?.[1] || '',
      xml
    });
  }

  return { initialKey, entries };
}

function encodeSwz(initialKey, entries) {
  const chunks = [];
  const header = Buffer.alloc(8);
  header.writeUInt32BE(initialKey >>> 0, 0);
  header.writeUInt32BE(entries.length >>> 0, 4);
  chunks.push(header);

  let key = initialKey >>> 0;
  for (const entry of entries) {
    const compressed = zlib.deflateSync(Buffer.from(entry.xml, 'utf8'));
    const length = Buffer.alloc(4);
    length.writeUInt32BE(compressed.length >>> 0, 0);
    chunks.push(length);

    const encoded = Buffer.alloc(compressed.length);
    for (let byteIndex = 0; byteIndex < compressed.length; byteIndex += 1) {
      const shift = byteIndex & 7;
      encoded[byteIndex] = compressed[byteIndex] ^ (key & 0xff);
      key = rotateKey(key, shift);
    }
    chunks.push(encoded);
  }

  return Buffer.concat(chunks);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function patchTag(entry, tagName, value) {
  const pattern = new RegExp(`(<${tagName}>)[\\s\\S]*?(<\\/${tagName}>)`);
  if (!pattern.test(entry)) {
    throw new Error(`Missing <${tagName}> in mission entry`);
  }
  return entry.replace(pattern, `$1${escapeXml(value)}$2`);
}

function patchMissionTypesXml(xml) {
  let changed = 0;
  let current = xml;

  for (const [missionId, fields] of MISSION_PATCHES.entries()) {
    const idTag = `<MissionID>${missionId}</MissionID>`;
    const idIndex = current.indexOf(idTag);
    if (idIndex < 0) {
      throw new Error(`MissionID ${missionId} not found in MissionTypes`);
    }

    const start = current.lastIndexOf('<MissionType>', idIndex);
    const end = current.indexOf('</MissionType>', idIndex) + '</MissionType>'.length;
    if (start < 0 || end < 0) {
      throw new Error(`Could not isolate MissionID ${missionId}`);
    }

    let entry = current.slice(start, end);
    const before = entry;
    for (const [tagName, value] of Object.entries(fields)) {
      entry = patchTag(entry, tagName, value);
    }

    if (entry !== before) {
      current = `${current.slice(0, start)}${entry}${current.slice(end)}`;
      changed += 1;
    }
  }

  return { xml: current, changed };
}

function patchLevelTypesXml(xml) {
  let changed = 0;
  let current = xml;

  for (const [levelName, displayName] of LEVEL_DISPLAY_NAME_PATCHES.entries()) {
    const levelTag = `<LevelType LevelName="${levelName}">`;
    const levelIndex = current.indexOf(levelTag);
    if (levelIndex < 0) {
      throw new Error(`LevelName ${levelName} not found in LevelTypes`);
    }

    const end = current.indexOf('</LevelType>', levelIndex) + '</LevelType>'.length;
    if (end < 0) {
      throw new Error(`Could not isolate LevelName ${levelName}`);
    }

    let entry = current.slice(levelIndex, end);
    const before = entry;
    entry = patchTag(entry, 'DisplayName', displayName);

    if (entry !== before) {
      current = `${current.slice(0, levelIndex)}${entry}${current.slice(end)}`;
      changed += 1;
    }
  }

  return { xml: current, changed };
}

function patchEggTypesXml(xml) {
  let changed = 0;
  let current = xml;

  for (const [eggName, displayName] of EGG_DISPLAY_NAME_PATCHES.entries()) {
    const eggTag = `<EggType EggName="${eggName}">`;
    const eggIndex = current.indexOf(eggTag);
    if (eggIndex < 0) {
      throw new Error(`EggName ${eggName} not found in EggTypes`);
    }

    const end = current.indexOf('</EggType>', eggIndex) + '</EggType>'.length;
    if (end < 0) {
      throw new Error(`Could not isolate EggName ${eggName}`);
    }

    let entry = current.slice(eggIndex, end);
    const before = entry;
    entry = patchTag(entry, 'DisplayName', displayName);

    if (entry !== before) {
      current = `${current.slice(0, eggIndex)}${entry}${current.slice(end)}`;
      changed += 1;
    }
  }

  return { xml: current, changed };
}

function main() {
  const swzPath = resolvePath(process.argv[2] || DEFAULT_SWZ);
  const decoded = decodeSwz(fs.readFileSync(swzPath));
  const missionIndex = decoded.entries.findIndex((entry) => entry.rootName === 'MissionTypes');
  if (missionIndex < 0) {
    throw new Error('MissionTypes resource not found');
  }

  const levelIndex = decoded.entries.findIndex((entry) => entry.rootName === 'LevelTypes');
  if (levelIndex < 0) {
    throw new Error('LevelTypes resource not found');
  }

  const eggIndex = decoded.entries.findIndex((entry) => entry.rootName === 'EggTypes');
  if (eggIndex < 0) {
    throw new Error('EggTypes resource not found');
  }

  const patchedMissions = patchMissionTypesXml(decoded.entries[missionIndex].xml);
  const patchedLevels = patchLevelTypesXml(decoded.entries[levelIndex].xml);
  const patchedEggs = patchEggTypesXml(decoded.entries[eggIndex].xml);
  const totalChanged = patchedMissions.changed + patchedLevels.changed + patchedEggs.changed;
  if (!totalChanged) {
    console.log('[patch-ptbr-wolfsend-missiontypes-swz] no changes needed');
    return;
  }

  decoded.entries[missionIndex] = { ...decoded.entries[missionIndex], xml: patchedMissions.xml };
  decoded.entries[levelIndex] = { ...decoded.entries[levelIndex], xml: patchedLevels.xml };
  decoded.entries[eggIndex] = { ...decoded.entries[eggIndex], xml: patchedEggs.xml };
  fs.writeFileSync(swzPath, encodeSwz(decoded.initialKey, decoded.entries));
  console.log(`[patch-ptbr-wolfsend-missiontypes-swz] patched ${totalChanged} Game.pt-br.swz entries in ${swzPath}`);
}

main();
