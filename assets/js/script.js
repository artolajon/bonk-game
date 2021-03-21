
const SPAWN_TIME_STARTING = 1000;
const SPAWN_TIME_MIN = 100;
const ENEMY_LIMIT=20;
const MAP_SIZE ={
  x: window.innerWidth - 100,
  y: window.innerHeight - 142
}


let spawnTime;
let startDatetime;
let enemyNumber = 0;
let muted=false;

const hitDog = (event) =>{
  let target = event.target;
  if (!target.classList.contains('bonk'))
  {
    enemyNumber--;
    target.classList.add('bonk');
    if (!muted)
      new Audio('./assets/sounds/bonk_sound_effect.ogg').play();
    setTimeout(()=> document.body.removeChild(target),1000);
  }
}

const createDogDiv = ()=> {
  let div = document.createElement('div');
  div.classList.add('dog');
  div.addEventListener('click', (e) => hitDog(e));

  let newPos = makeNewPosition();
  div.style.top= newPos.y+'px';
  div.style.left= newPos.x+'px';

  return div;
}


const makeNewPosition = () => {
  let nh = Math.floor(Math.random() * MAP_SIZE.y);
  let nw = Math.floor(Math.random() * MAP_SIZE.x);
  
  return {y:nh, x:nw};
}

const animateDiv = (div) => {
  let newPos = makeNewPosition();
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
  spawnTime -= spawnTime * 0.1;
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

const hideElement = (id, deleteNode = false) => {
  let element = document.getElementById(id);
  if(deleteNode){
    document.body.removeChild(element);
  }else{
    if (!element.classList.contains('hidden'))
      element.classList.add('hidden')
  }
}


const setScore = (score) => {
  let element = document.getElementById('score');
  element.textContent = score;
}


const showElement = (name) => {
  let div = document.getElementById(name);
  div.classList.remove('hidden');
}

const diableReplay=()=>{
  let endMenu = document.getElementById("end");
  let replayButton = endMenu.getElementsByTagName("button");
  replayButton[0].disabled = true;

  setTimeout(() => replayButton[0].disabled = false, 1000);
}

const updateSpawnTimeText = () =>{
  let perSecond=1000/spawnTime;
  document.getElementById("spawn-time").textContent = `${perSecond.toFixed(1)}/1s`;
}


const nextLevel = () => {
  updateSpawnTimeText();
  setSmallerSpawnTime();

}

const levelController = () => {
  updateSpawnTimeText();
  setInterval(()=> {
    nextLevel();
  }, 5000);
}

const startGame = async () =>{
  hideElements("menu");
  

  spawnTime = SPAWN_TIME_STARTING;
  let startDatetime = new Date();
  enemyNumber = 0;
  levelController();
  showElement("game-status");

  while(true){
    addADog();
    if (enemyNumber > ENEMY_LIMIT){
      break;
    }
    await wait(spawnTime);
  }
  hideElements("dog", true);
  let endDatetime = new Date();
  let playedTime = (endDatetime - startDatetime) / 1000;
  hideElement("game-status");
  setScore(playedTime);
  diableReplay()
  showElement("end");
}
