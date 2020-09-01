const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

const enteredValue = prompt('Maximum Life for the player and monster', '100');

let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];
let isBattleLogEmpty = true;
let lastLoggedEntry;

if (isNaN(chosenMaxLife || chosenMaxLife <= 10)) {
  alert("Invalid input! default value of 100 is set!");
  chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };
  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = 'MONSTER';
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry.target = 'MONSTER';
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry.target = 'PLAYER';
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry.target = 'PLAYER';
      break;
    case LOG_EVENT_GAME_OVER:
      logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
  
    default:
      logEntry = {
        event: "There was nothing to log",
        value: 'no value has been changed',
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
  }

  // if (ev === LOG_EVENT_PLAYER_ATTACK) {
  //   logEntry.target = 'MONSTER';
  // } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
  //   logEntry.target = 'MONSTER';
  // } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
  //   logEntry.target = 'PLAYER';
  // } else if (ev === LOG_EVENT_PLAYER_HEAL) {
  //   logEntry.target = 'PLAYER';
  // } else if (ev === LOG_EVENT_GAME_OVER) { 
  //   logEntry = {
  //     event: ev,
  //     value: val,
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth
  //   };
  // }
  battleLog.push(logEntry);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert('bonus life consumed!');
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("you won!");
    writeToLog(
      LOG_EVENT_MONSTER_ATTACK,
      'PLAYER WON!',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("monster won!");
    writeToLog(
      LOG_EVENT_MONSTER_ATTACK,
      'MONSTER WON!',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("its a draw!");
    writeToLog(
      LOG_EVENT_MONSTER_ATTACK,
      'A DRAW!',
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMonster(mode) {
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;
  // if (mode === MODE_ATTACK) {
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK;
  // } else if (mode === MODE_STRONG_ATTACK) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(
    logEvent,
    damage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function attackHandler() {
  isBattleLogEmpty = false;
  attackMonster(MODE_ATTACK);
}
function strongAttackHandler() {
  isBattleLogEmpty = false;
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  isBattleLogEmpty = false;
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal to more than our max initial health.");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printLogHandler() {
  // for (let i = 0; i < battleLog.length; i++) {
  //   console.log('-------');
  //   console.log(battleLog[i]);
  // }

  // for(const logEntry of battleLog){
  //   console.log(logEntry);
  // }
  
  while (!!battleLog && isBattleLogEmpty) {
    console.log("There is no property in the log");
    alert("There is no log at this moment!");
    writeToLog(
      "NO LOG EVENT RECORDED",
      'NO VALUE RECORDED',
      currentMonsterHealth,
      currentPlayerHealth
    );
    isBattleLogEmpty = false;
    break;
  }

  let i = 0;
  for (const logEntry of battleLog) {
    if ((!lastLoggedEntry && lastLoggedEntry !== 0) || lastLoggedEntry < i) {
      console.log(`#${i}`);
      for (const key in logEntry) {
        console.log(`${key} => ${logEntry[key]}`);
      }
      lastLoggedEntry = i;
      break;
    }
    i++;
  }
}


attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);