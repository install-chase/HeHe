// Force desktop viewport to ensure all elements/easter eggs are visible on mobile
const viewportMeta = document.querySelector('meta[name="viewport"]');
if (viewportMeta) {
  viewportMeta.content = 'width=1024';
} else {
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=1024';
  document.head.appendChild(meta);
}
document.body.style.minWidth = '1024px';

const optionButtons = document.querySelectorAll('.opt-btn');
const chosenOption = document.getElementById('chosenOption');
const acceptBtn = document.getElementById('acceptBtn');
const bratBtn = document.getElementById('bratBtn');
const result = document.getElementById('result');
const mainHeadline = document.getElementById('mainHeadline');
const leadText = document.getElementById('leadText');
const finalHint = document.getElementById('finalHint');
const container = document.querySelector('.container');
const blastOverlay = document.getElementById('blastOverlay');
const insideJokeModal = document.getElementById('insideJokeModal');
const modalLine = document.getElementById('modalLine');
const closeModalBtn = document.getElementById('closeModalBtn');
const easterEggModal = document.getElementById('easterEggModal');
const eggLine = document.getElementById('eggLine');
const closeEggBtn = document.getElementById('closeEggBtn');
const letterRevealBtn = document.getElementById('letterRevealBtn');
const letterModal = document.getElementById('letterModal');
const letterTypeText = document.getElementById('letterTypeText');
const closeLetterBtn = document.getElementById('closeLetterBtn');
const gfSecretBtn = document.getElementById('gfSecretBtn');
const girlfriendModal = document.getElementById('girlfriendModal');
const gfYesBtn = document.getElementById('gfYesBtn');
const gfNotYetBtn = document.getElementById('gfNotYetBtn');
const gfStatus = document.getElementById('gfStatus');
const openGameBtn = document.getElementById('openGameBtn');
const chaosGameModal = document.getElementById('chaosGameModal');
const gameBoard = document.getElementById('gameBoard');
const gameTargetBtn = document.getElementById('gameTargetBtn');
const gameTimer = document.getElementById('gameTimer');
const gameScore = document.getElementById('gameScore');
const gameStatus = document.getElementById('gameStatus');
const startGameBtn = document.getElementById('startGameBtn');
const closeGameBtn = document.getElementById('closeGameBtn');
const bratSecretButtons = document.querySelectorAll('.brat-secret-btn');
const eyebrow = document.querySelector('.eyebrow');
const eggHintBtn = document.getElementById('eggHintBtn');
const footerSecretTap = document.getElementById('footerSecretTap');
const quizProgress = document.getElementById('quizProgress');
const quizQuestion = document.getElementById('quizQuestion');
const quizButtons = document.getElementById('quizButtons');
const quizStatus = document.getElementById('quizStatus');
const quizResetBtn = document.getElementById('quizResetBtn');

let selectedDate = null;
let eyebrowTapCount = 0;
let eyebrowTapTimer = null;
let footerTapCount = 0;
let footerTapTimer = null;
let typewriterTimer = null;
let gameIntervalId = null;
let gameIsRunning = false;
let gameTimeLeft = 15;
let gamePoints = 0;

const gameGoal = 12;
const gameDuration = 15;

const unlockedSecretSources = new Set();

const answers = {
  chaos: null,
  tone: null,
  future: null
};

const questionFlow = [
  {
    key: 'chaos',
    prompt: 'Which side of you is out tonight?',
    options: [
      { value: '0', label: 'Soft girl' },
      { value: '1', label: 'Brat but sweet' },
      { value: '2', label: 'Full menace' }
    ]
  },
  {
    key: 'tone',
    prompt: 'How do you like me to show up for you?',
    options: [
      { value: 'sweet', label: 'Warm + reassuring' },
      { value: 'witty', label: 'Teasing + witty' }
    ]
  },
  {
    key: 'future',
    prompt: 'What kind of convo do you want most?',
    options: [
      { value: '0', label: 'Light + flirty' },
      { value: '1', label: 'Deeper talk' }
    ]
  }
];

const fallbackCopy = {
  headline: 'For My Girl',
  leadHtml:
    'Your little "applicant queue" joke is ridiculous and I still love it. You are impossible in the cutest way, I could talk to you all day, and yeah... you are still applying for <strong>My Girl</strong>, Myszka.',
  hint: 'Be bratty if you want. I am still here, still choosing you.',
  noSelection: 'Pick how you want me tonight first.',
  selectedFormat: (date) => `You picked: ${date}. I am in.`,
  accepted: (date) => `Accepted. Tonight we do ${date}. I joke with you a lot, but I mean this for real.`,
  negotiations: ['Yeah yeah, keep talking. I still like you too much.']
};

const insideJokes = [
  'Update: she is kicking her feet while bullying me, and I still adore this dynamic.',
  'You bullied me and kicked your feet after. Unfortunately for me, that is charming.',
  'Menace level: high. Feet-kicking satisfaction: higher.',
  'You are probably kicking your feet right now, and yes, you are still my favorite, Myszka.'
];

const secretNotes = {
  tapThree:
    'On a real note, you make me really really happy, I hope this makes you feel atleast a little special, because you are.',
  tapTwo:
    'Just a reminder, I love all the moods, brat, soft, menace, bully. I just like being a part of your day.',
  tapWar:
    'Yeah, Id go to war for you'
};

const finalLetterMessage =
  " You are genuinely my favorite, Ive never smiled at my phone like such an idiot reading ur messages. Sprawiasz, że jestem napraawdę szczęśliwa.";

const bratSecretNotes = {
  push: [
    'You do the push-pull thing so well, and yeah, I love it.',
    'Push me away a little, I still come closer.',
    'You test me, I stay. Every time.'
  ],
  bully: [
    'Bully mode detected. I complain, then secretly love it.',
    'You bully me, then kick your feet. I see everything.',
    'You are mean in the cutest way possible.'
  ],
  mine: [
    'Still yours? yes. still mine? also yes.',
    'You can act tough, but you are still my girl.',
    'Short answer: yes. Longer answer: absolutely yes.'
  ]
};

const bratSecretToasts = [
  'secret brat button clicked...',
  'oh? found another one.',
  'you love these little secrets, huh.'
];

const missingDateReactions = [
  "Nice try, pick tonight's vibe first, menace.",
  "You skipped the date pick like a true brat. Choose one.",
  "Hold up, Myszka. Pick the plan first, then press ACCEPT.",
  "You clicked fast. I like it. Now pick tonight's vibe."
];

const buttonReactions = {
  accept: [
    'You clicked ACCEPT fast. I respect it.',
    'That was quick. You are very cute when decisive.',
    'That click had "kicking your feet" energy.',
    'You clicked ACCEPT like you already knew the answer.',
    'Decisive and dramatic. Very you.',
    'One click and you still got me smiling.',
    'You press ACCEPT like a pro brat.',
    'My favorite problem just clicked ACCEPT.'
  ],
  negotiate: [
    'Brat energy detected immediately.',
    'You clicked this like you do not already have me.',
    'Classic you: one click and suddenly there are new demands.',
    'Negotiation mode? You came ready to argue cute terms.',
    'Here we go, Myszka wants bonus perks again.',
    'You love pressing this one, huh.',
    'Push me all you want, I am not going anywhere.'
  ],
  reset: [
    'Starting over already? perfectionist brat behavior.',
    'Run it back then, I got you.',
    'You really said run that back.',
    'Restart button spam is very on brand for you.',
    'Again? okay, let us make it even cuter.',
    'Reset accepted. We do things your way.'
  ],
  closeModal: [
    'You closed it, but I still said what I said.',
    'You can close the pop-up, not my feelings.',
    'Nice try, that moment still counts.',
    'You closed the pop-up and still kept the compliment.',
    'Close button clicked. My point stands.',
    'You tried to exit, but the cute evidence remains.',
    'Close button works. My claim still stands.'
  ],
  quiz: {
    chaos: {
      'Soft girl': [
        'Soft girl selected. come here.',
        'Soft side out? yeah, I got you.',
        'Soft girl mode? I like this side of you.'
      ],
      'Brat but sweet': [
        'Brat but sweet selected. the classic combo.',
        'Brat but sweet? that is literally your brand.',
        'You picked brat but sweet like it was made for you.'
      ],
      'Full menace': [
        'Full menace selected. I expected nothing less.',
        'Full menace? yeah, accurate.',
        'Menace mode maxed. I am still staying.'
      ]
    },
    tone: {
      'Warm + reassuring': [
        'Warm + reassuring picked. say less.',
        'You want warmth? I got you, Myszka.',
        'Warm + reassuring selected. I will show up right.'
      ],
      'Teasing + witty': [
        'Teasing + witty picked. let the banter begin.',
        'Teasing + witty? perfect, keep up.',
        'Witty mode selected. this is gonna be fun.'
      ]
    },
    future: {
      'Light + flirty': [
        'Light + flirty selected. cute and dangerous.',
        'Light + flirty? perfect, let us be cute.',
        'Light + flirty mode on. I am with it.'
      ],
      'Deeper talk': [
        'Deeper talk selected. I like this.',
        'Deeper talk? I am listening for real.',
        'You picked deeper talk. good choice.'
      ]
    }
  },
  date: {
    'Call me on Discord': [
      'Call me on Discord picked. good, I just want your voice.',
      'You picked a call? yeah, I am all yours.',
      'Discord call it is. tell me everything.'
    ],
    'Watch with me': [
      'Watch with me picked. you are talking through half of it and I support it.',
      'You picked watch with me? I will press play when you do.',
      'Movie with you sounds perfect. commentary included.'
    ],
    'Game with me': [
      'Game with me picked. prepare for playful trash talk.',
      'You picked game with me? winner gets bragging rights and compliments.',
      'Game with me locked. do not be dramatic when I win.'
    ]
  }
};

const buttonToast = document.createElement('div');
buttonToast.className = 'button-toast';
buttonToast.setAttribute('aria-live', 'polite');
document.body.appendChild(buttonToast);

let toastTimeoutId = null;
const reactionBags = new Map();
const lastReaction = new Map();

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffledCopy(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function nextUniqueReaction(key, list) {
  if (!Array.isArray(list) || list.length === 0) {
    return '';
  }

  if (!reactionBags.has(key) || reactionBags.get(key).length === 0) {
    const bag = shuffledCopy(list);
    const last = lastReaction.get(key);
    if (bag.length > 1 && bag[0] === last) {
      bag.push(bag.shift());
    }
    reactionBags.set(key, bag);
  }

  const next = reactionBags.get(key).shift();
  lastReaction.set(key, next);
  return next;
}

function showButtonToast(message) {
  if (!message) {
    return;
  }

  buttonToast.textContent = message;
  buttonToast.classList.add('show');
  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
  }

  toastTimeoutId = setTimeout(() => {
    buttonToast.classList.remove('show');
  }, 1900);
}

function hasCompleteAnswers() {
  return Object.values(answers).every((value) => value !== null);
}

function firstUnansweredIndex() {
  return questionFlow.findIndex((item) => answers[item.key] === null);
}

function getProfileCopy() {
  if (!hasCompleteAnswers()) {
    return fallbackCopy;
  }

  const chaos = Number(answers.chaos);
  const future = Number(answers.future);
  const witty = answers.tone === 'witty';
  const intensity = chaos + future + (witty ? 1 : 0);

  const headline =
    intensity >= 3
      ? 'Yeah, You Are My Girl'
      : intensity === 2
        ? 'Still My Girl'
        : 'For My Girl';

  if (witty) {
    return {
      headline,
      leadHtml:
        'Your little "applicant queue" joke is chaotic, dramatic, and somehow very cute. You still got picked for <strong>My Girl</strong>.',
      hint: future
        ? 'Witty mode on. We joke heavy, but I am still intentional, Myszka.'
        : 'Witty mode on. Teasing allowed, effort still mandatory. So am I.',
      noSelection: 'Pick how you want me tonight first.',
      selectedFormat: (date) => `Locked in: ${date}. say less.`,
      accepted: (date) =>
        `Accepted. Tonight we do ${date}. You can bully me a little, but you are still mine in the cutest way.`,
      negotiations: [
        'Dramatic? yes. unreasonable? yes. still cute? unfortunately yes.',
        'You can bully me a little; I still flirt back harder.',
        'Brat privileges stay active. So do my feelings.',
        future
          ? 'Future note: baby-name debates allowed, and what matters to you matters to me.'
          : 'Future note: keep it playful tonight, still intentional always.',
        'Final note: yes, favoritism is absolutely happening.',
        'You do the push-pull thing, I do the \"still got you\" thing.'
      ]
    };
  }

  return {
    headline,
    leadHtml:
      'Your little "applicant queue" joke still gets on my nerves in the best way, and I could still talk to you all day. So yeah, you are still applying for <strong>My Girl</strong>.',
    hint: future
      ? 'Sweet mode on. Soft vibe, real intention.'
      : 'Sweet mode on. Playful outside, protective where it counts.',
    noSelection: 'Pick how you want me tonight first.',
    selectedFormat: (date) => `Chosen: ${date}. perfect.`,
    accepted: (date) =>
      `Accepted. Tonight is ${date}. You bring chaos, I bring consistency, and I keep you close.`,
    negotiations: [
      'Counteroffer accepted: extra affection plus a voice-note bonus.',
      'You can tease me; I am still showing up properly.',
      future
        ? 'Future note: we can start a baby-name shortlist when you feel like it.'
        : 'Future note: tonight we keep it light and still meaningful.',
      'Add-on accepted: one random compliment every call.',
      'You win this round. I still plan to out-flirt you.',
      'Act tough all you want, I am still looking out for you.'
    ]
  };
}

function syncCopy() {
  const copy = getProfileCopy();
  mainHeadline.textContent = copy.headline;
  leadText.innerHTML = copy.leadHtml;
  finalHint.textContent = copy.hint;

  if (!selectedDate) {
    chosenOption.textContent = 'No selection yet.';
  } else {
    chosenOption.textContent = copy.selectedFormat(selectedDate);
  }
}

function setAnswer(question, value) {
  answers[question] = value;
  renderInterview();
  syncCopy();
}

function renderInterview() {
  const pendingIndex = firstUnansweredIndex();

  if (pendingIndex === -1) {
    quizProgress.textContent = `All set - ${questionFlow.length}/${questionFlow.length}`;
    quizQuestion.textContent = 'Perfect. Vibe locked in.';
    quizButtons.innerHTML = '';
    quizStatus.textContent = 'If you want a different vibe, tap Start Over.';
    return;
  }

  const current = questionFlow[pendingIndex];
  quizProgress.textContent = `Question ${pendingIndex + 1} of ${questionFlow.length}`;
  quizQuestion.textContent = current.prompt;
  quizStatus.textContent = 'Pick one option to continue.';

  quizButtons.innerHTML = '';
  current.options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip-btn';
    button.textContent = option.label;
    button.addEventListener('click', () => {
      setAnswer(current.key, option.value);
      showButtonToast(
        nextUniqueReaction(
          `quiz-${current.key}-${option.label}`,
          buttonReactions.quiz[current.key][option.label]
        )
      );
    });
    quizButtons.appendChild(button);
  });
}

function resetInterview() {
  answers.chaos = null;
  answers.tone = null;
  answers.future = null;
  renderInterview();
  syncCopy();
}

optionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    optionButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    selectedDate = button.dataset.option;
    chosenOption.textContent = getProfileCopy().selectedFormat(selectedDate);
    showButtonToast(nextUniqueReaction(`date-${selectedDate}`, buttonReactions.date[selectedDate]));
  });
});

quizResetBtn.addEventListener('click', () => {
  resetInterview();
  showButtonToast(nextUniqueReaction('reset', buttonReactions.reset));
});

acceptBtn.addEventListener('click', () => {
  const copy = getProfileCopy();

  if (!selectedDate) {
    result.textContent = copy.noSelection;
    showButtonToast(nextUniqueReaction('missing-date', missingDateReactions));
    return;
  }

  result.textContent = copy.accepted(selectedDate);
  triggerSubmitBlast();
  showInsideJoke();
  showButtonToast(nextUniqueReaction('accept', buttonReactions.accept));
});

bratBtn.addEventListener('click', () => {
  result.textContent = randomFrom(getProfileCopy().negotiations);
  showButtonToast(nextUniqueReaction('negotiate', buttonReactions.negotiate));

  bratBtn.classList.remove('blast-shake');
  void bratBtn.offsetWidth;
  bratBtn.classList.add('blast-shake');
  setTimeout(() => {
    bratBtn.classList.remove('blast-shake');
  }, 560);
});

const canvas = document.getElementById('sparkleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
canvas.style.pointerEvents = 'none';

function resizeCanvas() {
  canvas.width = Math.max(document.documentElement.clientWidth, 1024);
  canvas.height = window.innerHeight;
  document.body.style.overflowX = 'auto';
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function confettiBurst() {
  const count = 190;
  const waves = [
    { x: canvas.width * 0.5, y: canvas.height * 0.42, spread: 12 },
    { x: canvas.width * 0.26, y: canvas.height * 0.58, spread: 10 },
    { x: canvas.width * 0.74, y: canvas.height * 0.58, spread: 10 },
    { x: canvas.width * 0.5, y: canvas.height * 0.68, spread: 9 }
  ];

  waves.forEach((wave) => {
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: wave.x,
        y: wave.y,
        vx: (Math.random() - 0.5) * wave.spread,
        vy: (Math.random() - 0.88) * (wave.spread + 2),
        size: Math.random() * 10 + 6,
        life: 130 + Math.random() * 70,
        hue: Math.random() > 0.45 ? 15 : 355
      });
    }
  });
}

function triggerSubmitBlast() {
  confettiBurst();
  container.classList.remove('blast-shake');
  container.classList.remove('blast-pulse');
  blastOverlay.classList.remove('active');

  // Force restart so rapid re-submits retrigger animations.
  void container.offsetWidth;
  container.classList.add('blast-shake');
  container.classList.add('blast-pulse');
  blastOverlay.classList.add('active');

  setTimeout(() => {
    container.classList.remove('blast-shake');
    container.classList.remove('blast-pulse');
    blastOverlay.classList.remove('active');
  }, 560);
}

function showInsideJoke() {
  modalLine.textContent = randomFrom(insideJokes);
  insideJokeModal.classList.add('show');
  insideJokeModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeInsideJoke() {
  insideJokeModal.classList.remove('show');
  insideJokeModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.body.style.overflowX = 'auto';
}

function showEasterEgg(message) {
  eggLine.textContent = message;
  easterEggModal.classList.add('show');
  easterEggModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeEasterEgg() {
  easterEggModal.classList.remove('show');
  easterEggModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.body.style.overflowX = 'auto';
}

function handleEyebrowTap(e) {
  if (e) e.preventDefault();
  eyebrowTapCount += 1;
  if (eyebrowTapTimer) {
    clearTimeout(eyebrowTapTimer);
  }

  if (eyebrowTapCount === 1) {
    showButtonToast('you are close... keep tapping');
  }

  if (eyebrowTapCount >= 3) {
    eyebrowTapCount = 0;
    showEasterEgg(secretNotes.tapThree);
    unlockLetter('tapThree');
    return;
  }

  eyebrowTapTimer = setTimeout(() => {
    eyebrowTapCount = 0;
  }, 2200);
}

function handleFooterTap(e) {
  if (e) e.preventDefault();
  footerTapCount += 1;
  if (footerTapTimer) {
    clearTimeout(footerTapTimer);
  }

  if (footerTapCount === 1) {
    showButtonToast('one more tap...');
  }

  if (footerTapCount >= 2) {
    footerTapCount = 0;
    showEasterEgg(secretNotes.tapTwo);
    unlockLetter('tapTwo');
    return;
  }

  footerTapTimer = setTimeout(() => {
    footerTapCount = 0;
  }, 1600);
}

function unlockLetter(source) {
  unlockedSecretSources.add(source);
  if (unlockedSecretSources.size >= 2) {
    letterRevealBtn.classList.add('show');
  }
}

function typeLetter(text) {
  if (typewriterTimer) {
    clearTimeout(typewriterTimer);
  }

  let index = 0;
  letterTypeText.textContent = '';

  function step() {
    letterTypeText.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) {
      typewriterTimer = setTimeout(step, 24);
    }
  }

  step();
}

function openLetter() {
  letterModal.classList.add('show');
  letterModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  typeLetter(finalLetterMessage);
}

function closeLetter() {
  letterModal.classList.remove('show');
  letterModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.body.style.overflowX = 'auto';
}

function openGirlfriendModal() {
  gfStatus.textContent = '';
  girlfriendModal.classList.add('show');
  girlfriendModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeGirlfriendModal() {
  girlfriendModal.classList.remove('show');
  girlfriendModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.body.style.overflowX = 'auto';
}

function moveGameTarget() {
  const boardRect = gameBoard.getBoundingClientRect();
  const targetRect = gameTargetBtn.getBoundingClientRect();
  const maxX = Math.max(0, boardRect.width - targetRect.width);
  const maxY = Math.max(0, boardRect.height - targetRect.height);
  const nextX = Math.random() * maxX;
  const nextY = Math.random() * maxY;
  gameTargetBtn.style.left = `${nextX}px`;
  gameTargetBtn.style.top = `${nextY}px`;
}

function stopGameTimer() {
  if (gameIntervalId) {
    clearInterval(gameIntervalId);
    gameIntervalId = null;
  }
}

function resetGameBoard() {
  stopGameTimer();
  gameIsRunning = false;
  gameTimeLeft = gameDuration;
  gamePoints = 0;
  gameTimer.textContent = `time: ${gameDuration}s`;
  gameScore.textContent = `score: 0/${gameGoal}`;
  gameStatus.textContent = 'tap start when ready.';
  gameTargetBtn.classList.remove('show');
  startGameBtn.textContent = 'start';
}

function finishGame() {
  stopGameTimer();
  gameIsRunning = false;
  gameTargetBtn.classList.remove('show');
  startGameBtn.textContent = 'play again';

  if (gamePoints >= gameGoal) {
    gameStatus.textContent = 'clean win. you are dangerously good at this.';
    showButtonToast('chaos mode champion unlocked.');
    confettiBurst();
    return;
  }

  gameStatus.textContent = `you got ${gamePoints}/${gameGoal}. run it back.`;
  showButtonToast('close. one more round?');
}

function startGameRound() {
  stopGameTimer();
  gameIsRunning = true;
  gameTimeLeft = gameDuration;
  gamePoints = 0;
  gameTimer.textContent = `time: ${gameTimeLeft}s`;
  gameScore.textContent = `score: ${gamePoints}/${gameGoal}`;
  gameStatus.textContent = 'go go go.';
  gameTargetBtn.classList.add('show');
  startGameBtn.textContent = 'restart';
  moveGameTarget();

  gameIntervalId = setInterval(() => {
    gameTimeLeft -= 1;
    gameTimer.textContent = `time: ${Math.max(0, gameTimeLeft)}s`;
    if (gameTimeLeft <= 0) {
      finishGame();
    }
  }, 1000);
}

function openGameModal() {
  resetGameBoard();
  chaosGameModal.classList.add('show');
  chaosGameModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeGameModal() {
  resetGameBoard();
  chaosGameModal.classList.remove('show');
  chaosGameModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.body.style.overflowX = 'auto';
}

function drawSpark(x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, size / 3.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHeart(x, y, size, color, wobble) {
  ctx.save();
  ctx.translate(x, y + wobble);
  ctx.scale(size / 16, size / 16);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.bezierCurveTo(8, -16, 22, -8, 0, 16);
  ctx.bezierCurveTo(-22, -8, -8, -16, 0, -4);
  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter((p) => p.life > 0);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12;
    p.life -= 1;
    const alpha = Math.max(0, p.life / 220);
    const wobble = Math.sin((140 - p.life) * 0.16) * 1.6;
    drawHeart(p.x, p.y, p.size, `hsla(${p.hue}, 82%, 58%, ${alpha})`, wobble);
    drawSpark(p.x, p.y, p.size, `hsla(${p.hue + 18}, 90%, 78%, ${alpha * 0.9})`);
  });

  requestAnimationFrame(animate);
}

renderInterview();
syncCopy();
animate();

closeModalBtn.addEventListener('click', () => {
  closeInsideJoke();
  showButtonToast(nextUniqueReaction('close-modal', buttonReactions.closeModal));
});
closeEggBtn.addEventListener('click', closeEasterEgg);
bratSecretButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const key = button.dataset.secret;
    const message =
      key === 'war'
        ? secretNotes.tapWar
        : nextUniqueReaction(`brat-secret-${key}`, bratSecretNotes[key]);
    showEasterEgg(message);
    unlockLetter(`brat-${key}`);
    showButtonToast(nextUniqueReaction('brat-secret-toast', bratSecretToasts));
  });
});
letterRevealBtn.addEventListener('click', openLetter);
closeLetterBtn.addEventListener('click', closeLetter);
gfSecretBtn.addEventListener('click', () => {
  openGirlfriendModal();
  showButtonToast('real question, no games.');
});
gfYesBtn.addEventListener('click', () => {
  gfStatus.textContent =
    'so i can call you my girlfriend now, right?';
  showButtonToast('yeah, i am definitely smiling right now.');
});
gfNotYetBtn.addEventListener('click', () => {
  gfStatus.textContent =
    "all good. i'm still here, and i'm still serious about you. we keep building.";
  showButtonToast('we keep building, no weirdness.');
});
openGameBtn.addEventListener('click', () => {
  openGameModal();
  showButtonToast('bonus round opened.');
});
startGameBtn.addEventListener('click', () => {
  startGameRound();
});
closeGameBtn.addEventListener('click', closeGameModal);
gameTargetBtn.addEventListener('click', () => {
  if (!gameIsRunning) {
    return;
  }

  gamePoints += 1;
  gameScore.textContent = `score: ${gamePoints}/${gameGoal}`;
  moveGameTarget();

  gameTargetBtn.classList.remove('pop');
  void gameTargetBtn.offsetWidth;
  gameTargetBtn.classList.add('pop');

  if (gamePoints >= gameGoal) {
    finishGame();
  }
});
eyebrow.addEventListener('click', handleEyebrowTap);
eggHintBtn.addEventListener('click', handleEyebrowTap);
footerSecretTap.addEventListener('click', handleFooterTap);
insideJokeModal.addEventListener('click', (event) => {
  if (event.target === insideJokeModal) {
    closeInsideJoke();
  }
});
easterEggModal.addEventListener('click', (event) => {
  if (event.target === easterEggModal) {
    closeEasterEgg();
  }
});
letterModal.addEventListener('click', (event) => {
  if (event.target === letterModal) {
    closeLetter();
  }
});
girlfriendModal.addEventListener('click', (event) => {
  if (event.target === girlfriendModal) {
    closeGirlfriendModal();
  }
});
chaosGameModal.addEventListener('click', (event) => {
  if (event.target === chaosGameModal) {
    closeGameModal();
  }
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeInsideJoke();
    closeEasterEgg();
    closeLetter();
    closeGirlfriendModal();
    closeGameModal();
  }
});
