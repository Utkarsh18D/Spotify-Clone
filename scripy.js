console.log("Spotify clone");
let currentsong = new Audio();
currplaylist = "songs";
let currind = -1;
let playing = 0;
currentsong.volume = 0;
// to get songs from folder
async function fetchsongs(folder) {
  let x = await fetch(`http://127.0.0.1:5500/SPOTIFY/${folder}`);
  let response = await x.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let songs = div.getElementsByTagName("a");
  let mp4s = [];
  for (let i = 0; i < songs.length; i++) {
    if (songs[i].href.endsWith(".mp4")) {
      mp4s.push(songs[i].href);
    }
  }
  return mp4s;
}
// display on left andplaying song
async function main(playlist = "songs") {
  let songs = await fetchsongs(playlist);
  let left = document.querySelector(".left");
  let songlist = document.createElement("div");
  songlist.className = "songlist";
  left.append(songlist);
  currentsong.src = songs[0];
  currind = 0;
  let trackdetails = document.querySelector(".trackdetails");
  trackdetails.textContent = songs[0].split(`/${playlist}/`)[1];
  for (let i = 0; i < songs.length; i++) {
    let div = document.createElement("div");
    div.classList.add("card");
    const img = document.createElement("img");
    img.className = "musiciconcard";
    img.src = "musicicon.svg";
    div.append(img);
    songlist.append(div);
    div.innerHTML += `${i + 1} ` + songs[i].split(`/${playlist}/`)[1];
    div.id = songs[i].split(`/${playlist}/`)[1];
    const img1 = document.createElement("img");
    img1.src = "greenplay.svg";
    img1.className = "playbuttoncard";
    div.append(img1);
    div.addEventListener("mouseover", () => {
      img1.style.opacity = 1;
    });
    div.addEventListener("mouseout", () => {
      img1.style.opacity = 0;
    });
    div.addEventListener("click", () => {
      try {
        currentsong.src = songs[i];
        let trackdetails = document.querySelector(".trackdetails");
        trackdetails.textContent = songs[i].split(`/${playlist}/`)[1];
        currind = i;
        currentsong.volume = document.querySelector(".Volumebar").value / 100;
        currentsong.play();
        console.log(`Playing ${div.innerHTML}`);
      } catch (error) {
        console.log("Playback failed:", error);
      }
    });
  }
};
main()
// next prev pause
async function nextprev(active,playlist) {
  let songs = await fetchsongs(playlist);
  if (active == 1) {
    try {
      if (currind + 1 == songs.length) {
        console.log("Next not available resetting ");
        currentsong.src = songs[0];
        currind = 0;
      } else {
        currentsong.src = songs[currind + 1];
        currind++;
      }
      currentsong.volume = document.querySelector(".Volumebar").value / 100;
        let trackdetails = document.querySelector(".trackdetails");
        trackdetails.textContent = songs[currind].split(`/${playlist}/`)[1];
        currentsong.play();
        console.log(`Playing ${songs[currind + 1]}`);
    } catch (error) {
      console.log("Playback failed:", error);
    }
  } else if (active == 2) {
    try {
      if (currind <= 0) {
        console.log("Prev not available playing 1 track");
        currind = 0;
        currentsong.src = songs[currind];
      } else {
        currentsong.src = songs[currind - 1];
        currind--;
      }
      currentsong.volume = document.querySelector(".Volumebar").value / 100;
        let trackdetails = document.querySelector(".trackdetails");
        trackdetails.textContent = songs[currind].split(`/${playlist}/`)[1];
        currentsong.play();
        console.log(`Playing ${songs[currind - 1]}`);
    } catch (error) {
      console.log("Playback failed:", error);
    }
  } else {
    try {
      if (currentsong.src == " ") {
        return;
      }
      if (!currentsong.paused) {
        currentsong.pause();
        console.log("paused");
      } else {
        currentsong.volume = 1;
        currentsong.play();
        console.log("continue playing");
      }
    } catch (error) {
      console.log("Not able too");
    }
  }
}
let next = document.querySelector(".next");
let prev = document.querySelector(".prev");
let playpause = document.querySelector(".pauseplay");
next.addEventListener("click", () => {
  nextprev(1,currplaylist);
});
prev.addEventListener("click", () => {
  nextprev(2,currplaylist);
});
playpause.addEventListener("click", () => {
  nextprev(3,currplaylist);
});
//voulme bar
let volumebar = document.querySelector(".Volumebar");
volumebar.addEventListener("input", () => {
  currentsong.volume = volumebar.value / 100;
  console.log(currentsong.volume);
});
// play from card
async function q(a) {
  let songs = await fetchsongs("songs");
  let songs1 = document.querySelectorAll(".card");
  for (let i = 0; i < songs.length; i++) {
    let x = songs1[i].id.toLowerCase();
    if (x.includes(a)) {
      currentsong.src = songs[i];
      currind = i;
      currentsong.volume = document.querySelector(".Volumebar").value / 100;
      let trackdetails = document.querySelector(".trackdetails");
      trackdetails.textContent = currentsong.src.slice(36);
      currentsong.play();
      console.log(`playing ${x}`);

      break;
    }
  }
  if(currplaylist!="songs") {
    currplaylist = "songs";
    main("songs");
  }
}
let a = document.querySelectorAll(".play1");
for (let abc = 0; abc < a.length; abc++) {
  a[abc].addEventListener("click", (e) => {
    if(currplaylist!="songs") {
      document.querySelector(".songlist").innerHTML = ""
      main("songs");
      currplaylist = "songs"
    }
    let b = a[abc].children[1].textContent.toLowerCase();
    q(b);
  });
}
let circle = document.querySelector(".circle");
let seekbar = document.querySelector(".seekbar");
let timer = document.querySelector(".songtimer");
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}
currentsong.addEventListener("timeupdate", () => {
  let left = ((currentsong.currentTime / currentsong.duration) * 100).toFixed(
    0
  );
  circle.style.left = `${left}%`;
  seekbar.style.background = `linear-gradient(to right, white ${left}%, green ${left}%)`;
  let s = "";
  let currtime = formatTime(currentsong.currentTime);
  let duration = formatTime(currentsong.duration);
  s += currtime;
  s += "/";
  s += duration;
  timer.textContent = s;
  if (currentsong.ended) {
    console.log(left)
    nextprev(1,currplaylist);
  }
});
document.addEventListener("keypress", (e) => {
  if (e.code == "Space") {
    nextprev(3,currplaylist);
  }
});
document.querySelectorAll(".playdy").forEach(e=> {
    e.addEventListener("click",()=> {
  if(currplaylist == e.id) {
    console.log("skip")
  }
  else {
  console.log("resetting inner html")
    document.querySelectorAll(".songlist").forEach(e => {
      e.innerHTML = "";
    })
    currplaylist = e.id;
    document.querySelector(".text").textContent = e.id;
    main(e.id)
  }
})
})
document.querySelector(".logo").addEventListener("click",()=> {
    location.href = "index.html"
})

document.querySelector(".seekbar").addEventListener("click",(e)=> {
  let percent = ((e.clientX-504)/(1958-503));
  let position = currentsong.duration*percent
  currentsong.currentTime = position
  console.log(e,percent,position)
})