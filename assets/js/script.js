let n = 0, team = 0, turnTeam = 0, attempt = 0, s = [0, 0], sec = 20, locked = false, timer, started = false;
const names = ["NEXUS", "ELITE ODYSSEY"], letters = ["A", "B", "C", "D"];

function startGame() {
  started = true;
  document.getElementById("startScreen").style.display = "none";
  game.style.display = "block";
  load();
}

function load() {
  clearInterval(timer);
  sec = 20;
  locked = true;
  timerEl().textContent = 20;
  timerEl().className = "timer";
  document.getElementById("pt").textContent = "Question " + (n + 1) + " of 50";
  document.getElementById("pb").style.width = ((n + 1) / 50 * 100) + "%";
  document.getElementById("turn").textContent = "TEAM " + (team ? "B" : "A") + " • " + names[team] + " — YOUR TURN";
  ta.classList.toggle("active", !team);
  tb.classList.toggle("active", !team);
  document.getElementById("q").textContent = data[n][0];
  document.getElementById("q").style.display = "block";
  document.getElementById("qstart").style.display = "block";
  document.getElementById("qstartTitle").textContent = "Question " + (n + 1) + " Ready";
  document.getElementById("questionStartBtn").disabled = false;
  document.getElementById("notice").className = "notice";
  document.getElementById("notice").textContent = "Read the question and options. Click Start Timer when ready.";
  next.disabled = true;
  opts.innerHTML = "";
  data[n][1].forEach((x, i) => {
    let b = document.createElement("button");
    b.className = "opt";
    b.innerHTML = "<span>" + letters[i] + "</span>" + x;
    b.onclick = () => answer(i, b);
    opts.appendChild(b);
  });
}

function startQuestion() {
  if (!started) return;
  locked = false;
  document.getElementById("qstart").style.display = "none";
  document.getElementById("q").style.display = "block";
  document.getElementById("notice").className = "notice";
  document.getElementById("notice").textContent = "Timer started! Select an answer. You have 20 seconds.";
  document.getElementById("questionStartBtn").disabled = true;
  sec = 20;
  timerEl().textContent = 20;
  timerEl().className = "timer";
  clearInterval(timer);
  timer = setInterval(() => {
    sec--;
    timerEl().textContent = sec;
    if (sec <= 5) timerEl().className = "timer danger";
    if (sec <= 0) {
      clearInterval(timer);
      timeUp();
    }
  }, 1000);
}

function timerEl() {
  return document.getElementById("timer");
}

function disable() {
  document.querySelectorAll(".opt").forEach(x => x.disabled = true);
}

function showRightAnswer() {
  document.querySelectorAll(".opt")[data[n][2]].classList.add("correct");
}

function answer(i, b) {
  if (locked) return;
  locked = true;
  clearInterval(timer);
  disable();
  let a = data[n][2];
  if (i === a) {
    s[team]++;
    document.getElementById(team ? "sb" : "sa").textContent = s[team];
    b.classList.add("correct");
    notice.className = "notice right";
    notice.innerHTML = "✓ Correct! " + names[team] + " gets +1 point and keeps control for the next question.<br><span class='why'>💡 " + data[n][3] + "</span>";
    next.disabled = false;
  } else {
    b.classList.add("wrong");
    pass("✗ Wrong Answer!");
  }
}

function timeUp() {
  if (locked) return;
  locked = true;
  disable();
  notice.className = "notice wrongN";
  if (attempt === 0) {
    notice.textContent = "⏱ Time Up! No answer from " + names[team] + ". Passing this question to " + names[1 - team] + ".";
    attempt = 1;
    team = 1 - team;
    setTimeout(load, 1400);
  } else {
    showRightAnswer();
    notice.innerHTML = "⏱ Time Up! No answer from " + names[team] + ". No point.<br><span class='why'>💡 " + data[n][3] + "</span>";
    next.disabled = false;
  }
}

function pass(msg) {
  locked = true;
  disable();
  notice.className = "notice wrongN";
  if (attempt === 0) {
    notice.textContent = msg + " Passing this question to " + names[1 - team] + ".";
    attempt = 1;
    team = 1 - team;
    setTimeout(load, 1400);
  } else {
    showRightAnswer();
    notice.innerHTML = msg + " No point. Moving to the next question.<br><span class='why'>💡 " + data[n][3] + "</span>";
    next.disabled = false;
  }
}

next.onclick = () => {
  if (n < 49) {
    n++;
    turnTeam = team;
    attempt = 0;
    load();
  } else finish();
};

function finish() {
  clearInterval(timer);
  game.style.display = "none";
  document.querySelector(".rules").style.display = "none";
  result.style.display = "block";
  fa.textContent = s[0];
  fb.textContent = s[1];
  if (s[0] === s[1]) {
    winner.textContent = "It’s a Draw!";
  } else {
    let w = s[0] > s[1] ? 0 : 1;
    winner.textContent = names[w] + " wins the C-CREST ACHIEVERS Challenge!";
  }
  let best = Math.max(s[0], s[1]);
  let rank = best >= 50 ? "🏆 ULTIMATE LEGEND" : best >= 30 ? "🥇 QUIZ MASTER" : best >= 20 ? "⭐ SMART PERFORMER" : "Keep Practicing!";
  rankTitle.textContent = rank;
  rankMessage.textContent = best >= 50 ? "Perfect score! You answered all 50 questions correctly." : best >= 30 ? "Excellent performance! You reached 30 or more correct answers." : best >= 20 ? "Great job! You reached 20 or more correct answers." : "Complete more correct answers to reach Smart Performer.";
}

function restart() {
  n = 0;
  team = 0;
  turnTeam = 0;
  attempt = 0;
  s = [0, 0];
  sa.textContent = sb.textContent = 0;
  result.style.display = "none";
  document.querySelector(".rules").style.display = "block";
  document.getElementById("startScreen").style.display = "block";
  game.style.display = "none";
  started = false;
}
