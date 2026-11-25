const deadCounter = document.getElementById("dead");
const lostCounter = document.getElementById("lost");
const winScore = 10;
const loseScore = 5;

const getHole = (index) => document.getElementById(`hole${index}`);

const resetStats = () => {
  deadCounter.textContent = 0;
  lostCounter.textContent = 0;
};

for (let index = 1; index <= 9; index++) {
  const hole = getHole(index);

  hole.onclick = () => {
    if (hole.classList.contains("hole_has-mole")) {
      deadCounter.textContent = Number(deadCounter.textContent) + 1;
    } else {
      lostCounter.textContent = Number(lostCounter.textContent) + 1;
    }

    if (Number(deadCounter.textContent) === winScore) {
      alert("Победа! Вы убили " + winScore + " кротов");
      resetStats();
    } else if (Number(lostCounter.textContent) === loseScore) {
      alert("Вы проиграли!");
      resetStats();
    }
  };
}
