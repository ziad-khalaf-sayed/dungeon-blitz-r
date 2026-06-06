const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..', '..', '..');
const dataDir = path.join(__dirname, '..', 'data');
const dialoguePath = path.join(dataDir, 'DialogueTranslations.pt-br.json');

const dialogue = JSON.parse(fs.readFileSync(dialoguePath, 'utf8'));
const t = dialogue.translations ?? dialogue;

const updates = {
  'Come on lets go!': 'Vamos lá, anda!',
  'More gold those Goblins stole!': 'Mais ouro que aqueles goblins roubaram!',
  'Uh oh look over there!': 'Eita, olha ali!',
  'Yikes! Death Eyes!': 'Nossa! Olhos da Morte!',
  'Whoa look at that!': 'Uau, olha só isso!',
  'This is for our kraken, human!': 'Isso é pelo nosso Kraken, humano!',
  'This is for our kraken, human!:DIE!!!': 'Isso é pelo nosso Kraken, humano!:MORRA!!!',
  'LOOK!': 'OLHA!',

  'Now try using your SECOND ability.': 'Agora tente usar sua SEGUNDA habilidade.',
  'Now what was that PASSWORD?': 'Agora, qual era mesmo aquela SENHA?',
  'Hmmm looks like there is a password.': 'Hmmm, parece que tem uma senha.',
  'Did those goblins have a prisoner with them?': 'Aqueles goblins estavam levando uma prisioneira?',
  "But that's good to know!": 'Mas é bom saber disso!',
  'Hey, #tn#!': 'Ei, #tn#!',
  'Phew that was close!': 'Ufa, essa foi por pouco!',
  'Let me try!': 'Deixa eu tentar!',
  'Lets go!': 'Vamos lá!',
  'Try attacking it!': 'Tente atacar!',
  'Try breaking these CHAINS with your weapon.': 'Tente quebrar essas CORRENTES com sua arma.',
  'Try using your FIRST ability.': 'Tente usar sua PRIMEIRA habilidade.',
  'Looks like we have to JUMP!': 'Parece que vamos ter que PULAR!',
  "Maybe she's in there.": 'Talvez ela esteja lá dentro.',
  'Look! An intruder!': 'Olhem! Um|Uma intruso|intrusa!',
  'The goblins caught me spying!': 'Os goblins me pegaram espiando!',
  'Good gravy what a mess.': 'Nossa, que bagunça!',
  "Let's say we clean this place up.": 'Vamos dar uma arrumada neste lugar.',
  'This place is a dump...': 'Esse lugar está um lixão...',
  'Ha! Poor trogs!': 'Ha! Pobres trogs!',
  'Did someone hurt your little squiddy?': 'Alguém machucou sua pequena lulinha, foi?',
  "Let's head back to town.": 'Vamos voltar para a vila.',
  'You should be more careful!': 'Você deveria ser mais cuidadoso|cuidadosa!',

  "I'll keep this gear polished up.": 'Vou manter esse equipamento em ótimo estado.',
  'This is your place now.': 'Este lugar é seu agora.',
  'This place has been overrun since the goblins came.': 'Este lugar está tomado desde que os goblins chegaram.',
  'That old forge once forged powerful magic items.': 'Aquela antiga forja já forjou poderosos itens mágicos.',
  'It could again.': 'E pode voltar a forjar.',
  'The tome trained the most powerful heroes of the last age.': 'O tomo treinou os heróis mais poderosos da era passada.',
  'But that was then.': 'Mas isso ficou no passado.',
  'I can remember how great this place was once.': 'Eu me lembro de como este lugar já foi grandioso.',
  'There was a fountain of tremendous magic.': 'Havia uma fonte de magia poderosa.',
  'And forests full of wild magical animals.': 'E florestas repletas de animais mágicos selvagens.',
  'This place could be great again.': 'Este lugar pode voltar a ser grandioso.',
  'This village could thrive again.': 'Esta vila pode voltar a prosperar.',
  'If only a hero could lead the way.': 'Se ao menos um|uma herói|heroína pudesse nos guiar.',
  'They have all kinds of treasure inside!': 'Tem todo tipo de tesouro lá dentro!',
  'Welcome, warrior. Enjoy the Guild Hall.': 'Seja bem-vindo|bem-vinda, guerreiro|guerreira. Aproveite o Salão da Guilda.',
  'My job is to look after these fine creatures.': 'Meu trabalho é cuidar dessas belas criaturas.',
  'Please hatch more eggs, friend. Yval here might like a bit more company.': 'Por favor, choque mais ovos, amigo|amiga. O Yval aqui talvez goste de ter um pouco mais de companhia.',
  'Yep.': 'Sim.',

  'Defeat five big goblins and recover their noserings': 'Derrote cinco goblins grandalhões e recupere as argolas de nariz deles',
  'Collect the nosering bounty from Jarvis': 'Receba a recompensa das argolas com Jarvis',
  'Confiscate wands from goblin shamans': 'Confisque varinhas dos xamãs goblins',
  'Confiscate wands from the goblin shamans': 'Confisque as varinhas dos xamãs goblins',
  'Turn the wands over to Jarvis': 'Entregue as varinhas para Jarvis',
  'Turn the wands over to Jerdus': 'Entregue as varinhas para Jerdus',
  'Drive back the goblin menace one goblin at a time': 'Contenha a ameaça goblin, um goblin de cada vez',
  "Tell Jerdus that's a few dozen goblins down": 'Conte a Jerdus que algumas dezenas de goblins já caíram',
  'Teach the goblin raiders a lesson': 'Dê uma lição nos saqueadores goblins',
  'Tell Otto he just needs to clean up the goblin bits': 'Conte a Otto que só falta limpar os restos de goblin',
  'Help stem the undead tide': 'Ajude a conter a maré de mortos-vivos',
  'Tell Herman the shrine has settled down': 'Diga ao Herman que a situação no santuário se acalmou',
  'Follow the river to the Goblin Encampment': 'Siga o rio até o Acampamento Goblin',
  'Goblin Camp': 'Acampamento Goblin',
  'goblin Camp': 'Acampamento Goblin',

  'Nephit is Eternal.': 'Nephit é eterno.',
  'No further!': 'Daqui você não passa!',
  'For the Goblin Horde!': 'Pela Horda Goblin!',
  'Have you come to serve Nephit too, human?': 'Você também veio servir a Nephit, humano?',
  '"Help! Help!"...': '"Socorro! Socorro!"...',

  "Boss! He's|She's here!": 'Chefe! Ele|Ela chegou!',
  "She's Mine!": 'Ela é minha!',
  'So, the Kraken Slayer, eh?': 'Então você é o Caçador do Kraken, hein?',
  "Don't look like much to me.": 'Não parece grande coisa pra mim.',
  'Goblins will curse your name for a thousand years.': 'Os goblins amaldiçoarão seu nome por 1000 anos!',
  'As long as you remember we won the war.': 'Contanto que vocês se lembrem de que perderam a guerra.',
  'Goblins! This is our final stand!': 'Goblins! Esta é a nossa última resistência!',
  "Let's eat it!": 'Vamos assar ele!',
  'Um... thats not good.': 'Hm... isso não é nada bom.',
  'Mwahahaha gotcha, Kraken Slayer!': 'Muahahaha, te peguei, Caçador do Kraken!',
  "Get'em boys!": 'Peguem ele|ela, rapazes!',
  'Get him boys!': 'Peguem ele, rapazes!',
  'Get her boys!': 'Peguem ela, rapazes!',
  "You're the one that killed our Kraken!": 'Então foi você quem matou o nosso Kraken!',
  'That was the last of our Monster Fleet!': 'Aquele era o último da nossa Frota de Monstros!',
  'Dead because humans like YOU failed in your duty when the goblins invaded.': 'Morto porque humanos como VOCÊ falharam com seu dever quando os goblins invadiram.',
  'Dead because humans like YOU failed to do your duty when the goblins invaded.': 'Morto porque humanos como VOCÊ falharam com seu dever quando os goblins invadiram.',
  'Time to goblin up.': 'É hora de ser goblin de verdade!',
  ":Time to goblin up.": ':É hora de ser goblin de verdade!',
  "You'll ruin everything!": 'Você vai estragar tudo!',
  'We see your scheme, human!': 'Nós sacamos qual é a sua, humano!',
  'Goblins will rise again!': 'Os goblins vão se erguer de novo!',
  'You humans should know better...': 'Vocês, humanos, já deviam saber disso...',
  'This is goblin town now!': 'Esse forte pertence aos goblins agora!',
  "So, you're the Kraken Slayer.": 'Então, você é o Caçador do Kraken.',
  'Who is this Nephit guy anyway?': 'Quem é esse tal de Nephit, afinal?',
  'Whoever wins here will have to deal with his foul magic.': 'Quem vencer aqui terá que lidar com a magia maligna dele.',
  'Sounds like fighting words to me.': 'Isso soa como um desafio para mim.',

  'Death Eyes, kill the Kraken slayer!': 'Olhos da Morte, matem o Caçador do Kraken!',
  "Let's have some fun!": 'Vamos nos divertir um pouco!',
  "What's the matter?!": 'Qual é o problema?!',
  "You don't want treasure!?": 'Você não quer o tesouro?!',
  'The Curse of Zegl upon Ye!': 'Que a maldição de Zegl caia sobre você!',
  'The Kraken Slayer!': 'O Caçador do Kraken!',
  'Bow down to your fate.': 'Curve-se ao seu destino.',
  'Death is a small price to pay for knowledge.': 'A morte é um preço pequeno a se pagar pelo conhecimento.',
  'He can open the passage!': 'Ele pode abrir a passagem!',
  'Maybe death will take me home...': 'Talvez a morte me leve para casa...',
  'Nephit Knows.': 'Nephit sabe.',
  'So sayeth Nephit': 'Assim diz Nephit.',
  'You said Nephit mentioned a "Dream Dragon."': 'Você disse que Nephit mencionou um "Dragão dos Sonhos".',
  'Yeargh!': 'Argh!',
  'Get out!': 'Saia daqui!',
  'Kill her!': 'Matem ele|ela!',
  'Get back across the sea!': 'Volte para o outro lado do mar!',
  'Get back! Go away!': 'Afaste-se! Vá embora!',
  'Wait, I need to take the fork in the road': 'Espera, preciso seguir pela bifurcação.',
  "It's right below me": 'Está aqui embaixo.',
  'Intruder!': 'Intruso|Intrusa!',
  'Intruder! We\'re doomed!': 'Intruso|Intrusa! Estamos condenados!',
  'Intruder!:Stop him|her! !': 'Intruso|Intrusa!:Parem ele|ela!',
  'He|She found us!': 'Ele|Ela nos encontrou!',
  'He|she found us!': 'Ele|ela nos encontrou!',
  'Ele nos encontrou!': 'Ele nos encontrou!',
  'Ela nos encontrou!': 'Ela nos encontrou!',
  'They see your death.': 'Eles veem sua morte.',
  '::They see your death.': '::Eles veem sua morte.',
  'Bah!': 'Bah!',
  'Gah!': 'Gah!',
  "I don't need any help takin care of some human!": 'Não preciso de ajuda para cuidar de um|uma humano|humana!',
  'I was just kidding!': 'Brincadeirinha!',
  'Nice one, stranger!': 'Muito bem, forasteiro|forasteira!',
  'Maybe the others were right...': 'Talvez os outros estivessem certos...',
  'Corruptor! These spawning grounds are sacred!': 'Profanador! Estes ninhos são sagrados!',
  'He freed to bird': 'Ele libertou o pássaro!',
  'He freed to bird:I was gonna eat that for dinner!': 'Ele libertou o pássaro!:Eu ia comer isso no jantar!',
  'I was gonna eat that for dinner!': 'Eu ia comer isso no jantar!',
  'Cut him|her to pieces!': 'Cortem ele|ela em pedaços!',
  'Avenge our fallen war beast!': 'Vinguem nossa besta de guerra caída!',
  "We'll help finish him off!": 'Vamos ajudar a acabar com ele!',
  "We'll help finish her off!": 'Vamos ajudar a acabar com ela!',
  "We'll help you boss!": 'Vamos ajudar você, chefe!',
  "We'll save you, Boss!": 'Vamos salvar você, Chefe!',
  'Hands off, you louts!': 'Tirem as mãos, seus desastrados!',
  'HELP!': 'SOCORRO!',
  "This one's kind of tough...": 'Esse|Essa aqui é do tipo durão|durona...',
  "^tThis one's kind of tough...": '^tEsse|Essa aqui é do tipo durão|durona...',
  'Coming here was an idiotic mistake, human!': 'Vir aqui foi uma decisão estúpida, humano!',
  'No! My precious nestlings!': 'Não! Meus preciosos filhotes!',
  'The new flock!': 'A nova ninhada!',
  'My beautiful nestlings!': 'Meus lindos filhotes!',
  'Protect the Death Eyes nests!': 'Protejam os ninhos dos Olhos da Morte!',
  'Protect the Death Eye nests!': 'Protejam os ninhos dos Olhos da Morte!',
  'AAAAAAH!': 'AAAAAAH!',
  'We conquered you humans!': 'Nós conquistamos vocês, humanos!',
  'We conquered you humans!:We won!': 'Nós conquistamos vocês, humanos!:Nós vencemos!',
  'We won!': 'Nós vencemos!',
  'Is that Nephit?!?!': 'Aquele é o Nephit?!?!',
  "One of Nephit's spies!: Kill him!": 'Um dos espiões de Nephit!:Matem ele!',
  'Kill him!': 'Matem ele|ela!',
  'They die too young...': 'Eles são jovens demais para morrer...',
  'A pox on you, Kraken Slayer!': 'Que uma praga caia sobre você, Caçador do Kraken!',
  'A pox on you, human!': 'Que uma praga caia sobre você, humano|humana!',
  'How did you get here?!?': 'Como você chegou aqui?!?',
  'How did you find us?!?': 'Como você nos encontrou?!?',
  'Stand your ground, cowards!': 'Mantenham posição, seus covardes!',
  'Die fighting, you worms!': 'Morram lutando, seus vermes!',
  'Goblins will curse your name for 1000 years.': 'Os goblins amaldiçoarão seu nome por 1000 anos!',
  'Some of the goblins now follow a mysterious master named Nephit. He has set up base in an old tomb. Pay him a visit.': 'Alguns goblins agora seguem Nephit, um mestre misterioso escondido numa tumba antiga. Faça uma visita.',
  "Let Anna know the Goblins are finished in Wolf's End.": 'Avise Anna que os goblins acabaram em Fim do Lobo',
  "Goblins attack villagers and steal metal. The tougher goblins wear it as jewelry. Get some of the villager's stuff back.": 'Os goblins roubaram metal dos aldeões. Os mais durões usam tudo como joias. Recupere alguns pertences dos aldeões.',
  'New Quest Item': 'Novo Item de Missão',
  'Chief': 'Chefe',
  'Chief Tourzahl': 'Chefe Tourzahl',
  "Sythokahn's Dream": 'Sonho de Sythokahn',
  "Sythokhan's Dream": 'Sonho de Sythokahn',
  "Why do you fight so?": 'Por que você resiste tanto?',
  'I conquered Death itself': 'Eu conquistei a própria Morte.',
  "You're nothing.": 'Você não é nada.',
  "Why do you fight so?:I conquered Death itself:You're nothing.": 'Por que você resiste tanto?:Eu conquistei a própria Morte.:Você não é nada.',
  'It vanishes in the light.': 'Dissolve-se na luz.',
  "That's just a human, you idiot!": 'É só um|uma humano|humana, seu idiota!',
  ":That's just a human, you idiot!": ':É só um|uma humano|humana, seu idiota!',

  'I came back once, I shall again!': 'Eu já voltei uma vez, e voltarei de novo!',
  "...Nephit... wouldn't have let this happen...": '...Nephit... não teria deixado isso acontecer...',
  'I wonder what the Dream Dragon he mentioned might be.': 'O que será esse Dragão dos Sonhos que ele mencionou?',
  'DIE!!!!': 'MORRA!!!!',
  'Or join us.': 'Ou junte-se a nós.',
  "Looks like Nephit wanted the Dream Dragon's secrets, but he was digging in the wrong place. Now's your chance to discover what he was searching for.": 'Nephit buscava os segredos do Dragão dos Sonhos, mas cavou no lugar errado. Descubra o que ele procurava.',
  'A human slave disturbs my dream.': 'Um|Uma escravo|escrava humano|humana perturba meu sonho.',
  'Turn back, mortal.': 'Volte de onde veio, mortal.',
  'Where all sleep, none may die.': 'Onde todos dormem, ninguém pode morrer.',
  'Lay down your sweet head...': 'Repouse essa doce cabecinha...',
  'That I might chop it off!': 'Para que eu possa cortá-la fora!',
  'Lay down your sweet head...:That I might chop it off!': 'Repouse essa doce cabecinha...:Para que eu possa cortá-la fora!',
  '"Help! Help!"...:A child cries out in the night.': '"Socorro! Socorro!"...:Uma criança grita no meio da noite.',
  'A child cries out in the night.': 'Uma criança grita no meio da noite.',
  'Leave your waking worries behind.': 'Deixe para trás as preocupações do mundo desperto.',
  'Death is the most restful slumber.': 'A morte é o sono mais repousante.',
  'Leave your waking worries behind.:Death is the most restful slumber.': 'Deixe para trás as preocupações do mundo desperto.:A morte é o sono mais repousante.',
  "You disturb Sythokahn's dream...": 'Você perturba o sonho de Sythokahn...',
  "Beware human...:You disturb Sythokahn's dream...": 'Cuidado, humano...:Você perturba o sonho de Sythokahn...',
  'Why do I torment myself with these fantasies?': 'Por que eu me atormento com essas fantasias?',
  'Come forth my fellow dreamers.': 'Venham, meus companheiros sonhadores.',
  'Why do I torment myself with these fantasies?:Come forth my fellow dreamers.': 'Por que eu me atormento com essas fantasias?:Venham, meus companheiros sonhadores.',
  "You won't live long enough to understand, slave.": 'Você não viverá tempo suficiente para entender, escravo|escrava.',
  'A dragon! Perhaps this really is a dream...': 'Um dragão! Talvez isso seja mesmo um sonho...',
  'Dawn is coming...': 'O amanhecer está chegando...',
  'I shall see you in your dreams...': 'Verei você em seus sonhos...',
  "Flee! You can't awaken...": 'Fuja! Você não consegue despertar...',
  'We rise from earth below.': 'Nós nos erguemos da terra abaixo.',
  'In the Waking World, nightmares come true.': 'No Mundo Desperto, os pesadelos se tornam realidade.',
  "Oh...everything's gone wrong...": 'Ah... deu tudo errado...',
  "Oh...everything's going dark...": 'Ah... está tudo escurecendo...',
  'Our fighters need their leader.': 'Nossos combatentes precisam da líder deles.',
  'Someone named Nephit is trying to control the goblins.': 'Alguém chamado Nephit está tentando controlar os goblins.',
  'Thank you for freeing Anna! Our fighters need their leader.': 'Obrigado por libertar a Anna! Nossos combatentes precisam da líder deles.',
};

const replacements = new Map([
  ['Mais ouro aqueles Goblins roubou!', 'Mais ouro que aqueles goblins roubaram!'],
  ['Agora o que era aquele PASSWORD?', 'Agora, qual era mesmo aquela SENHA?'],
  ['Vamos dizer nos limpar este lugar acima.', 'Vamos dar uma arrumada neste lugar.'],
  ['Fez alguem hurt seu little squiddy?', 'Alguém machucou sua pequena lulinha, foi?'],
  ['Bem aquele backfired...', 'Bom, isso saiu pela culatra...'],
  ['Voce Esta um aquele morto nosso Kraken!', 'Então foi você quem matou o nosso Kraken!'],
  ['Aquele era ultimo de nosso Monstro Fleet!', 'Aquele era o último da nossa Frota de Monstros!'],
  ['Get ele boys!', 'Peguem ele, rapazes!'],
  ['Get ela boys!', 'Peguem ela, rapazes!'],
  ['Yikes! Morte Olhos!', 'Nossa! Olhos da Morte!'],
  ['Morte Olhos, matar Kraken matador!', 'Olhos da Morte, matem o Caçador do Kraken!'],
  ['Eles ver seu morte.', 'Eles veem sua morte.'],
  ['Nos ver seu plano, humano!', 'Nós sacamos qual é a sua, humano!'],
  ['Aquele antigo forja uma vez forged poderosos magia itens.', 'Aquela antiga forja já forjou poderosos itens mágicos.'],
  ['tome trained mais poderosos heroes de ultimo age.', 'O tomo treinou os heróis mais poderosos da era passada.'],
  ['Se apenas um herói poderia liderar caminho.', 'Se ao menos um|uma herói|heroína pudesse nos guiar.'],
  ['Bem-vindo, guerreiro. Aproveitar Guild Hall.', 'Seja bem-vindo|bem-vinda, guerreiro|guerreira. Aproveite o Salão da Guilda.'],
  ['Bem-vindo, guerreiro. Aproveite o Salão da Guilda.', 'Seja bem-vindo|bem-vinda, guerreiro|guerreira. Aproveite o Salão da Guilda.'],
  ['Meu trabalho e para olhar depois estes fine criaturas.', 'Meu trabalho é cuidar dessas belas criaturas.'],
  ['Por Favor hatch mais eggs, amigo. Yval aqui pode como um bit mais company.', 'Por favor, choque mais ovos, amigo|amiga. O Yval aqui talvez goste de ter um pouco mais de companhia.'],
  ['Choque mais ovos, amigo. Talvez Yval queira mais companhia.', 'Por favor, choque mais ovos, amigo|amiga. O Yval aqui talvez goste de ter um pouco mais de companhia.'],
  ['Descricao em Portugues 86F793.', 'Sim.'],
  ['Derrotar five grande goblins e recuperar deles argolas de nariz', 'Derrote cinco goblins grandalhões e recupere as argolas de nariz deles'],
  ['Coletar nosering recompensa de Jarvis', 'Receba a recompensa das argolas com Jarvis'],
  ['Confiscate varinhas de goblin xamas', 'Confisque as varinhas dos xamãs goblins'],
  ['Virar varinhas ha para Jarvis', 'Entregue as varinhas para Jarvis'],
  ['Virar varinhas ha para Jerdus', 'Entregue as varinhas para Jerdus'],
  ['Expulsar volta goblin menace um goblin at um tempo', 'Contenha a ameaça goblin, um goblin de cada vez'],
  ['Dizer Jerdus isso e um poucos dozen goblins abaixo', 'Conte a Jerdus que algumas dezenas de goblins já caíram'],
  ['Ensinar goblin saqueadores um lesson', 'Dê uma lição nos saqueadores goblins'],
  ['Dizer Otto ele apenas precisa para limpar acima goblin bits', 'Conte a Otto que só falta limpar os restos de goblin'],
  ['Ajudar stem mortos-vivos tide', 'Ajude a conter a maré de mortos-vivos'],
  ['Dizer Herman shrine tem settled abaixo', 'Diga ao Herman que a situação no santuário se acalmou'],
  ['Seguir rio para Goblin Encampment', 'Siga o rio até o Acampamento Goblin'],
  ['Eu maravilha o que Sonho Dragao ele mencionou pode ser.', 'O que será esse Dragão dos Sonhos que ele mencionou?'],
  ['Em Desperto Mundo, pesadelos vir verdade.', 'No Mundo Desperto, os pesadelos se tornam realidade.'],
  ['Vindo aqui era um idiotic mistake, humano!', 'Vir aqui foi uma decisão estúpida, humano!'],
  ['Ele libertou para passaro', 'Ele libertou o pássaro!'],
  ['Eu era apenas kidding!', 'Brincadeirinha!'],
  ['Era só brincadeira!', 'Brincadeirinha!'],
  ['Bom um, estranho!', 'Muito bem, forasteiro|forasteira!'],
  ['Boa, forasteiro!', 'Muito bem, forasteiro|forasteira!'],
  ['Talvez outros eram certo...', 'Talvez os outros estivessem certos...'],
  ['Cortar ele|ela para pedacos!', 'Cortem ele|ela em pedaços!'],
  ['Vingar nosso caido guerra fera!', 'Vinguem nossa besta de guerra caída!'],
  ['Este de um tipo de duro...', 'Esse|Essa aqui é do tipo durão|durona...'],
  ['^tThis de um tipo de duro...', '^tEsse|Essa aqui é do tipo durão|durona...'],
  ['Eu nao precisa qualquer ajudar takin cuidar de alguns humano!', 'Não preciso de ajuda para cuidar de um|uma humano|humana!'],
  ['Tirem as mãos, seus brutamontes!', 'Tirem as mãos, seus desastrados!'],
  ['Nos Vamos ajudar voce chefe!', 'Vamos ajudar você, chefe!'],
  ['Nos Vamos salvar voce, Chefe!', 'Vamos salvar você, Chefe!'],
  ['Nos Vamos ajudar terminar ele afastado!', 'Vamos ajudar a acabar com ele!'],
  ['Nos Vamos ajudar terminar dela afastado!', 'Vamos ajudar a acabar com ela!'],
  ['Descricao em Portugues 75B92A.', 'Bah!'],
  ['Descricao em Portugues CEE7A5.', 'Gah!'],
  ['Nenhum! Meu precious nestlings!', 'Não! Meus preciosos filhotes!'],
  ['novo flock!', 'A nova ninhada!'],
  ['Proteger Morte Olho nests!', 'Protejam os ninhos dos Olhos da Morte!'],
  ['Nos venceu!', 'Nós vencemos!'],
  ['Eu veio volta uma vez, Eu deve novamente!', 'Eu já voltei uma vez, e voltarei de novo!'],
  ['Um humano escravo disturbs meu sonho.', 'Um escravo humano perturba meu sonho.'],
  ['Um dragao! Talvez este realmente e um sonho...', 'Um dragão! Talvez isso seja mesmo um sonho...'],
  ['Dawn e vindo...', 'O amanhecer está chegando...'],
  ['Nos erguer de terra abaixo.', 'Nós nos erguemos da terra abaixo.'],
  ['...Nephit... nao iria tem deixar este happen...', '...Nephit... não teria deixado isso acontecer...'],
  ['Oh...de tudo sumiram errado...', 'Ah... deu tudo errado...'],
]);

function unquoteYamlValue(value) {
  const trimmed = String(value ?? '').trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function readReviewedYamlTranslations() {
  const reviewDir = fs
    .readdirSync(path.join(repoRoot, 'docs'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("Wolf's End"))
    .map((entry) => path.join(repoRoot, 'docs', entry.name))[0];

  if (!reviewDir) {
    return {};
  }

  const yamlUpdates = {};
  for (const fileName of fs.readdirSync(reviewDir).filter((name) => name.endsWith('.yaml'))) {
    const lines = fs.readFileSync(path.join(reviewDir, fileName), 'utf8').split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const english = lines[index].match(/^\s*-\s+en:\s+(.+)\s*$/);
      if (!english) {
        continue;
      }

      let translated = '';
      for (let nextIndex = index + 1; nextIndex < Math.min(lines.length, index + 10); nextIndex += 1) {
        const pt = lines[nextIndex].match(/^\s+pt_br:\s+(.+)\s*$/);
        if (pt) {
          translated = unquoteYamlValue(pt[1]);
          break;
        }
      }

      const source = unquoteYamlValue(english[1]);
      if (source && translated) {
        yamlUpdates[source] = translated;
      }
    }
  }

  return yamlUpdates;
}

Object.assign(updates, readReviewedYamlTranslations(), updates);

let directCount = 0;
for (const [key, value] of Object.entries(updates)) {
  if (t[key] !== value) {
    t[key] = value;
    directCount += 1;
  }
}

let replacementCount = 0;
for (const key of Object.keys(t)) {
  let value = t[key];
  if (typeof value !== 'string') {
    continue;
  }
  for (const [from, to] of replacements) {
    if (value.includes(from)) {
      value = value.split(from).join(to);
    }
  }
  if (value !== t[key]) {
    t[key] = value;
    replacementCount += 1;
  }
}

fs.writeFileSync(dialoguePath, `${JSON.stringify(dialogue, null, '\t')}\n`, 'utf8');
console.log(`Applied ${directCount} direct Wolf's End updates and ${replacementCount} value replacements.`);
