
const SPAWN_TIME_STARTING = 1000;
const SPAWN_TIME_MIN = 100;
const ENEMY_LIMIT=30;



let spawnTime;
let startDatetime;
let enemyNumber = 0;


const hitDog = (event) =>{
  let target = event.target;
  if (!target.classList.contains('bonk'))
  {
    enemyNumber--;
    target.classList.add('bonk');
    new Audio('./assets/sounds/bonk_sound_effect.ogg').play();
    setTimeout(()=> document.body.removeChild(target),1000);
  }
}

const createDogDiv = ()=> {
  let div = document.createElement('div');
  div.classList.add('dog');
  div.addEventListener('click', (e) => hitDog(e));

  var newPos = makeNewPosition();
  div.style.top= newPos.y+'px';
  div.style.left= newPos.x+'px';

  return div;
}


const makeNewPosition = () => {
  var h = $(window).height() - 142;
  var w = $(window).width() - 100;
  
  var nh = Math.floor(Math.random() * h);
  var nw = Math.floor(Math.random() * w);
  
  return {y:nh, x:nw};
}

const animateDiv = (div) => {
  var newPos = makeNewPosition();
  $(div).animate({ top: newPos.y, left: newPos.x }, 2000,   function(){
    animateDiv(div);        
  });
};

const addADog = () => {
  enemyNumber++;
  let div = createDogDiv();
  document.body.appendChild(div);
  animateDiv(div);
}

const wait = async (ms) => {
  await new Promise(resolve => setTimeout(resolve, ms));
}

const setSmallerSpawnTime = () =>{
  spawnTime -= spawnTime * 0.05;
  if (spawnTime < SPAWN_TIME_MIN){
    spawnTime = SPAWN_TIME_MIN;
  }
}

const hideElements = (className, deleteNode = false) => {
  let elementsCollection = document.getElementsByClassName(className);
  let array = [...elementsCollection];
  array.forEach(element => {
    if(deleteNode){
      document.body.removeChild(element);
    }else{
      if (!element.classList.contains('hidden'))
        element.classList.add('hidden')
    }
    
  });
}


const setScore = (score) => {
  let element = document.getElementById('score');
  element.textContent = score;
}


const showEnd = () => {
  let endMenu = document.getElementById("end");
  let replayButton = endMenu.getElementsByTagName("button");
  replayButton[0].disabled = true;

  endMenu.classList.remove('hidden');
  setTimeout(() => replayButton[0].disabled = false, 1000);
}

const startGame = async () =>{
  hideElements("menu");

  spawnTime = SPAWN_TIME_STARTING;
  let startDatetime = new Date();
  enemyNumber = 0;

  while(true){
    addADog();
    if (enemyNumber > ENEMY_LIMIT){
      break;
    }
    await wait(spawnTime);
    setSmallerSpawnTime();    
  }
  hideElements("dog", true);
  let endDatetime = new Date();
  var playedTime = (endDatetime - startDatetime) / 1000;
  setScore(playedTime);
  showEnd();
}