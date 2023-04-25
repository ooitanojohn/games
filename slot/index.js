let sec = 500;          //スロットのリール回転速度(実行毎秒数)
let stopReelFlag = [];  //スロットのリール停止フラグ
let reelCounts = [];    //どの画像をどの位置にさせるか
let slotFrameHeight;    //フレームの大きさ
let slotReelsHeight;    //リール(画像)全体の大きさ
let slotReelItemHeight; //リール(画像)1個の大きさ
let slotReelStartHeight;//画像の初期値
let slot_pattern = [];
let hit_img;
let hit = document.getElementById("hit");
let slot_frame = document.getElementById("slot-frame"); 
let reel = document.getElementsByClassName("reel");
let reels = document.getElementsByClassName("reels");
let start_btn = document.getElementById("start-btn");
let stop_btn = document.getElementsByClassName("stop-btn");
let Slot = {
  init: function() {
    stopReelFlag[0] = stopReelFlag[1] = stopReelFlag[2] = false;
    reelCounts[0] = reelCounts[1] = reelCounts[2] = 0;
  },
  start: function () {
    Slot.init();
    for (let index = 0; index < 3; index++) {
      Slot.animation(index);
    }
  },
  stop: function (i) {
    stopReelFlag[i] = true;
    if (stopReelFlag[0] && !stopReelFlag[1] && !stopReelFlag[2]){
      slot_pattern.push(reels[0].children[8 - reelCounts[0]].getAttribute('data-val'));
    } else if (stopReelFlag[0] && stopReelFlag[1] && !stopReelFlag[2]) {
      slot_pattern.push(reels[1].children[8 - reelCounts[1]].getAttribute('data-val'));
    } else if (stopReelFlag[0] && stopReelFlag[1] && stopReelFlag[2]) {
      slot_pattern.push(reels[2].children[8 - reelCounts[2]].getAttribute('data-val'));
    }
    if (stopReelFlag[0] && stopReelFlag[1] && stopReelFlag[2]) {
      start_btn.removeAttribute("disabled");
      if(slot_pattern.every(value => value === slot_pattern[0])){
        hit_img = slot_pattern[0];
        Slot.hit();
      };
      slot_pattern = [];
    }
  },
  hit: function(){
    let hit_message;
    if (hit_img == "chopper"){
      hit_message = "タ、タヌキじゃねーよっ";
    } 
    hit_img = document.querySelectorAll(`[data-val="${hit_img}"]`);
    hit_img = hit_img[1].innerHTML;
    setTimeout(()=>{
      hit.innerHTML = hit_img;
      hit.innerHTML += `<span id='hit_message'>${hit_message}</span>`;
    }, 1000);
    setTimeout(() => {
      hit.innerHTML = "";
    }, 5000);
  },
  resetLocationInfo: function () {
    slotFrameHeight = slot_frame.offsetHeight;
    slotReelsHeight = reels[0].offsetHeight;
    slotReelItemHeight = reel[0].offsetHeight;
    slotReelStartHeight = -slotReelsHeight;
    slotReelStartHeight = slotReelStartHeight + slotFrameHeight
                             - (slotFrameHeight / 2) + slotReelItemHeight * 3 / 2;
    for (let i = 0; i < reels.length; i++){
      reels[i].style.top = String(slotReelStartHeight) + "px";
    }
  },
  animation: function (index) {
    if (reelCounts[index] >= 8) {
      reelCounts[index] = 0;
    }
    $('.reels').eq(index).animate({
      'top': slotReelStartHeight + (reelCounts[index] * slotReelItemHeight)
    }, {
      duration: sec,
      easing: 'linear',
      complete: function () {
        if (stopReelFlag[index]) {
          return;
        }
        reelCounts[index]++;
        Slot.animation(index);
      }
    });
  },
};
window.onload = function () {
  Slot.init();
  Slot.resetLocationInfo();
  start_btn.addEventListener("click", function(e){
    e.target.setAttribute("disabled", true)
    Slot.start();
    for(let i = 0; i < stop_btn.length; i++){
      stop_btn[i].removeAttribute("disabled");
    }
  });
  for(let i = 0; i < stop_btn.length ; i++ ){
    stop_btn[i].addEventListener("click", function (e) {
      Slot.stop(e.target.getAttribute('data-val'));
    })
  }
};