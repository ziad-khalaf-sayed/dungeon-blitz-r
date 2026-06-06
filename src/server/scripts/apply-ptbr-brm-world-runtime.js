#!/usr/bin/env node
/**
 * apply-ptbr-brm-world-runtime.js
 * Aplica as traduções PT-BR do Mundo Aberto do Black Rose Mire:
 *   1. Atualiza NpcDialogues.pt-br.json (NPCs do overworld: bede, dane, gran, gretta,
 *      ield, kenelm, odem, palok, rose, srnmayor01/02/03, srnmerchant01/03,
 *      srntrainer01/03, sugh, yolaf)
 *   2. Adiciona diálogos de mobs/NPCs do overworld a DialogueTranslations.pt-br.json
 *   3. Corrige a string de masmorra bloqueada ("I haven't unlocked this dungeon yet.")
 *
 * Uso: node src/server/scripts/apply-ptbr-brm-world-runtime.js
 */

const fs = require('fs');
const path = require('path');

function repoRoot() {
  return path.resolve(__dirname, '..', '..', '..');
}

const NPC_DIALOGUES_PATH = path.join(repoRoot(), 'src', 'server', 'data', 'NpcDialogues.pt-br.json');
const DIALOGUE_TRANSLATIONS_PATH = path.join(repoRoot(), 'src', 'server', 'data', 'DialogueTranslations.pt-br.json');

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// ─── 1. NpcDialogues overworld – SwampRoadNorth ───────────────────────────────
// Cada array corresponde posicionalmente ao array en defaultLines da fonte.

const NPC_UPDATES = {
  bede: {
    displayName: 'Bede',
    defaultLines: [
      'Aquela costumava ser a estrada para Felbridge.',
      'Agora é o caminho para a morte certa.',
      'Espero que você consiga abrir caminho.'
    ]
  },
  dane: {
    defaultLines: [
      'O castelo do Lorde Yornak parece ainda estar habitado, embora não por humanos.',
      'O Castelo Yornak era o lar dos lordes desta região.',
      'Os últimos Lorde e Dama Yornak construíram o magnífico celeiro, o palácio e a universidade.',
      'É verdade, mas…',
      'Eles sempre mantiveram seu antigo castelo em bom estado.',
      'Era o refúgio seguro deles.',
      'Tem alguém lá dentro.',
      'Alguém que os Tuatara chamam de Yornak.',
      'Você sobreviveu ao Castelo Yornak.',
      'A família Yornak é mais uma história trágica.'
    ]
  },
  gran: {
    defaultLines: [
      'Você nos ajudaria a repelir os soldados Tuatara?',
      'Traga-me os elmos dos Comandantes Tuatara.',
      'Primeiro, para mostrar a eles que estamos assumindo o comando. Eles adoram seus elmos.',
      'E segundo, podemos usar o metal para forjar nossa própria armadura.',
      'Bingo! Exatamente.',
      'Obrigado! Agora esses lagartos sabem que não estamos brincando!',
      'É bom ter um|uma verdadeiro|verdadeira herói|heroína ao nosso lado!',
      'Talvez possamos levar a luta até essas bestas.',
      'E não só os Tuatara.',
      'Imagine essa terra livre do domínio dos monstros!'
    ]
  },
  gretta: {
    defaultLines: [
      'Meu antídoto contra o veneno de aranha precisa de presas de aranha.',
      'Se você me trouxer presas de aranha, eu conseguiria preparar um antídoto.',
      'Essas aranhas grandes não costumavam morar aqui.',
      'É por isso que eu odeio magia, sempre corrompendo tudo.',
      'Eu prefiro muito mais a alquimia.',
      'Obrigada, graças a você agora posso terminar o antídoto.',
      'Apesar de que vai levar alguns anos para nos livrarmos dessas aranhas.',
      'Se é que algum dia conseguiremos descobrir de onde elas vêm.'
    ]
  },
  ield: {
    defaultLines: [
      'Esses lagartos dão muita importância a esses estandartes.',
      'Os Tuatara se reúnem em torno de seus estandartes de guerra.',
      'Eles ficam ferozes quando hasteiam o estandarte.',
      'Os estandartes estão, de alguma forma, encantados.',
      'Se você capturar alguns deles, talvez eu consiga usar a magia deles contra eles.',
      'Perfeito. Acho que agora consigo costurar nossos próprios estandartes encantados.',
      'Agora só preciso de um bom design.',
      'Hm, obrigado, vou pensar melhor nisso.',
      'Ah, é mesmo?',
      'Sim... Bom, vou pensar em algumas opções.'
    ]
  },
  kenelm: {
    displayName: 'Kenelm',
    defaultLines: [
      'É escuro aqui embaixo.',
      'E molhado.',
      'Sinto falta da praia.'
    ]
  },
  odem: {
    defaultLines: [
      'As ruínas do Celeiro Real são a origem dos Devoradores.',
      'O Celeiro Real já foi uma das maravilhas do mundo.',
      'Mas agora o celeiro em ruínas está corrompido.',
      'Parece que todos os Devoradores vêm de lá.',
      'Se conseguirmos recuperar os campos de grãos, poderemos sustentar um exército inteiro.',
      'Você limpou o Celeiro Real!',
      'Essas plantas assassinas são intrigantes.',
      'Precisamos aprender mais sobre os Devoradores.',
      'Sim, mas elas crescem como ervas-daninhas.',
      'Se quisermos recuperar a terra, preciso saber mais.',
      'Colete os dentes dos maiores.',
      'Posso usá-los para preparar uma poção e envenená-los.',
      'Muito bem, obrigado!',
      'Nem quero imaginar o que o Hsalt fez para dar dentes às plantas.',
      'É aterrorizante só de imaginar.',
      'Mas é só nisso que consigo pensar.',
      'Para o que mais ele deu dentes?',
      'Cogumelos?',
      'Águas-vivas?',
      'Pedras?'
    ]
  },
  palok: {
    defaultLines: [
      'Um grupo de Tuatara se instalou em uma fazenda abandonada.',
      'Os lagartos tomaram conta dessa velha casa.',
      'Estão usando ela como base para lançar ataques.',
      'Eles também guardam suprimentos lá.',
      'Principalmente besouros secos e carne rançosa.',
      'Então, talvez você possa deixar isso lá.',
      'Bom... a menos que você goste desse tipo de comida.',
      'Sem julgamentos, claro.',
      'Obrigado!',
      'Vamos ficar de olho naquele lugar.',
      'Se aparecerem mais, nós cuidamos deles.',
      'Obrigado por não ter me trazido os besouros secos.',
      'Embora meu primo diga que são gostosos.',
      'Acho que devo experimentar antes de julgar.'
    ]
  },
  rose: {
    defaultLines: [
      'Os Devoradores estão por toda parte! Não consigo chegar ao poço.',
      'Você consegue afastar os devoradores do poço?',
      'É a única fonte de água potável nas redondezas.',
      'Esses monstros corromperam o rio.',
      'E os lagos também.',
      'Corromperiam até a chuva se pudessem.',
      'Ufa, obrigada!',
      'Obrigada por limpar o poço.',
      'Precisamos urgentemente de uma fonte de água confiável.'
    ]
  },
  // Abbod (primeiro prefeito/NPC principal da vila 1)
  srnmayor01: {
    defaultLines: [
      'Vamos fortificar nosso acampamento aqui, herói|heroína. Obrigado por nos liderar.',
      'Essa vila será a primeira de várias que vamos recuperar.',
      'Toda essa terra já foi um campo verdejante.',
      'Os goblins e sua magia transformaram o lugar em um pântano.',
      'Boa parte seria muito mais do que jamais imaginei.',
      'Um novo tipo de guerreiro monstruoso se ergue contra nós agora.',
      'Não são goblins que estamos enfrentando.',
      'Uma espécie de homens-réptil. Eles se autodenominam Tuatara.',
      'Isso é típico deles, são muito organizados.',
      'Eles tomaram uma torre aqui perto.',
      'Não conseguimos passar por eles.',
      'Espero que sim.',
      'Você mostrou aos Tuataras como os humanos lutam!',
      'O Patrulheiro Affric liderou um grupo para explorar o antigo bairro universitário.',
      'Affric acredita que a origem da corrupção está a leste.',
      'Alguém chamado Hsalt se estabeleceu na Cidadela de Wissen.',
      'Cuidado, a estrada está infestada de Tuatara e Devoradores.',
      'O general Tuatara estabeleceu sua base no castelo nas proximidades.',
      'O General Tuatara, Svar, está naquele antigo castelo.',
      'Afinal, o que um exército está fazendo nesse pântano?',
      'E, sendo o alvo mais próximo, isso me preocupa.',
      'O General Svar era um dragão!',
      'Os Tuatara são liderados por dragões de verdade, vivos.',
      'Isso quer dizer que existem mais dragões.',
      'Boa sorte com isso, vai precisar.',
      'Ainda bem que eu não sou você.'
    ]
  },
  // Affric (segundo prefeito/NPC vila 2)
  srnmayor02: {
    displayName: 'Affric',
    defaultLines: [
      'Você é amigo ou inimigo?',
      'Você traz alguma mensagem dos nossos amigos em Sark?',
      'Não podemos confiar em estranhos.',
      'Não podemos confiar em estranhos.',
      'Que bom te ver de novo, amigo|amiga.',
      'Sua lenda segue crescendo.',
      'Em breve, essa região irá acompanhá-lo|acompanhá-la em qualquer lugar.',
      'O Vizir dos Tuatara está criando carnissauros.',
      'O Vizir pode estar trabalhando para os generais dragões...',
      'Mas agora sabemos que ele é quem realmente está por trás da corrupção.',
      'Os experimentos mágicos do Vizir estão criando carnissauros.',
      'Ele está criando essas criaturas para servirem de montaria para os soldados Tuatara.',
      'Você conseguiu! Nenhum cavaleiro montado em carnissauro vai nos atormentar.',
      'O Vizir Hsalt está usando a biblioteca da Cidadela para fins malignos.',
      'O Vizir vai ficar furioso com você.',
      'Imagino que você vai atrás dele.',
      'Tenha cuidado. A magia do Vizir o torna tão perigoso quanto os dragões a quem ele serve.',
      'A biblioteca foi libertada!',
      'Gehrin e Odem acham que sabem onde está o General Tuatara.',
      'Temos mais soldados explorando o pântano.',
      'Gehrin e Odem acham que sabem onde está o outro general Tuatara.',
      'Provavelmente.',
      'Vá falar com eles, eles sabem mais do que eu.'
    ]
  },
  // Gehrin (terceiro prefeito/NPC vila 3)
  srnmayor03: {
    defaultLines: [
      'Ainda estamos explorando essa área.',
      'Mandaremos notícias quando soubermos mais.',
      'Que bom que você pôde vir.',
      'O outro general dos Tuatara está por perto.',
      'Mas ele é diferente do Svath.',
      'Vimos sinais de mortos-vivos a serviço dele.',
      'Há outro General, chamado Svath. Ele está no antigo palácio.',
      'O General Svath comanda todos esses Tuatara.',
      'Provavelmente, mas esse parece ser o irmão mais velho.',
      'E Svath não comanda apenas soldados Tuatara.',
      'Ele mexe com coisas mais assustadoras.',
      'Quero dizer, assustadoras tipo mortos-vivos.',
      'Você conseguiu deter a invasão dos dragões!',
      'Qual será seu próximo passo, #tn#?',
      'Agora que os Tuatara foram derrotados...',
      'Qual é o seu plano?',
      'Não consigo imaginar que alguém tenha sobrevivido à passagem da Legião Tuatara.'
    ]
  },
  srnmerchant01: {
    displayName: 'Caravan Dan',
    defaultLines: [
      'Saudações. Tenho algumas coisinhas que os lagartos ainda não roubaram.'
    ]
  },
  srnmerchant03: {
    displayName: 'Cynric',
    defaultLines: [
      'Não se aventure na selva sem estar preparado!'
    ]
  },
  srntrainer01: {
    displayName: 'Sara',
    defaultLines: [
      'Minha irmã falou bastante de você.',
      'Você é um caçador|caçadora de goblins implacável.'
    ]
  },
  srntrainer03: {
    displayName: 'Gina',
    defaultLines: [
      'A fim de uma aula, #tc#?'
    ]
  },
  sugh: {
    defaultLines: [
      'Tem algo grande naquela velha fazenda.',
      'Eu não sei o que é.',
      'Mas não acho que sejam os Tuatara.',
      'Imaginei que você gostaria de dar uma olhada.',
      'Porque eu realmente não quero.',
      'Eu já disse que parecia ser algo grande?',
      'Eca! Detesto aranhas! Obrigado!',
      'Era uma aranha gigantesca, não era?',
      'Eu detesto aranhas.',
      'Que bom que foi você e não eu!'
    ]
  },
  yolaf: {
    displayName: 'Yolaf',
    defaultLines: [
      'Minha mãe veio dessa terra.',
      'Ela dizia que era o orgulho de Ellyria.',
      'Agora é um pântano cheio de ruínas.',
      'Eu quero consertar isso, por ela.',
      'Quero que seja como é nos meus sonhos.'
    ]
  }
};

// ─── 2. Diálogos de mobs/NPCs do overworld (LevelsSRN.swf) ────────────────────
// + correção da string de masmorra bloqueada

const DIALOGUE_UPDATES = {
  // Masmorra ainda bloqueada
  'I haven\'t unlocked this dungeon yet.': 'Ainda não desbloqueei esta masmorra.',

  // ── Overworld mobs (SRN rooms) ──────────────────────────────────────────────
  'Get the human': 'Peguem o humano|a humana!',
  'Maybe it knows how to find the Yornak': 'Talvez ele|ela saiba como encontrar o Yornak.',
  'Do not challenge the Tuatara!': 'Não desafie os Tuatara!',
  'Get him|her!': 'Peguem ele|ela!',
  'The Tuatara Legion claims this land!': 'A Legião Tuatara reivindica essas terras!',
  'Lizards Attack!': 'Ataque dos lagartos!',
  'To me, Tuatara!': 'Comigo, Tuatara!',
  'The Generals want his|her head!': 'Os Generais querem a cabeça dele|dela!',
  'The human spy!': 'O espião humano!|A espiã humana!',
  'Your kind should be in chains, slave!': 'Sua espécie deveria estar acorrentada, escravo|escrava!',

  // ── Sala de Disciplinas / Nexus (SRNDisciplines) ────────────────────────────
  'I believe The Nexus of Power is in these archives.': 'Acredito que o Nexus do Poder esteja nesses arquivos.',
  'I\'ll have a word with them.': 'Vou ter uma conversa com eles.',
  'Those spirit guardians won\'t let me explore farther.': 'Esses espíritos guardiões não me deixam explorar mais a fundo.',
  'You\'re not sure?': 'Você não tem certeza?',
  'The Nexus is forbidden to you.': 'O Nexus está proibido para você.',
  'None may approach The Nexus.': 'Ninguém pode se aproximar do Nexus.',
  'Its revelations would consume you.': 'Suas revelações iriam te consumir.',
  'Your soul cannot withstand The Nexus...': 'Sua alma não é capaz de resistir ao Nexus...',
  'But abandon your quest for The Nexus.': 'Mas abandone sua busca pelo Nexus.',
  'I applaud your quest for knowledge...': 'Aplaudo sua busca pelo conhecimento...',
  'Join us in the archive...': 'Junte-se a nós nos arquivos...',
  'There is an eternity of wisdom here.': 'Há uma infinidade de sabedoria aqui.',
  'It will consume you.': 'Isso vai te consumir.',
  'Untamed knowledge is dangerous...': 'O conhecimento sem limites é perigoso...',
  'It feels like lightning is about to strike.': 'Parece que um raio está prestes a cair.',
  'Something\'s happening down there.': 'Está rolando alguma coisa lá embaixo.',
  'I seek the power to cleanse this land.': 'Busco o poder para purificar essa terra.',
  'Just what I want.': 'É exatamente o que eu queria.',
  'The Nexus connects to many powers...': 'O Nexus se conecta a muitos poderes...',
  'Which is why we must stop you.': 'É por isso que precisamos impedi-lo|impedi-la.',
  'You seek wisdom, stranger.': 'Você busca sabedoria, forasteiro|forasteira.',
  'A Mage?': 'Um Mago?|Uma Maga?',
  'A Paladin?': 'Um Paladino?|Uma Paladina?',
  'A Rogue?': 'Um Ladino?|Uma Ladina?',
  'Another failed hero.': 'Mais um herói fracassado.|Mais uma heroína fracassada.',
  'Another failed mage.': 'Mais um mago fracassado.|Mais uma maga fracassada.',
  'Another failed rogue.': 'Mais um ladino fracassado.|Mais uma ladina fracassada.',
  'Another spirit blocks my path.': 'Mais um espírito bloqueando meu caminho.',
  'I could not do my duty.': 'Não consegui cumprir meu dever.',
  'I was like you once.': 'Eu já fui como você.',
  'I wasn\'t strong enough...': 'Eu não fui forte o suficiente...',
  'The Flames of Justice Consumed me.': 'As Chamas da Justiça me consumiram.',
  'The Flames of Power Consumed me.': 'As Chamas do Poder me consumiram.',
  'The fires cannot be controlled.': 'As chamas não podem ser controladas.',
  'The path to the Nexus is open.': 'O caminho para o Nexus está aberto.',
  'The secrets of the Shadow consumed me.': 'Os segredos das Sombras me consumiram.',
  'The venom cannot be controlled.': 'O veneno não pode ser controlado.',
  'We\'ll see if I\'m stronger than these failed heroes were.': 'Vamos ver se sou mais forte do que esses heróis fracassados.',
  'Do you believe you can control The Nexus?': 'Você acredita que pode controlar o Nexus?',
  'I am going to try.': 'Só tem um jeito de descobrir.',
  'I hope that\'s a good thing.': 'Espero que isso seja uma coisa boa.',
  'It\'s power will surely corrupt you...': 'Seu poder certamente vai te corromper...',
  'Let me save you from yourself, mortal.': 'Deixe-me salvá-lo|salvá-la de si mesmo|mesma, mortal.',
  'Nexus Gatekeeper': 'Guardião do Nexus',
  'Slaves of The Nexus, rise!': 'Escravos do Nexus, levantem-se!',
  'The Nexus is yours...': 'O Nexus é seu...'
};

// ─── Main ─────────────────────────────────────────────────────────────────────

function applyNpcDialogues() {
  const data = loadJson(NPC_DIALOGUES_PATH);
  const level = data.levels['SwampRoadNorth'];
  if (!level) {
    throw new Error('SwampRoadNorth não encontrado em NpcDialogues.pt-br.json');
  }

  let updated = 0;
  for (const [npcId, update] of Object.entries(NPC_UPDATES)) {
    if (!level[npcId]) {
      level[npcId] = {};
    }
    const before = JSON.stringify(level[npcId]);
    if (update.displayName !== undefined) {
      level[npcId].displayName = update.displayName;
    }
    level[npcId].defaultLines = update.defaultLines;
    if (JSON.stringify(level[npcId]) !== before) {
      updated += 1;
    }
  }

  // Também atualiza SwampRoadNorthHard com as mesmas traduções
  const levelHard = data.levels['SwampRoadNorthHard'];
  if (levelHard) {
    for (const [npcId, update] of Object.entries(NPC_UPDATES)) {
      if (levelHard[npcId]) {
        if (update.displayName !== undefined) {
          levelHard[npcId].displayName = update.displayName;
        }
        levelHard[npcId].defaultLines = update.defaultLines;
      }
    }
  }

  saveJson(NPC_DIALOGUES_PATH, data);
  console.log(`[apply-ptbr-brm-world-runtime] NpcDialogues: ${updated} NPC(s) atualizados.`);
}

function applyDialogueTranslations() {
  const data = loadJson(DIALOGUE_TRANSLATIONS_PATH);

  let added = 0;
  let replaced = 0;
  for (const [en, ptbr] of Object.entries(DIALOGUE_UPDATES)) {
    if (data.translations[en] === ptbr) continue;
    if (data.translations[en] === undefined) added += 1;
    else replaced += 1;
    data.translations[en] = ptbr;
  }

  if (added + replaced > 0) {
    saveJson(DIALOGUE_TRANSLATIONS_PATH, data);
    console.log(
      `[apply-ptbr-brm-world-runtime] DialogueTranslations: ${added} adicionadas, ${replaced} corrigidas.`
    );
  } else {
    console.log('[apply-ptbr-brm-world-runtime] DialogueTranslations: sem alterações.');
  }
}

applyNpcDialogues();
applyDialogueTranslations();
console.log('[apply-ptbr-brm-world-runtime] Concluído.');
