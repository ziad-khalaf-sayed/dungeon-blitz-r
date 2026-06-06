#!/usr/bin/env node
/**
 * patch-ptbr-brm-missiontypes-swz.js
 * Aplica as traduções PT-BR revisadas do mapa Black Rose Mire no Game.pt-br.swz:
 *   - MissionTypes: DisplayName, TrackerText, TrackerReturn, Description (missões 8 e 15–31)
 *
 * Uso: node src/server/scripts/patch-ptbr-brm-missiontypes-swz.js [caminho-do-swz]
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const DEFAULT_SWZ = path.join(
  'src', 'client', 'content', 'localhost', 'p', 'cbq', 'Game.pt-br.swz'
);

// ─── Dados de patch por MissionID ─────────────────────────────────────────────
// Campos disponíveis: DisplayName, TrackerText, TrackerReturn, Description
// Missões sem TrackerText (missões de viagem) omitem o campo.

const MISSION_PATCHES = new Map([
  ['8', {
    DisplayName: 'Pela Estrada Adiante',
    TrackerReturn: 'Leve a luta ao Pântano da Rosa Negra',
    Description: 'Fim do Lobo foi libertada dos goblins. Hora de liderar a luta pelo Pântano da Rosa Negra e expulsar a horda.'
  }],
  ['15', {
    DisplayName: 'Torre dos Tuatara',
    TrackerText: 'Expulse os Tuatara da torre a leste de Sark',
    TrackerReturn: 'Diga ao Abbod que você expulsou o Chefe Tuatara',
    Description: 'Um novo inimigo tomou uma torre próxima. Para reconquistar o território, precisamos antes expulsá-los.'
  }],
  ['16', {
    DisplayName: 'Mistério de Yornak',
    TrackerText: 'O que é Yornak? E que tesouro ele guarda?',
    TrackerReturn: 'Conte aos aldeões sobre a derrota de Yornak',
    Description: 'Nas profundezas do pântano, ergue-se o castelo do Lorde Yornak. Que segredos estão enterrados com ele?'
  }],
  ['17', {
    DisplayName: 'Adentrando o Pântano',
    TrackerReturn: 'Encontre o Patrulheiro Affric e veja o que ele descobriu',
    Description: 'Viaje ao leste, onde o Patrulheiro Affric montou uma base avançada. Ele descobriu algo importante por lá.'
  }],
  ['18', {
    DisplayName: 'Covil do Ooyak',
    TrackerText: 'Derrote o Carnissauro Colossal dos Tuatara',
    TrackerReturn: 'Diga aos patrulheiros que o Grande Ooyak está morto',
    Description: 'Os Tuatara usam carnissauros escravizados para lutar. Desça até o Covil do Ooyak e elimine a ameaça.'
  }],
  ['19', {
    DisplayName: 'Cidadela do Vizir',
    TrackerText: 'Desafie o Vizir Hsalt em seu covil',
    TrackerReturn: 'Volte aos patrulheiros com a notícia da sua vitória',
    Description: 'O Vizir Hsalt é o culpado pela magia que corrompeu o pântano. É hora de acabar com ele e suas experiências.'
  }],
  ['20', {
    DisplayName: 'Despeito de Svar',
    TrackerText: 'Expulse o general Tuatara do forte em ruínas',
    TrackerReturn: 'Diga ao povo de Fim do Lobo que os generais são dragões',
    Description: 'O general Tuatara ocupa um forte em ruínas. Invada o covil dele e descubra o segredo por trás da Legião.'
  }],
  ['21', {
    DisplayName: 'A Última Vila',
    TrackerReturn: 'Encontre-se com Gehrin para saber mais',
    Description: 'Fale com Gehrin e veja o que ele descobriu sobre o outro general da Legião Tuatara.'
  }],
  ['22', {
    DisplayName: 'O Grande Svath Verde',
    TrackerText: 'Acabe com a invasão dos dragões',
    TrackerReturn: 'Diga aos soldados que a Legião Tuatara foi derrotada',
    Description: 'O líder desta invasão dracônica está neste castelo. E parece que ele tem aliados bem sombrios ao seu lado.'
  }],
  ['23', {
    DisplayName: 'Pântano de Arachnae',
    TrackerText: 'Abra caminho pela estrada até o Castelo Hocke',
    TrackerReturn: 'Abra caminho até o Castelo Hocke',
    Description: 'Você precisa entrar no Castelo Hocke se quiser descobrir a verdade sobre os monstros que tomaram Ellyria.'
  }],
  ['24', {
    DisplayName: 'Clareira da Rainha Louca',
    TrackerText: 'Descubra a origem desta praga dos Devoradores',
    TrackerReturn: 'Volte à vila para receber sua recompensa',
    Description: 'Este lugar costumava ser o Celeiro Real. Agora é a origem de todas aquelas plantas devoradoras de gente.'
  }],
  ['25', {
    DisplayName: 'Estandartes Tuatara',
    ProgressText: 'Estandarte dos Lagartos',
    TrackerText: 'Recolha os estandartes dos homens-lagarto',
    TrackerReturn: 'Receba a recompensa pelos estandartes com Ield',
    Description: 'Sem seus estandartes, tropas Tuatara ficam desmoralizadas. Sua captura seria um duro golpe para os lagartos.'
  }],
  ['26', {
    DisplayName: 'Lagarto Invasor',
    TrackerText: 'Mande os Tuatara embora',
    TrackerReturn: 'Diga a Palok que está tudo certo',
    Description: 'Um grupo Tuatara montou um posto avançado em uma fazenda abandonada. Você precisa expulsá-los de lá.'
  }],
  ['27', {
    DisplayName: 'Poço Infestado',
    TrackerText: 'O poço atrás do matagal está infestado de Devoradores',
    TrackerReturn: 'Diga à Rose que ela já pode ir buscar água',
    Description: 'Devoradores estão por toda parte, e um bando deles impede Rose de chegar ao poço. Você decide ajudar.'
  }],
  ['28', {
    DisplayName: 'O Monstro da Cabana',
    TrackerText: 'Um monstro invadiu a cabana do fazendeiro atrás da colina',
    TrackerReturn: 'Diga a Sugh que você cuidou do monstro',
    Description: 'Parece que todo tipo de monstro assola o povo local. Mas o que será que vive na cabana atrás desta colina?'
  }],
  ['29', {
    DisplayName: 'Dentes de Devorador',
    ProgressText: 'Dente de Devorador',
    TrackerText: 'Colete dentes de Devorador para reduzir o número das feras vegetais',
    TrackerReturn: 'Receba a recompensa com Odem',
    Description: 'Com a Rainha morta, é hora de reduzir os Devoradores e ajudar a encontrar um jeito de restaurar a terra.'
  }],
  ['30', {
    DisplayName: 'Colete Elmos Grandes',
    ProgressText: 'Elmo Grande',
    TrackerText: 'Caçe os Grandes Tuataras pelo Pântano da Rosa Negra',
    TrackerReturn: 'Receba a recompensa dos Elmos Grandes com Gran',
    Description: 'Colete elmos dos Tuataras mais brutais e mostre que os humanos estão reconquistando o Pântano da Rosa Negra.'
  }],
  ['31', {
    DisplayName: 'Colete Presas de Aranha',
    ProgressText: 'Presa de Aranha',
    TrackerText: 'Procure aranhas nas profundezas do pântano para ajudar a curandeira',
    TrackerReturn: 'Entregue as presas de aranha a Gretta e receba sua recompensa',
    Description: 'Gretta prepara um antídoto contra o veneno de aranha. Você decide coletar presas de aranha para ajudá-la.'
  }],
  ['133', {
    DisplayName: 'Pântano de Arachnae',
    TrackerText: 'Abra caminho pela estrada até o Castelo Hocke',
    TrackerReturn: 'Abra caminho até o Castelo Hocke',
    Description: 'Você precisa entrar no Castelo Hocke se quiser descobrir a verdade sobre os monstros que tomaram Ellyria.'
  }]
]);

const LEVEL_DISPLAY_NAME_PATCHES = new Map([
  ['SwampRoadConnectionMission', 'Pântano de Arachnae'],
  ['SwampRoadConnectionMissionHard', 'Pântano de Arachnae'],
  ['SRN_Mission1', 'Torre dos Tuatara'],
  ['SRN_Mission2', 'Mistério de Yornak'],
  ['SRN_Mission3', 'Despeito de Svar'],
  ['SRN_Mission4', 'Covil do Ooyak'],
  ['SRN_Mission5', 'Cidadela do Vizir'],
  ['SRN_Mission6', 'Clareira da Rainha Louca'],
  ['SRN_Mission7', 'O Grande Svath Verde']
]);

// ─── Funções de codificação/decodificação SWZ ─────────────────────────────────

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
  const pattern = new RegExp(`(<${tagName}[^>]*>)[\\s\\S]*?(<\\/${tagName}>)`);
  if (!pattern.test(entry)) {
    // Tag pode não existir em todas as missões — não fatal
    return entry;
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
      console.warn(`[patch-ptbr-brm-missiontypes-swz] AVISO: MissionID ${missionId} não encontrado no SWZ — pulando.`);
      continue;
    }

    const start = current.lastIndexOf('<MissionType>', idIndex);
    const end = current.indexOf('</MissionType>', idIndex) + '</MissionType>'.length;
    if (start < 0 || end < '</MissionType>'.length - 1) {
      throw new Error(`Não foi possível isolar MissionID ${missionId}`);
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

// ─── Main ─────────────────────────────────────────────────────────────────────

function patchLevelTypesXml(xml) {
  let changed = 0;
  let current = xml;

  for (const [levelName, displayName] of LEVEL_DISPLAY_NAME_PATCHES.entries()) {
    const levelTag = `<LevelType LevelName="${levelName}">`;
    const levelIndex = current.indexOf(levelTag);
    if (levelIndex < 0) {
      console.warn(`[patch-ptbr-brm-missiontypes-swz] AVISO: LevelName ${levelName} não encontrado no SWZ — pulando.`);
      continue;
    }

    const start = levelIndex;
    const end = current.indexOf('</LevelType>', levelIndex) + '</LevelType>'.length;
    if (start < 0 || end < '</LevelType>'.length - 1) {
      throw new Error(`Não foi possível isolar LevelName ${levelName}`);
    }

    const before = current.slice(start, end);
    const after = patchTag(before, 'DisplayName', displayName);
    if (after !== before) {
      current = `${current.slice(0, start)}${after}${current.slice(end)}`;
      changed += 1;
    }
  }

  return { xml: current, changed };
}

function main() {
  const swzPath = resolvePath(process.argv[2] || DEFAULT_SWZ);

  if (!fs.existsSync(swzPath)) {
    throw new Error(`SWZ não encontrado: ${swzPath}`);
  }

  const decoded = decodeSwz(fs.readFileSync(swzPath));
  const missionIndex = decoded.entries.findIndex((e) => e.rootName === 'MissionTypes');
  if (missionIndex < 0) {
    throw new Error('MissionTypes não encontrado no SWZ');
  }
  const levelIndex = decoded.entries.findIndex((e) => e.rootName === 'LevelTypes');
  if (levelIndex < 0) {
    throw new Error('LevelTypes não encontrado no SWZ');
  }

  const patchedMissionTypes = patchMissionTypesXml(decoded.entries[missionIndex].xml);
  const patchedLevelTypes = patchLevelTypesXml(decoded.entries[levelIndex].xml);

  if (!patchedMissionTypes.changed && !patchedLevelTypes.changed) {
    console.log('[patch-ptbr-brm-missiontypes-swz] Sem alterações necessárias.');
    return;
  }

  decoded.entries[missionIndex] = {
    ...decoded.entries[missionIndex],
    xml: patchedMissionTypes.xml
  };
  decoded.entries[levelIndex] = {
    ...decoded.entries[levelIndex],
    xml: patchedLevelTypes.xml
  };

  fs.writeFileSync(swzPath, encodeSwz(decoded.initialKey, decoded.entries));
  console.log(
    `[patch-ptbr-brm-missiontypes-swz] ${patchedMissionTypes.changed} missao(oes) e ${patchedLevelTypes.changed} level type(s) atualizados em ${swzPath}`
  );
}

main();
