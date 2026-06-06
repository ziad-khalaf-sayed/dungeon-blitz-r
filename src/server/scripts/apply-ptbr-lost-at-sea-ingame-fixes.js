const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const dialoguePath = path.join(dataDir, 'DialogueTranslations.pt-br.json');
const missionPath = path.join(dataDir, 'MissionDialogues.pt-br.json');

const dialogue = JSON.parse(fs.readFileSync(dialoguePath, 'utf8'));
const missions = JSON.parse(fs.readFileSync(missionPath, 'utf8'));
const t = dialogue.translations ?? dialogue;
const m = missions.missions ?? missions;

const updates = {
  'Lost at Sea': 'Perdidos no Mar',
  'Lost At Sea': 'Perdidos no Mar',
  "Fink's Trusty Map": 'Mapa Confiável de Fink',
  'Use this map to help guide you in questing.': 'Use este mapa para se orientar.',
  'Captain Fink gives you his map': 'Capitão Fink te entrega o mapa.',
  'Click the quest tracker to open your new map': 'Clique no guia de missão para abrir seu mapa',

  'There it is again!': 'Lá vêm eles de novo!',
  'The goblins are running for that coast.': 'Os goblins estão fugindo em direção àquela costa.',
  "That's the coast of Ellyria. My destination.": 'Aquela é a costa de Ellyria. É o meu destino.',
  'What?! Ellyria was overrun by the monster hordes fifty years ago.': 'O quê?! Ellyria foi tomada por hordas de monstros há cinquenta anos.',
  'Head for that village, Captain.': 'Leve a gente até aquela vila, Capitão.',
  'Rocks!!!': 'Rochas à vista!!!',
  "I see 'em. Hold on!": 'Estou vendo elas. Segure firme!',
  '@Back to the deep with you, trog scum!': '@Volte para as profundezas, sua escória Trog!',
  'Back to the deep with you, trog scum!': 'Que o Kraken te arraste para as profundezas!',
  'These seas are ours!': 'Esses mares são nossos!',
  'This ship is going down!': 'Esse barco vai afundar!',
  "Be alert, Death Eyes mean goblins aren't far away.": 'Fique alerta. Olhos da Morte significam que os goblins estão por perto.',
  'Kraken Raiders! Off the bow!': 'Saqueadores do Kraken! À proa!',
  "Hold her steady, Captain. I'll repel all boarders!": 'Mantenha o barco firme, Capitão. Eu cuido desses goblins imundos!',
  'Humans! What are humans doing here!?!': 'Humanos!? O que humanos estão fazendo aqui?!',
  "Sink them! We can't be followed!": 'Afundem eles! Não podemos deixar que sigam a gente!',
  'CHARGE!': 'ATACAR!',
  'Boarders!': 'Invasores a bordo!',
  "Steady, Captain. We'll weather this storm.": 'Mantenha-se firme, Capitão. A gente consegue atravessar essa tempestade.',
  "It's not the storm I fear.": 'Não é a tempestade que eu temo, marujo|maruja.',
  'No ship has sailed these waters since the Goblin Monster Fleets appeared.': 'Nenhum barco navegou por estas águas desde que as Frotas de Monstros Goblins apareceram.',
  'True, but the Goblin Horde is defeated. The war is over.': 'É verdade, mas a Horda de Goblins foi derrotada. A guerra acabou.',
  "Aye, back home, but we're far from home.": 'Sim, lá na terra natal. Mas estamos bem longe de casa.',
  'Goblin Death Eyes! From the East!': 'Olhos da Morte dos Goblins! Vindos do leste!',
  'Shoot\'em down!': 'Derruba eles!',
  'Wretched things!': 'Criaturas detestáveis!',
  'Incoming!': 'Lá vem!',
  'Oh no...': 'Ah, não...',
  'Their Kraken...': 'Eles não, o Kraken deles...',
  'Tehehe': 'Hehehe',
  'Tehehe!': 'Hehehe!',
  'Tehehehe': 'Hehehehe',
  'Yes! They caught her on the beach!': 'Sim! Pegaram ela na praia!',
  'The keep is this way!': 'O forte fica por aqui!',
  "You're a natural!": 'Você tem um talento natural!',
  "Looks like you know what you're doing.": 'Parece que você sabe o que está fazendo.',
  "Thank you! You're quite the goblin slayer.": 'Obrigada! Você é um|uma baita caçador|caçadora de goblins.',
  "This time you're on your own!": 'Daqui pra frente, você está por sua conta e risco!',
  "Now we're talking!": 'É disso que eu estou falando!',
  "You're no hero!": 'Você não é nenhum herói!',
};

let changed = 0;
for (const [en, pt] of Object.entries(updates)) {
  if (t[en] !== pt) {
    t[en] = pt;
    changed++;
  }
}

if (m['1']) {
  m['1'].ActiveText = 'Você pode encontrar a vila no mapa.=@Vou até lá ver se aqueles são mesmo sobreviventes.=É só seguir para o leste que você vai encontrar ela.=Vou tentar consertar a Niobe.';
}

fs.writeFileSync(dialoguePath, `${JSON.stringify(dialogue, null, 2)}\n`, 'utf8');
fs.writeFileSync(missionPath, `${JSON.stringify(missions, null, 2)}\n`, 'utf8');
JSON.parse(fs.readFileSync(dialoguePath, 'utf8'));
JSON.parse(fs.readFileSync(missionPath, 'utf8'));
console.log(`Applied Lost at Sea in-game fixes: ${changed}`);
