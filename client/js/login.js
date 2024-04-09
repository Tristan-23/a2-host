const adres = "http://localhost:5000";
var right = null;

function toggleCheck(element) {
  var icon = element.querySelector("i");
  var link = element.querySelector("a");

  var currentOpacity = parseFloat(window.getComputedStyle(icon).opacity);
  var newOpacity = currentOpacity === 1 ? 0.5 : 1; // Toggle between 1 and 0.5
  icon.style.opacity = newOpacity;

  link.classList.toggle("accepted");
}

function showError(input, msg) {
  var count = 0;
  msg.innerText = input;
  var intervalId = setInterval(function () {
    if (count % 2 === 0) {
      msg.style.visibility = "visible";
    } else {
      msg.style.visibility = "hidden";
    }

    count++;

    if (count === 10) {
      clearInterval(intervalId);
      return;
    }
  }, 500);
}

document
  .querySelector("section article footer .buttons")
  .addEventListener("click", function (event) {
    if (event.target.id === "submit") {
      handleSubmitClick();
    } else if (event.target.id === "switch") {
      handleSwitchClick();
    }
  });

function handleSubmitClick() {
  const title = document.querySelector("h1").innerText;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const error = document.getElementById("error");

  var userMail = document.getElementById("mailadres").value.toLowerCase();
  var userPassword = document.getElementById("password").value;
  var userRepeat = document.getElementById("repassword").value;

  if (userMail == "" || userPassword == "") {
    showError("Vul alle velden in", error);
    return;
  }
  if (!regex.test(userMail)) {
    showError("Ongeldig E-Mail", error);
    return;
  }

  if (title.toLowerCase().includes("register")) {
    handleRegister(userMail, userPassword, userRepeat, error);
  } else if (title.toLowerCase().includes("log in")) {
    handleLogin(userMail, userPassword, error);
  }
}

function handleRegister(userMail, userPassword, userRepeat, error) {
  const license = document.getElementById("license");
  const terms = document.getElementById("terms");
  if (
    !license.classList.contains("accepted") ||
    !terms.classList.contains("accepted")
  ) {
    showError("Accepteer onze vooraarden", error);
    return;
  }
  if (userRepeat !== userPassword) {
    showError("Wachtwoorden komen niet overeen", error);
    return;
  }
  fetch(adres + "/register", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email: userMail,
      password: userPassword,
    }),
  })
    .then(async (response) => {
      const data = await response.json();
      if (data.error) {
        showError(data.error, error);
        return;
      } else {
        handleSwitchClick();
      }
    })
    .catch((error) => console.error("Error during registration:", error));
}

function handleLogin(userMail, userPassword, error) {
  fetch(adres + "/login", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email: userMail,
      password: userPassword,
    }),
  })
    .then(async (response) => {
      const data = await response.json();
      if (data.error) {
        showError(data.error, error);
        return;
      } else {
        localStorage.setItem("userID", data["data"].id);
        localStorage.setItem("userEmail", data["data"].email);
        window.location.href = "../html/dashboard.html";
      }
    })
    .catch((error) => {
      console.error("Error during login:", error);
    });
}

function handleSwitchClick() {
  const cooldown = 1000;
  const container = document.querySelector("section");
  const inputs = document.querySelector("article");
  const gradientElement = document.querySelector(".gradiant");

  const h1 = document.querySelector("article header h1");
  const h2 = document.querySelector("article header h2");
  const ps = document.querySelector("article nav .repassword");
  const sb = document.querySelector("article footer #submit");
  const sw = document.querySelector("article footer #switch");
  const loginSection = document.querySelector(".login");
  const registerSection = document.querySelector(".register");

  var clone = gradientElement.cloneNode(true);
  clone.style.width = gradientElement.offsetWidth + "px";
  clone.style.height = gradientElement.offsetHeight + "px";
  clone.style.position = "absolute";
  clone.style.left = gradientElement.offsetLeft + "px";
  clone.style.top = gradientElement.offsetTop + "px";
  clone.style.transition = "all " + cooldown + "ms ease-in-out";

  container.appendChild(clone);

  var distance =
    Math.max(
      inputs.offsetLeft + inputs.offsetWidth,
      gradientElement.offsetLeft + gradientElement.offsetWidth
    ) - Math.min(inputs.offsetLeft, gradientElement.offsetLeft);
  clone.style.width = distance + "px";

  if (container.style.flexDirection == "row-reverse") {
    setTimeout(function () {
      h1.innerText = "Log in to your account";
      h2.innerText = "enter your email and password to log in";
      ps.style.display = "none";
      sb.id = "switch";
      sw.id = "submit";
      loginSection.style.display = "block";
      registerSection.style.display = "none";

      clone.style.left = right + "px";
      container.style.flexDirection = "row";
      clone.style.width = gradientElement.offsetWidth + "px";
    }, cooldown + 500);
  } else {
    if (right == null) {
      right = gradientElement.offsetLeft;
    }

    clone.style.left = inputs.offsetLeft + "px";

    setTimeout(function () {
      h1.innerText = "Register your account";
      h2.innerText = "fill in your information to register";
      ps.style.display = "block";
      sb.id = "switch";
      sw.id = "submit";
      loginSection.style.display = "none";
      registerSection.style.display = "block";

      container.style.flexDirection = "row-reverse";
      clone.style.width = gradientElement.offsetWidth + "px";
    }, cooldown + 500);
  }

  setTimeout(function () {
    clone.remove();
  }, cooldown * 2.5);
}
