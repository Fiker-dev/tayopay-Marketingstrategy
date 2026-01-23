const card = document.getElementById("videoCard");
const modal = document.getElementById("videoModal");
const video = modal.querySelector("video");

card.onclick = () => {
  modal.style.display = "grid";
  video.play();
};

modal.onclick = () => {
  video.pause();
  modal.style.display = "none";
};
