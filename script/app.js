// const server = "http://localhost:7800/api/v1/";

const server = "https://serverasmjs.herokuapp.com/api/v1/";
const listNew = document.getElementById("list-new");
const avt = document.getElementById("avt");
const imgArea = document.querySelector(".img-area");
const closePlayer = document.querySelector(".close-player");
const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  mainAudio = wrapper.querySelector("#main-audio"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  moreMusicBtn = wrapper.querySelector("#more-music"),
  closemoreMusic = musicList.querySelector("#close");
const ulTag = wrapper.querySelector("ul");

let isMusicPaused = true;

const service = {
  getList: async () => {
    const rs = await fetch(`${server}getdata`);
    return await rs.json();
  },
  getByName: async (name) => {
    const rs = await fetch(`${server}music/${name}`);
    return await rs.json();
  },
  getTop: async () => {
    const rs = await fetch(`${server}topmusic `);
    return await rs.json();
  },
};

const renderDefaul = async () => {
  const rs = await service.getList();

  listNew.innerHTML = "";
  rs.data.forEach((element) => {
    listNew.innerHTML += `  <div class="card 2" onclick="clickMusic('${element.url}')" >
    <div class="card_image">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcFqeDJ95GLl26Un2zi-Icnkj-fRyM-buCnQ&usqp=CAU"
      />
    </div>
    <div class="card_title title-white">
      <p>${element.name}</p>
    </div>
  </div>`;
  });
};

const renderTop = async () => {
  const rs = await service.getTop();
  const listTop = document.getElementById("list-song-top");
  listTop.innerHTML = "";
  rs.data.forEach((element) => {
    listTop.innerHTML += ` 
    <article class="leaderboard__profile onclick="onclick="clickMusic('${element.url}')">
                  <span class="leaderboard__value">${element.top}</span>
                  <img
                    src="${element.avt}"
                    alt=" song"
                    class="leaderboard__picture"
                  />
                  <span class="leaderboard__name">${element.name}</span>
                </article>
    `;
  });
};

const clickMusic = async (name) => {
  const title = document.querySelector(".song-details .name");
  const artist = document.querySelector(".song-details .artist");

  const music = await service.getByName(name);

  if (!music.data.music) return alert("Sorry! Music error, please try again.");

  mainAudio.src = music.data.music;
  avt.src = music.data.avt;
  title.innerText = music.data.name;
  artist.innerText = music.data.singer;
  document.getElementsByClassName("d-flex")[0].classList.remove("full");
  playMusic();
};

function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
  imgArea.classList.add("playing");
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
  imgArea.classList.remove("playing");
}

playPauseBtn.addEventListener("click", () => {
  const isMusicPlay = wrapper.classList.contains("paused");

  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuartion = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", () => {
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });

  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e) => {
  let progressWidth = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic();
  playingSong();
});

closePlayer.addEventListener("click", () => {
  pauseMusic();
  document.getElementsByClassName("d-flex")[0].classList.add("full");
});

function playingSong() {
  const allLiTag = ulTag.querySelectorAll("li");

  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");

    if (allLiTag[j].classList.contains("playing")) {
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    if (allLiTag[j].getAttribute("li-index") == musicIndex) {
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

// document.getElementById('').getAttribute

const changeTab = (e) => {
  const target = e.getAttribute("data-target");

  const listHeader = document.querySelectorAll("main>div");

  console.log(listHeader);

  document.querySelectorAll(".links>a").forEach((el) => {
    el.classList.remove("selected");
  });

  listHeader.forEach((el) => {
    el.classList.remove("selected");
  });

  e.classList.add("selected");

  document.getElementById(target).classList.add("selected");
};

window.onload = () => {
  renderDefaul();
  renderTop();
};
