#!/usr/bin/env node
/**
 * apply-ptbr-brm-runtime.js
 * Aplica as traduções PT-BR revisadas do mapa Black Rose Mire:
 *   1. Atualiza MissionDialogues.pt-br.json para as missões 8 e 15–31
 *   2. Adiciona entradas de diálogo LevelsSRN.swf ao DialogueTranslations.pt-br.json
 *
 * Uso: node src/server/scripts/apply-ptbr-brm-runtime.js
 */

const fs = require('fs');
const path = require('path');

function repoRoot() {
  return path.resolve(__dirname, '..', '..', '..');
}

const MISSION_DIALOGUES_PATH = path.join(
  repoRoot(), 'src', 'server', 'data', 'MissionDialogues.pt-br.json'
);
const DIALOGUE_TRANSLATIONS_PATH = path.join(
  repoRoot(), 'src', 'server', 'data', 'DialogueTranslations.pt-br.json'
);

// ─── 1. Mission Dialogue Updates ──────────────────────────────────────────────
// Formato: frases separadas por "="; linhas do Jogador com prefixo "@"

const MISSION_UPDATES = {
  '8': {
    OfferText: 'Com Fim do Lobo segura, podemos recuperar mais terras das mãos do mal.',
    ActiveText: [
      'Graças a você, estamos de volta à ativa e prontos para lutar!',
      '@Fico feliz em ouvir isso. Pretendo acabar com os goblins desse lado do oceano.',
      '@Seu povo vai me ajudar?',
      'Claro! A família de Abbod é da região a leste daqui.',
      'Ele está ansioso para recuperar o legado da família.',
      '@Excelente. E eu preciso descobrir mais sobre as Terras Adormecidas.',
      'Nunca ouvi falar delas.',
      'Mas talvez haja algum registro nos arquivos da Cidadela de Wissen.',
      '@Então vou libertar a cidadela e também as terras de Abbod.',
      '@Diga a Abbod que encontro ele lá!',
      'Vou avisá-lo assim que voltar à vila, Campeão|Campeã.'
    ].join('='),
    ReturnText: 'Vamos fortificar nosso acampamento aqui, herói|heroína. Obrigado por nos liderar.',
    PraiseText: [
      'Essa vila será a primeira de várias que vamos recuperar.',
      '@Temos muitas batalhas difíceis pela frente, mas vamos conseguir.',
      'Toda essa terra já foi um campo verdejante.',
      'Os goblins e sua magia transformaram o lugar em um pântano.',
      '@O que foi feito com magia pode ser desfeito.',
      '@Juntos, vamos restaurar essa terra.',
      '@Bom, pelo menos boa parte dela.',
      'Boa parte seria muito mais do que jamais imaginei.'
    ].join('=')
  },
  '15': {
    OfferText: 'Um novo tipo de guerreiro monstruoso se ergue contra nós agora.',
    ActiveText: [
      'Não são goblins que estamos enfrentando.',
      '@Não são goblins? Então com o que estamos lidando?',
      'Uma espécie de homens-réptil. Eles se autodenominam Tuatara.',
      '@Tuatara... Já li esse nome em contos antigos. Soldados temíveis.',
      'Isso é típico deles, são muito organizados.',
      'Eles tomaram uma torre aqui perto.',
      'Não conseguimos passar por eles.',
      '@Bom, eu consigo passar por eles.',
      'Espero que sim.',
      '@Eu também. Só há um jeito de descobrir.'
    ].join('='),
    ReturnText: 'Você mostrou aos Tuataras como os humanos lutam!'
  },
  '16': {
    OfferText: 'O castelo do Lorde Yornak parece ainda estar habitado, embora não por humanos.',
    ActiveText: [
      'O Castelo Yornak era o lar dos lordes desta região.',
      'Os últimos Lorde e Dama Yornak construíram o magnífico celeiro, o palácio e a universidade.',
      '@Sim, eles eram conhecidos por sua riqueza e gastos extravagantes, eu sei.',
      'É verdade, mas…',
      'Eles sempre mantiveram seu antigo castelo em bom estado.',
      'Era o refúgio seguro deles.',
      '@Talvez haja alguns sobreviventes por lá também, quem sabe.',
      'Tem alguém lá dentro.',
      'Alguém que os Tuatara chamam de Yornak.',
      '@Yornak!? Será que é um herdeiro? Vou dar uma olhada.'
    ].join('='),
    ReturnText: 'Você sobreviveu ao Castelo Yornak.',
    PraiseText: [
      'A família Yornak é mais uma história trágica.',
      '@As invasões das Terras Adormecidas corromperam tudo.',
      '@Fico feliz por finalmente ter lhes trazido paz.'
    ].join('=')
  },
  '17': {
    OfferText: 'O Patrulheiro Affric liderou um grupo para explorar o antigo bairro universitário.',
    ActiveText: [
      'Affric acredita que a origem da corrupção está a leste.',
      'Alguém chamado Hsalt se estabeleceu na Cidadela de Wissen.',
      '@Eu mesmo|mesma queria dar uma olhada por lá.',
      '@Vou dar uma olhada no que ele descobriu.',
      'Cuidado, a estrada está infestada de Tuatara e Devoradores.'
    ].join('='),
    ReturnText: 'Que bom te ver de novo, amigo|amiga.',
    PraiseText: [
      'Sua lenda segue crescendo.',
      'Em breve, essa região irá acompanhá-lo|acompanhá-la em qualquer lugar.'
    ].join('=')
  },
  '18': {
    OfferText: 'O Vizir dos Tuatara está criando carnissauros.',
    ActiveText: [
      'O Vizir pode estar trabalhando para os generais dragões...',
      'Mas agora sabemos que ele é quem realmente está por trás da corrupção.',
      'Os experimentos mágicos do Vizir estão criando carnissauros.',
      '@Aquelas coisas meio lagarto, meio cavalo?',
      'Ele está criando essas criaturas para servirem de montaria para os soldados Tuatara.',
      '@Elas dariam muito trabalho até para os cavaleiros da terra natal.',
      '@Preciso acabar com esse programa de criação de monstros agora mesmo.'
    ].join('='),
    ReturnText: 'Você conseguiu! Nenhum cavaleiro montado em carnissauro vai nos atormentar.'
  },
  '19': {
    OfferText: 'O Vizir Hsalt está usando a biblioteca da Cidadela para fins malignos.',
    ActiveText: [
      'O Vizir vai ficar furioso com você.',
      '@E eu estou ainda mais furioso|furiosa com ele.',
      '@Ele corrompeu a sabedoria da Cidadela para fins malignos.',
      'Imagino que você vai atrás dele.',
      '@E você acertou. Vou retomar a biblioteca para todos nós.',
      'Tenha cuidado. A magia do Vizir o torna tão perigoso quanto os dragões a quem ele serve.'
    ].join('='),
    ReturnText: 'A biblioteca foi libertada!'
  },
  '20': {
    OfferText: 'O general Tuatara estabeleceu sua base no castelo nas proximidades.',
    ActiveText: [
      'O General Tuatara, Svar, está naquele antigo castelo.',
      '@Esse Svar parece ser um dos líderes importantes deles.',
      '@Vou enfrentá-lo e descobrir de onde vêm esses soldados reptilianos.',
      'Afinal, o que um exército está fazendo nesse pântano?',
      '@Não tenho certeza, mas exércitos não ficam parados em um lugar só.',
      '@Exércitos desse tamanho existem para atacar alguém.',
      'E, sendo o alvo mais próximo, isso me preocupa.'
    ].join('='),
    ReturnText: 'O General Svar era um dragão!',
    PraiseText: [
      'Os Tuatara são liderados por dragões de verdade, vivos.',
      '@Isso mesmo, bem vivos, o que não é uma boa notícia.',
      'Isso quer dizer que existem mais dragões.',
      '@Provavelmente maiores também.',
      'Boa sorte com isso, vai precisar.',
      'Ainda bem que eu não sou você.'
    ].join('=')
  },
  '21': {
    OfferText: 'Gehrin e Odem acham que sabem onde está o General Tuatara.',
    ActiveText: [
      'Temos mais soldados explorando o pântano.',
      'Gehrin e Odem acham que sabem onde está o outro general Tuatara.',
      '@Outro dragão? Fala sério.',
      'Provavelmente.',
      'Vá falar com eles, eles sabem mais do que eu.'
    ].join('='),
    ReturnText: 'Que bom que você pôde vir.',
    PraiseText: [
      'O outro general dos Tuatara está por perto.',
      'Mas ele é diferente do Svath.',
      '@Diferente em que sentido?',
      'Vimos sinais de mortos-vivos a serviço dele.',
      '@Que ótimo. Sinto que Nephit está por trás disso.'
    ].join('=')
  },
  '22': {
    OfferText: 'Há outro General, chamado Svath. Ele está no antigo palácio.',
    ActiveText: [
      'O General Svath comanda todos esses Tuatara.',
      '@Svath e Svar? Eles devem ser irmãos.',
      'Provavelmente, mas esse parece ser o irmão mais velho.',
      'E Svath não comanda apenas soldados Tuatara.',
      'Ele mexe com coisas mais assustadoras.',
      '@Quer dizer, além de aranhas gigantes e plantas carnívoras?',
      'Quero dizer, assustadoras tipo mortos-vivos.',
      '@Ótimo, mais um coveiro como Nephit.',
      '@Uma invasão de dragões e fantasmas estragaria a semana de qualquer um.'
    ].join('='),
    ReturnText: 'Você conseguiu deter a invasão dos dragões!'
  },
  '23': {
    OfferText: 'Qual será seu próximo passo, #tn#?',
    ActiveText: [
      'Agora que os Tuatara foram derrotados...',
      'Qual é o seu plano?',
      '@Vou seguir para o Castelo Hocke.',
      '@Tenho certeza de que agora só restam monstros e ruínas por lá.',
      'Não consigo imaginar que alguém tenha sobrevivido à passagem da Legião Tuatara.',
      '@E aquele coveiro, Nephit, sem dúvida, está tramando alguma coisa.',
      '@Preciso entrar naquele castelo...',
      '@Se eu quiser descobrir de onde esses monstros realmente vêm.'
    ].join('='),
    ReturnText: 'Espere aí, estranho. Quem é você?',
    PraiseText: 'Você fez mudanças incríveis por aqui.'
  },
  '24': {
    OfferText: 'As ruínas do Celeiro Real são a origem dos Devoradores.',
    ActiveText: [
      'O Celeiro Real já foi uma das maravilhas do mundo.',
      '@Toda essa região era o celeiro do império.',
      'Mas agora o celeiro está em ruínas e corrompido.',
      'Parece que todos os Devoradores vêm de lá.',
      '@Então, minha próxima tarefa será arrancá-los pela raiz.',
      'Se conseguirmos recuperar os campos de grãos, poderemos sustentar um exército inteiro.',
      '@Só preciso acabar com um exército de plantas assassinas primeiro.'
    ].join('='),
    ReturnText: 'Você limpou o Celeiro Real!'
  },
  '25': {
    OfferText: 'Esses lagartos dão muita importância a esses estandartes.',
    ActiveText: [
      'Os Tuatara se reúnem em torno de seus estandartes de guerra.',
      'Eles ficam ferozes quando hasteiam o estandarte.',
      '@E mais organizados do que os goblins jamais foram.',
      'Os estandartes estão, de alguma forma, encantados.',
      'Se você capturar alguns deles, talvez eu consiga usar a magia deles contra eles.',
      '@Poderíamos usar nossos próprios estandartes mágicos para reconquistar o território!'
    ].join('='),
    ReturnText: 'Perfeito. Acho que agora consigo costurar nossos próprios estandartes encantados.',
    PraiseText: [
      'Agora só preciso de um bom design.',
      '@Se quiser usar um lindo retrato meu, fique à vontade.',
      'Hm, obrigado, vou pensar melhor nisso.',
      '@Tenho um perfil bem inspirador, sabe?',
      'Ah, é mesmo?',
      'Sim... Bom, vou pensar em algumas opções.'
    ].join('=')
  },
  '26': {
    OfferText: 'Um grupo de Tuatara se instalou em uma fazenda abandonada.',
    ActiveText: [
      'Os lagartos tomaram conta dessa velha casa.',
      'Estão usando ela como base para lançar ataques.',
      'Eles também guardam suprimentos lá.',
      'Principalmente besouros secos e carne rançosa.',
      'Então, talvez você possa deixar isso lá.',
      'Bom... a menos que você goste desse tipo de comida.',
      'Sem julgamentos, claro.'
    ].join('='),
    ReturnText: 'Obrigado!',
    PraiseText: [
      'Vamos ficar de olho naquele lugar.',
      'Se aparecerem mais, nós cuidamos deles.',
      'Obrigado por não ter me trazido os besouros secos.',
      'Embora meu primo diga que são gostosos.',
      'Acho que devo experimentar antes de julgar.'
    ].join('=')
  },
  '27': {
    OfferText: 'Os Devoradores estão por toda parte! Não consigo chegar ao poço.',
    ActiveText: [
      'Você consegue afastar os devoradores do poço?',
      'É a única fonte de água potável nas redondezas.',
      'Esses monstros corromperam o rio.',
      'E os lagos também.',
      'Corromperiam até a chuva se pudessem.'
    ].join('='),
    ReturnText: 'Ufa, obrigada!',
    PraiseText: [
      'Obrigada por limpar o poço.',
      'Precisamos urgentemente de uma fonte de água confiável.'
    ].join('=')
  },
  '28': {
    OfferText: 'Tem algo grande naquela velha fazenda.',
    ActiveText: [
      'Eu não sei o que é.',
      'Mas não acho que sejam os Tuatara.',
      'Imaginei que você gostaria de dar uma olhada.',
      'Porque eu realmente não quero.',
      'Eu já disse que parecia ser algo grande?'
    ].join('='),
    ReturnText: 'Eca! Detesto aranhas! Obrigado!',
    PraiseText: [
      'Era uma aranha gigantesca, não era?',
      'Eu detesto aranhas.',
      'Que bom que foi você e não eu!'
    ].join('=')
  },
  '29': {
    OfferText: 'Essas plantas assassinas são intrigantes.',
    ActiveText: [
      'Precisamos aprender mais sobre os Devoradores.',
      '@Eu destruí a origem dessas plantas malditas.',
      'Sim, mas elas crescem como ervas-daninhas.',
      'Se quisermos recuperar a terra, preciso saber mais.',
      'Colete os dentes dos maiores.',
      'Posso usá-los para preparar uma poção e envenená-los.',
      '@Acho que seria melhor para todos nós se essas plantas não tivessem dentes.'
    ].join('='),
    ReturnText: 'Muito bem, obrigado!',
    PraiseText: [
      'Nem quero imaginar o que o Hsalt fez para dar dentes às plantas.',
      'É aterrorizante só de imaginar.',
      'Mas é só nisso que consigo pensar.',
      'Para o que mais ele deu dentes?',
      'Cogumelos?',
      'Águas-vivas?',
      'Pedras?'
    ].join('=')
  },
  '30': {
    OfferText: 'Você nos ajudaria a repelir os soldados Tuatara?',
    ActiveText: [
      'Traga-me os elmos dos Comandantes Tuatara.',
      '@Hmm... e por que você quer os elmos deles mesmo?',
      'Primeiro, para mostrar a eles que estamos assumindo o comando. Eles adoram seus elmos.',
      'E segundo, podemos usar o metal para forjar nossa própria armadura.',
      '@E em terceiro lugar, isso vai deixar eles furiosos!',
      'Bingo! Exatamente.'
    ].join('='),
    ReturnText: 'Obrigado! Agora esses lagartos sabem que não estamos brincando!',
    PraiseText: [
      'É bom ter um|uma verdadeiro|verdadeira herói|heroína ao nosso lado!',
      'Talvez possamos levar a luta até essas bestas.',
      'E não só os Tuatara.',
      'Imagine essa terra livre do domínio dos monstros!'
    ].join('=')
  },
  '31': {
    OfferText: 'Meu antídoto contra o veneno de aranha precisa de presas de aranha.',
    ActiveText: [
      'Se você me trouxer presas de aranha, eu conseguiria preparar um antídoto.',
      '@Interessante, isso com certeza seria muito útil.',
      'Essas aranhas grandes não costumavam morar aqui.',
      '@Elas foram corrompidas por uma magia nefasta.',
      'É por isso que eu odeio magia, sempre corrompendo tudo.',
      'Eu prefiro muito mais a alquimia.'
    ].join('='),
    ReturnText: 'Obrigada, graças a você agora posso terminar o antídoto.',
    PraiseText: [
      'Apesar de que vai levar alguns anos para nos livrarmos dessas aranhas.',
      'Se é que algum dia conseguiremos descobrir de onde elas vêm.'
    ].join('=')
  }
};

// ─── 2. SWF Dialogue Translations (LevelsSRN.swf) ────────────────────────────
// Chave = texto original EN; Valor = tradução PT-BR

const SWF_DIALOGUE_UPDATES = {
  // ── Tower of the Tuatara (SRNM01) ──────────────────────────────────────────
  'A human spy.': 'Um|Uma espião|espiã humano|humana.',
  'And General Svar will promote me bringing him your head': 'E o General Svar vai me promover quando eu levar sua cabeça a ele.',
  'General Svar will crush you., human.': 'O General Svar vai te esmagar, humano|humana.',
  'I won this battle, I\'ll win the war.': 'Venci essa batalha, vou vencer a guerra.',
  'Now the war begins!': 'Agora a guerra começa!',
  'Tuatara Commander': 'Comandante Tuatara',
  'Tuatara! To Arms!': 'Tuatara! Às armas!',
  'You cannot win this war.': 'Você não pode vencer essa guerra.',
  'You humans will be slaves once again...': 'Vocês, humanos, voltarão a ser escravos...',
  'A human!': 'Um|Uma humano|humana!',
  'TO ARMS! TO ARMS!!!': 'ÀS ARMAS! ÀS ARMAS!!!',
  'Your kind has finally crawled off the beach!': 'Sua espécie finalmente rastejou para fora da praia!',
  'General Svar will promote us!': 'O General Svar vai nos promover!',
  'Kill the human!': 'Matem o|a humano|humana!',
  'Bring the spiders!': 'Tragam as aranhas!',
  'I hear humans hate spiders!': 'Ouvi dizer que humanos odeiam aranhas!',
  'A chance to fight a human!': 'Uma chance de lutar contra um humano!',
  'Good! We need the practice!': 'Ótimo! Precisamos praticar!',
  'Tuatara Legion, Attack!': 'Legião Tuatara, ao ataque!',
  'Is that what humans look like?': 'É assim que humanos se parecem?',
  'Remember your training!': 'Lembrem-se do treinamento!',
  'There he|she is.': 'Lá está ele|ela.',
  'These humans can really fight.': 'Esses humanos sabem mesmo como lutar.',
  'We need to warn the generals.': 'Precisamos avisar os generais.',
  'A treat for your lunch, pets!': 'Um petisco para o almoço de vocês, bichinhos!',
  'Bleed him|her dry!': 'Sangrem ele|ela até secar!',
  'Are you really human?': 'Você é mesmo humano|humana?',
  'You smell more delicious than I imagined.': 'Você tem um cheiro mais delicioso do que eu imaginava.',
  'The Tuatara Legion will prevail!': 'A Legião Tuatara prevalecerá!',
  'We Tuatara stand against you!': 'Nós, Tuatara, nos erguemos contra você!',
  'Destroy the assassin!': 'Acabem com o|a assassino|assassina!',
  'Our numbers are infinite!': 'Nossos números são infinitos!',
  'What the?': 'Que diabos...?',
  'You are no match for the Tuatara Legion!': 'Você não é páreo para a Legião Tuatara!',
  'A human spy!': 'Um|Uma espião|espiã humano|humana!',
  'For the Glory of Svar and Svath!': 'Pela glória de Svar e Svath!',
  'Legion, stand fast!': 'Legião, mantenham posição!',
  'Stop him|her!': 'Parem ele|ela!',
  'Warn the Commander!': 'Avisem o Comandante!',
  // ── Mystery of the Yornak (SRNM02) ─────────────────────────────────────────
  'Prepare to be fertilizer, human!': 'Prepare-se para virar adubo, humano|humana!',
  'You\'ll find him a changed man.': 'Você vai ver que ele mudou completamente.',
  'You\'ve come to release Lord Yornak?': 'Você veio para libertar o Lorde Yornak?',
  'Perhaps it\'s the work of the Vizier those guards mentioned.': 'Talvez seja obra do Vizir que aqueles guardas mencionaram.',
  'Some foul magic created these over-sized spiders.': 'Alguma magia vil criou essas aranhas gigantescas.',
  'This must\'ve been Lord Yornak\'s gardens.': 'Esses devem ter sido os jardins do Lorde Yornak.',
  'That tower up ahead was probably Lord Yornack\'s quarters.': 'Aquela torre ali à frente provavelmente eram os aposentos do Lorde Yornak.',
  'Halt, human!': 'Alto lá, humano|humana!',
  'The Vizier forbids anyone to see Yornak.': 'O Vizir proíbe qualquer um de ver Yornak.',
  'The experiment isn\'t finished yet!': 'O experimento ainda não terminou!',
  'The human! He|She can\'t stop the Vizier\'s experiment!': 'O|A humano|humana! Ele|Ela não pode impedir o experimento do Vizir!',
  'You\'ll end up like Lord Yornak.': 'Você vai acabar como o Lorde Yornak.',
  'Your kind doesn\'t belong here, human.': 'Sua espécie não tem lugar aqui, humano|humana.',
  'Could it be Lord Yornak?': 'Será que é o Lorde Yornak?',
  'I think I hear a human voice on the next floor...': 'Acho que ouvi uma voz humana no andar de cima...',
  'Another subject for the Vizier\'s experiments?': 'Mais um objeto para os experimentos do Vizir?',
  'Or just plant food?': 'Ou apenas adubo para as plantas?',
  'By the Stars! What happened...?': 'Pelos astros! O que aconteceu...?',
  'I aaaam Loooord Youuuurnaack!': 'Euuu sooou o Looorde Youuuurnack!',
  'I am LOOORD!': 'Eu sou o LOOORDE!',
  'Leeeeave My CASTLE!': 'Saaaiam do Meu CASTELO!',
  'Lord Yornak': 'Lorde Yornak',
  'Maaaade meeee WONDERFUUUUL!': 'Meeee tornoooou MAARAAVILHOOOSO!',
  'Made you a monster.': 'Fez de você um monstro, isso sim.',
  'Now I\'m deaaaad. Death isn\'t freeeeeee.': 'Agora estou mooorto. A morte não é de graçaaaaaaa.',
  'Now you\'re free of your curse.': 'Pronto, agora você está livre da maldição.',
  'The Vizieeeer...maaaade meee...': 'O Viziiiiir...meee feeeeez...',
  'Trust me, you\'re better off dead than a monster.': 'Confie em mim, é melhor estar morto do que ser um monstro.',
  'What is that?': 'O que é isso?',
  // ── Svar's Spite (SRNM03) ──────────────────────────────────────────────────
  'Goblin magic is worthless.': 'Magia goblin não vale nada.',
  'I knew the Vizier shouldn\'t have bought those Death Eyes': 'Eu sabia que o Vizir não deveria ter comprado aqueles Olhos da Morte.',
  'For General Svar!': 'Pelo General Svar!',
  'You\'ve come a long way to die, human!': 'Você veio de longe para morrer, humano|humana!',
  'I never even got to ride one...': 'Eu nem sequer cheguei a andar em um...',
  'Our mounts! He|she is killing our mounts!': 'Nossas montarias! Ele|Ela está matando nossas montarias!',
  'A human! The rumors are true.': 'Um|Uma humano|humana! Os rumores são verdadeiros.',
  'Stop him|her !': 'Parem ele|ela!',
  'The human has snuck past the guards!': 'O|A humano|humana passou despercebido|despercebida pelos guardas!',
  'Warn General Svar!': 'Avisem o General Svar!',
  'We will ride these beasts to victory!': 'Vamos montar essas feras rumo à vitória!',
  'When the Tuatara Legion invades...': 'Quando a Legião Tuatara invadir...',
  'Now\'s our chance, warriors!': 'Agora é nossa chance, guerreiros!',
  'Prove our skill to General Svar!': 'Provem nossa habilidade ao General Svar!',
  'Charge!': 'Ao ataque!',
  'For Svar and the Tuatara Legion!': 'Por Svar e pela Legião Tuatara!',
  'General Svar will give 1000 gold to whoever kills the human!': 'O General Svar dará 1000 moedas de ouro a quem matar o humano|a humana!',
  'He\'s|She\'s here to steal the Legions wages!': 'Ele|Ela está aqui para roubar o soldo da Legião!',
  'Thief...murderer!': 'Ladrão|Ladra... assassino|assassina!',
  'Behold my magnificence and despair, human.': 'Contemple minha magnificência e desespere-se, humano|humana.',
  'Coming, General': 'Estamos indo, General.',
  'General Svar': 'General Svar',
  'General Svar! The human!': 'General Svar! O|A humano|humana!',
  'Human! Your kind belongs in chains.': 'Humano|Humana! Sua espécie merece estar acorrentada.',
  'I am General Svar, Leader of the Tuatara Vanguard!': 'Eu sou o General Svar, líder da Vanguarda Tuatara!',
  'I wasn\'t ready for that...': 'Eu não estava preparado|preparada para isso...',
  'Not today. Not enslaved to you.': 'Nem hoje nem nunca. Não serei escravizado|escravizada por você.',
  'The General of the Tuatara Legion will slay you now.': 'O General da Legião Tuatara vai te matar agora.',
  'The general is a dragon!': 'O general é um dragão!',
  'Tuatara Legion, to me!': 'Legião Tuatara, comigo!',
  'Whew. A dragon. Wow...': 'Ufa. Um dragão. Uau...',
  // ── Lair of the Ooyak (SRNM04) ─────────────────────────────────────────────
  'Lair of the Ooyak': 'Covil do Ooyak',
  'Are you lizards trying to make yourselves into knights?': 'Vocês, lagartos, estão tentando se passar por cavaleiros?',
  'Behold the Brood Mother!': 'Contemplem a Mãe da Ninhada!',
  'Brood Mother': 'Mãe da Ninhada',
  'Her offpring will trample your cities and devour your kind!': 'As crias dela pisotearão suas cidades e devorarão sua espécie!',
  'I think it\'s time I finally met The Vizier.': 'Acho que está na hora de eu finalmente conhecer o Vizir.',
  'No! No! You can\'t come in here!': 'Não! Não! Você não pode entrar aqui!',
  'So ends the Tuatara cavalry.': 'Assim termina a cavalaria Tuatara.',
  'The Vizier will not like this one bit.': 'O Vizir não vai gostar nem um pouco disso.',
  'The human has ruined our herd!': 'O|A humano|humana arruinou nosso rebanho!',
  'Tuatara Legion! Attack!': 'Legião Tuatara! Ataquem!',
  'Victory, for all dragon-kind!': 'Vitória para toda a raça dracônica!',
  'You mock The Vizier\'s vision!': 'Você zomba da visão do Vizir!',
  'Oh! This\'ll be fun!': 'Ah! Isso vai ser divertido!',
  'GET HIM!|HER!': 'PEGUEM ELE!|ELA!',
  'It is the Vizier\'s will!': 'É a vontade do Vizir!',
  'Protect the herd!': 'Protejam o rebanho!',
  'A spy!': 'Um|Uma espião|espiã!',
  'A spy!:Warn the Vizier!': 'Um|Uma espião|espiã!:Avisem o Vizir!',
  'He|She is after the herd stop him|her!': 'Ele|Ela está atrás do rebanho, parem ele|ela!',
  'Strength from the banner!': 'Força do estandarte!',
  'Warn the Vizier!': 'Avisem o Vizir!',
  'Our cavalry will never ride if he|she corrupts the herd!': 'Nossa cavalaria nunca partirá se ele|ela corromper o rebanho!',
  'The herd will feat on your bones!': 'O rebanho vai se banquetear com seus ossos!',
  'He|She will make a nice snack for the herd.': 'Ele|Ela será um belo petisco para o rebanho.',
  'The human!': 'O|A humano|humana!',
  'GRAAAHHK!!': 'GRAAAHHK!!',
  'So you\'re the one causing all this trouble.': 'Então é você quem está causando todo esse problema.',
  'Taskmaster': 'Capataz',
  'You humans will learn your place!': 'Vocês, humanos, vão aprender o seu lugar!',
  'You must be here to sabotage the Vizier\'s herd.': 'Você deve estar aqui para sabotar o rebanho do Vizir.',
  'Fight on! Prove your mettle!': 'Lutem! Provem seu valor!',
  'The Vizier will make you knights!': 'O Vizir fará de vocês cavaleiros!',
  // ── Citadel of the Vizier (SRNM05) ─────────────────────────────────────────
  '...Without my experiments, all is doomed.': '...Sem meus experimentos, tudo está perdido.',
  'And you\'re the Vizier. You look thinner in your banners.': 'Então você é o tal Vizir. Você parecia mais magro nos estandartes.',
  'Destroying our herd, killing General Svar...': 'Destruindo nosso rebanho, matando o General Svar...',
  'Grand Vizier Hslat': 'Grão-Vizir Hsalt',
  'I am the GRAND VIZIER!': 'Eu sou o GRÃO-VIZIR!',
  'I won\'t be beaten by a human...': 'Não serei derrotado por um|uma humano|humana...',
  'No! The Generals need my brilliant mind...': 'Não! Os Generais precisam da minha mente brilhante...',
  'Sasyak!': 'Sasyak!',
  'Sasyak! Vayak! Kill!': 'Sasyak! Vayak! Matar!',
  'The Tuatara are doomed. I like the sound of that.': 'Os Tuatara estão condenados. Gosto de como isso soa.',
  'Tuatara! Get the #tc#!': 'Tuatara! Peguem o|a #tc#!',
  'Vayak!': 'Vayak!',
  'You\'re the human saboteur.': 'O|A sabotador|sabotadora humano|humana.',
  'You\'ve delayed our invasion by at least a season.': 'Você adiou nossa invasão em pelo menos uma estação.',
  'Your interference ends now. The invasion will go forward.': 'Sua interferência acaba aqui. A invasão seguirá em frente.',
  'The Grand Vizier will favor the one that puts him|her down!': 'O Grão-Vizir favorecerá quem derrubar ele|ela!',
  'The human saboteur!': 'O|A sabotador|sabotadora humano|humana!',
  'The human who destroyed our cavalry herd!': 'O|A humano|humana que destruiu nosso rebanho de cavalaria!',
  'You won\'t interfere with the Grand Vizier\'s plans again, human!': 'Você não vai interferir nos planos do Grão-Vizir outra vez, humano|humana!',
  'Kill him|her !': 'Matem ele|ela!',
  'You haven\'t slain all our mounts, saboteur!': 'Você ainda não matou todas as nossas montarias, sabotador|sabotadora!',
  'Cease and desist!': 'Pare com isso!',
  'The Vizier will skin us alive if we don\'t stop him|her here!': 'O Vizir vai nos esfolar vivos se não pararmos ele|ela aqui!',
  'He is the true leader!': 'Ele é o verdadeiro líder!',
  'Hslat wants his|her blood!': 'Hsalt quer o sangue dele|dela!',
  'Now you cretins!': 'Agora, seus idiotas!',
  'We have him|her trapped!': 'Nós o|a encurralamos!',
  'Without the Vizier, the dragons would be lost!': 'Sem o Vizir, os dragões estariam perdidos!',
  'Long Live The Grand Vizier!': 'Vida longa ao Grão-Vizir!',
  'The Vizier will enslave you all!': 'O Vizir vai escravizar todos vocês!',
  'You humans will bow to the Tuatara!': 'Vocês, humanos, vão se curvar perante os Tuatara!',
  'Long live The Grand Vizier!': 'Vida longa ao Grão-Vizir!',
  'No further, human criminal!': 'Nem mais um passo, criminoso|criminosa humano|humana!',
  'STOP TOUCHING ME!': 'PARE DE ENCOSTAR EM MIM!',
  'We collapsed the stairs!': 'Nós derrubamos a escada!',
  'You shall not disturb the Vizier further #tc#.': 'Não perturbe mais o Vizir, #tc#.',
  'He|She got past the Death Eyes': 'Ele|Ela passou pelos Olhos da Morte.',
  'Never question the Vizier!': 'Nunca questione o Vizir!',
  'The Vizier shouldn\'t have trusted goblin magic.': 'O Vizir não deveria ter confiado na magia dos goblins.',
  'The fiend has found a way!': 'O demônio encontrou um jeito!',
  // ── The Great Green Svath (SRNM07) ─────────────────────────────────────────
  'Join us, Brother.|Sister.': 'Junte-se a nós, irmão|irmã.',
  'Now the Dragons raise us anew.': 'Agora, os dragões nos erguem de novo.',
  'We were once as you...': 'Já fomos como você...',
  'General Svath gives me a new purpose...': 'O General Svath me dá um novo propósito...',
  'General Svath\'s Undead Legion cannot be stopped, mortal!': 'A Legião dos Mortos-Vivos do General Svath é imparável, mortal!',
  'I lived 100 years ago...': 'Eu vivi há 100 anos...',
  'Your death.': 'A sua morte.',
  'General Svath\'s Legion only accepts the dead.': 'A Legião do General Svath só aceita os mortos.',
  'Join us.': 'Junte-se a nós.',
  'All humans, living and dead, will serve.': 'Todos os humanos, vivos e mortos, servirão.',
  'General Svath commands us now.': 'O General Svath nos comanda agora.',
  'Depart, human!': 'Afaste-se, humano|humana!',
  'Entry to Svath\'s War Reserves is forbidden!': 'A entrada nas Reservas de Guerra de Svath é proibida!',
  'The Undead Legion rises for General Svath!': 'A Legião dos Mortos-Vivos se ergue pelo General Svath!',
  'A new brother|sister comes to join us!': 'Um|Uma novo|nova irmão|irmã vem se juntar a nós!',
  'See you soon...': 'Até breve...',
  'The General knows you\'re coming...': 'O General sabe que você está vindo...',
  'You will roast in his firey wrath.': 'Você arderá na fúria flamejante dele.',
  'The Undead Legion is Endless!': 'A Legião dos Mortos-Vivos é infinita!',
  'There are a 1000 more corpses where I came from.': 'Há mais 1000 cadáveres de onde eu vim.',
  'The price is eternal loyalty to Svath.': 'O preço é a lealdade eterna a Svath.',
  'We have gold enough for you.': 'Temos ouro suficiente para você.',
  'But Nephit taught me to kill EVERYTHING, then enslave the undead remains!': 'Mas Nephit me ensinou a matar TUDO e, em seguida, escravizar os restos mortais!',
  'General Svath': 'General Svath',
  'I am General Svath!': 'Eu sou o General Svath!',
  'I am Immortal!': 'Eu sou imortal!',
  'My Vizier puts trusts only his corrupt plants and pure-bred carnasaurs.': 'Meu Vizir confia apenas nas plantas corrompidas e nos carnissauros de raça pura.',
  'My brother Svar put too much faith in Tuatara soldiers.': 'Meu irmão Svar confiou demais nos soldados Tuatara.',
  'Nephit swore I\'d never die...': 'Nephit jurou que eu nunca morreria...',
  'Nephit warned me you were a resourceful little thing.': 'Nephit me avisou que você era uma criaturinha muito engenhosa.',
  'Nephit! What does that grave digger have to do with this?': 'Nephit! O que aquele coveiro tem a ver com isso?',
  'Never trust a dead person about living forever.': 'Nunca confie na palavra de uma pessoa morta sobre a vida eterna.',
  'You wastrel!': 'Seu imprestável!',
  // ── Mindless Queen's Glade (SRNM06) ────────────────────────────────────────
  'Demonic veggies are seldom good eats.': 'Verduras demoníacas raramente são uma boa refeição.',
  'Devourer Queen': 'Rainha Devoradora',
  'Hopefully we can plant some healthy crops now.': 'Com sorte, agora podemos plantar algo saudável.',
  'It looks like it\'s the source of these seedling devourers.': 'Parece que essa é a origem dessas mudas devoradoras.',
  'That thing is huge!': 'Essa coisa é enorme!',
  'Time to prune.': 'É hora de podar.',
  'This will be our greatest harvest yet!': 'Essa será a nossa melhor colheita de todas!',
  'Your blood will water our fields!': 'Seu sangue regará nossos campos!',
  'Your corpse will nourish the Vizier\'s crop.': 'Seu cadáver servirá de adubo para a plantação do Vizir.',
  'Our crops will devour your king!': 'Nossas plantações devorarão seu rei!',
  'The Generals will carry our seedlings to your shore.': 'Os Generais levarão nossas mudas até a sua costa.',
  'But these devourers seem pretty inedible.': 'Mas esses Devoradores parecem bem intragáveis.',
  'These fields used to provide wheat for the whole region.': 'Esses campos costumavam fornecer trigo para toda a região.',
  'Famine comes!': 'A fome se aproxima!',
  'Protect the Seedlings!': 'Protejam as mudas!',
  'The Generals need these devourers for the invasion!': 'Os Generais precisam desses Devoradores para a invasão!',
  'Your crops wil devour you!': 'Suas colheitas vão te devorar!',
  'My family once tended these fields.': 'Minha família já cuidou desses campos.',
  'Now I am one with them!': 'Agora sou um só com eles!',
  'Be Gone! This Crop is not ready for harvest!': 'Fora daqui! Essa safra ainda não está pronta para a colheita!',
  'Was that a man or a plant?': 'Aquilo era um homem ou uma planta?',
  // ── Arachnae's Swamp (SRCM01, SRConnM) ─────────────────────────────────────
  'Aracnae': 'Arachnae',
  'By the Stars!': 'Pelas Estrelas!',
  'Hsalt left his biggest abomination to guard the road.': 'Hsalt deixou sua maior abominação para guardar a estrada.',
  'Hsalt\'s Pride': 'Orgulho de Hsalt',
  'Once I clear the monsters from around Castle Hocke.': 'Assim que eu eliminar os monstros ao redor do Castelo Hocke.',
  'The road\'s clear, now soldiers from Wolf\'s End can join me...': 'A estrada está livre. Agora os soldados de Fim do Lobo podem se juntar a mim...',
  'Now it\'s overrun with Hsalt\'s unnatural experiments.': 'Agora está tomado pelos experimentos profanos de Hsalt.',
  'This foul fen was once a major road.': 'Esse pântano fétido já foi uma estrada importante.',
  'The stench of rot and death is overhwelming!': 'O fedor de podridão e morte é sufocante!',
  'Beeeewaaare Felll Briiiidge!': 'Cuuuidaaadooo com Feeelbridge!',
  'Was he trying to warn me?': 'Ele estava tentando me avisar?',
  'What is Felbridge?': 'O que é Felbridge?',
  'Hsalt is dead, you poor wretch.': 'Hsalt está morto, seu pobre infeliz.',
  'Hsssaaalt saaays nooo paaasss!': 'Hsssaaalt diiiz que ninguém paaassa!',
  'I wonder how long Hsalt\'s horrors will linger.': 'Me pergunto por quanto tempo os horrores de Hsalt ainda vão assombrar esse lugar.',
  'These spiders have blocked the whole road.': 'Essas aranhas bloquearam a estrada inteira.',
  'Hsalt did you grave wrong.': 'Hsalt cometeu um erro grave com você.',
  'Ooouur Hoooome!': 'Nooosso laaar!',
  'Rest in peace, poor people': 'Descansem em paz, pobres almas.',
  'Yooooou Diiiie!': 'Voooocêêê vaaai mooorreeer!'
};

// ─── Funções auxiliares ───────────────────────────────────────────────────────

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function applyMissionDialogues() {
  const data = loadJson(MISSION_DIALOGUES_PATH);
  if (!data.missions) {
    throw new Error('MissionDialogues.pt-br.json: formato inesperado (sem "missions")');
  }

  let updated = 0;
  for (const [missionId, fields] of Object.entries(MISSION_UPDATES)) {
    const existing = data.missions[missionId] || {};
    const merged = { ...existing, ...fields };
    if (JSON.stringify(merged) !== JSON.stringify(existing)) {
      data.missions[missionId] = merged;
      updated += 1;
    }
  }

  if (updated > 0) {
    saveJson(MISSION_DIALOGUES_PATH, data);
    console.log(`[apply-ptbr-brm-runtime] MissionDialogues: ${updated} missão(ões) atualizadas.`);
  } else {
    console.log('[apply-ptbr-brm-runtime] MissionDialogues: sem alterações.');
  }
}

function applySwfDialogues() {
  const data = loadJson(DIALOGUE_TRANSLATIONS_PATH);
  if (!data.translations) {
    throw new Error('DialogueTranslations.pt-br.json: formato inesperado (sem "translations")');
  }

  let added = 0;
  let replaced = 0;
  for (const [en, ptbr] of Object.entries(SWF_DIALOGUE_UPDATES)) {
    if (data.translations[en] === ptbr) continue;
    if (data.translations[en] === undefined) {
      added += 1;
    } else {
      replaced += 1;
    }
    data.translations[en] = ptbr;
  }

  if (added + replaced > 0) {
    saveJson(DIALOGUE_TRANSLATIONS_PATH, data);
    console.log(
      `[apply-ptbr-brm-runtime] DialogueTranslations: ${added} adicionadas, ${replaced} substituídas.`
    );
  } else {
    console.log('[apply-ptbr-brm-runtime] DialogueTranslations: sem alterações.');
  }
}

applyMissionDialogues();
applySwfDialogues();
console.log('[apply-ptbr-brm-runtime] Concluído.');
