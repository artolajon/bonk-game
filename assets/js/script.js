

const hitDog = (event) =>{
  let target = event.target;
  target.classList.add('bonk');
  new Audio('./assets/sounds/bonk_sound_effect.ogg').play();
  setTimeout(()=> document.body.removeChild(target),1000);
  
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
  let div = createDogDiv();
  document.body.appendChild(div);
  animateDiv(div);
}

$(document).ready(function(){
  setInterval(() => addADog(), 1000);
  
});