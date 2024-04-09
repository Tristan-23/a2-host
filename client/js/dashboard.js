const adres = "http://localhost:5000";
const email = localStorage.getItem("userEmail");

const maxDay = 8;
const maxWeek = 40;
const maxMonth = 160;

function formatTime(time, cat) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  if (cat === "full") {
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } else if (cat === "date") {
    return `${day}-${month}-${year}`;
  } else {
    return `${hours}:${minutes}:${seconds}`;
  }
}

function loadTable(data) {
  const insert = document.querySelector(".scroll");
  let table = "";

  if (!(data.length > 0)) {
    alert("table is empty");
    insert.innerHTML = table;
    return;
  }

  const headers = Object.keys(data[0]);

  table += "<ul id='column'>";
  headers.forEach((header) => {
    table += `<li>${header}</li>`;
  });
  table += "</ul>";

  data.forEach(function (item, index) {
    table += `<ul id="data_${index + 1}">`;
    headers.forEach((header) => {
      if (header === "inklok" || header === "uitklok") {
        table += `<li>${formatTime(item[header])}</li>`;
      } else if (header === "date" || header === "Aanvraagdatum") {
        table += `<li>${formatTime(item[header], "date")}</li>`;
      } else {
        table += `<li>${item[header]}</li>`;
      }
    });
    table += "</ul>";
  });

  insert.innerHTML = table;
}

function toggleActive(clickedItem) {
  const items = document.querySelectorAll(".nav section item");
  items.forEach((item) => {
    item.classList.remove("active");
  });
  clickedItem.classList.add("active");

  const innerHTML = clickedItem.querySelector("a").innerHTML;

  if (innerHTML === "Dashboard") {
    document.getElementById("add").style.visibility = "hidden";
    fetchData();
  } else {
    document.getElementById("add").style.visibility = "visible";

    fetch(adres + "/search/" + innerHTML)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        loadTable(data["data"]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
}

function addTableRow(self) {
  console.log(self);
}

function updateCircle(circle, hours, percent) {
  const radius = circle.getAttribute("r");
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const progressText = document.querySelector(".circle p");
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = offset;
  progressText.textContent = hours + " hrs";
}

function updateProgress(h2Element, divElement, hours, maxHours, percent) {
  h2Element.textContent = `${hours} / ${maxHours} hrs`;
  divElement.style.width = `${percent}%`;
}

function setStatisticsValue(dataArray) {
  const currentDate = new Date();
  const currentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const progressTargets = [
    {
      h2: document.querySelectorAll(".item .rectangle .container .text h2")[0],
      progress: document.querySelectorAll(
        ".item .rectangle .container .background .progress"
      )[0],
      max: maxDay,
    },
    {
      h2: document.querySelectorAll(".item .rectangle .container .text h2")[1],
      progress: document.querySelectorAll(
        ".item .rectangle .container .background .progress"
      )[1],
      max: maxWeek,
    },
    {
      h2: document.querySelectorAll(".item .rectangle .container .text h2")[2],
      progress: document.querySelectorAll(
        ".item .rectangle .container .background .progress"
      )[2],
      max: maxMonth,
    },
  ];

  updateCircle(document.querySelector("#progress circle"), 0, 0);

  var percentageOfDay = 0;
  var percentageOfWeek = 0;
  var percentageOfMonth = 0;

  dataArray.forEach((element) => {
    const begin = new Date(element.inklok);
    const end = new Date(element.uitklok);
    const elementDate = new Date(element.date);
    const duration = end.getTime() - begin.getTime();
    const durationHours = (duration / (1000 * 60 * 60)).toFixed(2);

    if (elementDate.toDateString() === currentDate.toDateString()) {
      percentageOfDay += Math.ceil((durationHours / maxDay) * 10) * 10; // Increment by 5% and round up
    }

    if (Math.abs(elementDate - currentDate) < 7 * 24 * 60 * 60 * 1000) {
      percentageOfWeek += Math.ceil((durationHours / maxWeek) * 10) * 10; // Increment by 5% and round up
    }

    if (elementDate.getMonth() === currentMonth.getMonth()) {
      percentageOfMonth += Math.ceil((durationHours / maxMonth) * 10) * 10; // Increment by 5% and round up
    }

    progressTargets.forEach((target, index) => {
      const percentage =
        index === 0
          ? percentageOfDay
          : index === 1
          ? percentageOfWeek
          : percentageOfMonth;
      if (percentage !== undefined && percentage !== 0) {
        updateProgress(
          target.h2,
          target.progress,
          durationHours,
          target.max,
          percentage
        );
      }
    });
  });
}

function fetchData() {
  const userID = localStorage.getItem("userID");
  const userEmail = localStorage.getItem("userEmail");

  if (!userID || !userEmail) {
    alert("Invalid login");
    return;
  }

  fetch("http://localhost:5000/searchHours/" + userID)
    .then((response) => response.json())
    .then((data) => {
      loadTable(data["data"]);
      setStatisticsValue(data["data"]);
    });
}

let startTime;
let endTime;
let currentRow;
function registerMe(self) {
  const userID = localStorage.getItem("userID");

  if (self.classList.contains("cooldown")) {
    return;
  }

  if (self.innerHTML === "Inklokken") {
    self.classList.add("clicked");
    self.innerHTML = "Uitklokken";

    const date = new Date();
    startTime = date;
    const dateString = date.toString();

    fetch("http://localhost:5000/insertTime", {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        user: userID,
        time: formatTime(dateString, "full"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        currentRow = data["data"].id;
      });
  } else {
    self.classList.remove("clicked");
    self.innerHTML = "Inklokken";

    const date = new Date();
    endTime = date;
    const dateString = date.toString();
    const duration = endTime - startTime;

    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
    const formattedDuration = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    console.log(formattedDuration);

    fetch("http://localhost:5000/updateTime", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        row: currentRow,
        user: userID,
        time: formatTime(dateString, "full"),
        duration: formattedDuration,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchData();
      });
  }

  self.classList.add("cooldown");
  setTimeout(function () {
    self.classList.remove("cooldown");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
  const clickedItem = document.getElementById("default");
  toggleActive(clickedItem);
});
