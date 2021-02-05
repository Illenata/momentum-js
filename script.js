'use strict';

const time = document.querySelector('.time'),
      date = document.querySelector('.date'),
      greeting = document.querySelector('.greeting'),
      name = document.querySelector('.name'),
      focus = document.querySelector('.focus'),
      btnSlideImg = document.querySelector('.btnSlideImg'),
      btnSlidePreviousImg = document.querySelector('.btnSlidePreviousImg'),
      blockquote = document.querySelector('.blockquote'),
      figcaption = document.querySelector('.figcaption'),
      btnChangeQuote = document.querySelector('.btnChangeQuote'),
      weatherIcon = document.querySelector('.weather-icon'),
      temperature = document.querySelector('.temperature'),
      humidity = document.querySelector('.humidity'),
      windSpeed = document.querySelector('.windSpeed'),
      weatherDescription = document.querySelector('.weather-description'),
      city = document.querySelector('.city'),
      urlImg = `./assets/images/`;

let today = new Date(),
    hour = today.getHours(),
    nameSave = '',
    focusSave = '',
    citySave = '',
    arrBg = [];
        
document.body.style.opacity= "0";

function imgRandom() {
    const images = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', 
    '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', 
    '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
    
    return images[Math.floor(Math.random() * images.length)];      
}

function generateNewArrBg() {
    for (let i = 0; i < 24; i++) {
        if (i < 6) {
            arrBg.push(`${urlImg}night/${imgRandom()}`);
        } else if (i >= 6 && i < 12) {
            arrBg.push(`${urlImg}morning/${imgRandom()}`);
        } else if (i >= 12 && i < 18) {
            arrBg.push(`${urlImg}day/${imgRandom()}`);
        } else if (i >=18 && i < 24) {
            arrBg.push(`${urlImg}evening/${imgRandom()}`);
        }
    }
}

function setBg() {
    let src = arrBg[hour];
    const img = document.createElement("img");
    
    img.src = src;
    img.onload = () => {
        document.body.style.opacity= "1";
        document.body.style.backgroundImage = `url(${src})`;
    };
    
}

function showTime() {
    let today = new Date(),
        dateOutput = today.toLocaleDateString('eng', {weekday: 'long', day: 'numeric', month: 'long'}),
        timeOutput = today.toLocaleTimeString('ru'),
        min = today.getMinutes(),
        sec = today.getSeconds();

    date.innerHTML = `${dateOutput}`;
    time.innerHTML = `${timeOutput}`;

        if (min === 0 && sec === 0) {
            setBg();
        }
    
    setTimeout(showTime, 1000);
}

let i = hour;

function slideBg() {
    i++;
    if (i > 23) {
        i = 0;
    }
    let src = arrBg[i];
    const img = document.createElement("img");
    img.src = src;
    img.onload = () => {
    document.body.style.backgroundImage = `url(${src})`;
    };

    btnSlideImg.disabled = true;
    setTimeout(function() {
        btnSlideImg.disabled = false;
    }, 1000);
}

function slidePreviousBg() {
    i--;
    if (i < 0) {
        i = 23;
    }
    let src = arrBg[i];
    const img = document.createElement("img");
    img.src = src;
    img.onload = () => {
    document.body.style.backgroundImage = `url(${src})`;
    };

    btnSlideImg.disabled = true;
    setTimeout(function() {
        btnSlideImg.disabled = false;
    }, 1000);
}

function getGreeting() {
    if (hour >= 6 && hour < 12) {
        greeting.textContent = "Good morning, ";
    }

    if (hour >= 12 && hour < 18) {
        greeting.textContent = "Good afternoon, ";
    }

    if (hour >= 18 && hour < 24) {
        greeting.textContent = "Good evening, ";
    }

    if (hour >= 0 && hour < 6) {
        greeting.textContent = "Good night, ";
    }
}

function getName() {
    if (localStorage.getItem('name') === null || localStorage.getItem('name') === '') {
        name.textContent = '[Enter Name]';
    } else {
        name.textContent = localStorage.getItem('name');
    }
}

function clearName(e) {
    localStorage.setItem('name', e.target.innerText);
    nameSave = localStorage.getItem('name');
    if (e.type === 'click') {
        name.textContent = '';
    }
}

function setName(e) {
    if (e.type === 'keypress') {
        if (e.wich == 13 || e.keyCode == 13) {
            localStorage.setItem('name', e.target.innerText);
            name.blur();
        }
    } else {
        localStorage.setItem('name', e.target.innerText);
    }
    if (localStorage.getItem('name') === '') {
        localStorage.setItem("name", e.target.innerText);
        name.textContent = nameSave;
        localStorage.removeItem("name");
    }
}

function clearFocus(e) {
    localStorage.setItem('focus', e.target.innerText);
    focusSave = localStorage.getItem('focus');
    if (e.type === 'click') {
        focus.textContent = '';
    }
}

function getFocus() {
    if (localStorage.getItem('focus') === null || localStorage.getItem('name') === '') {
        focus.textContent = '[Enter Focus]';
    } else {
        focus.textContent = localStorage.getItem('focus');
    }
}

function setFocus(e) {
    if (e.type === 'keypress') {
        if (e.wich == 13 || e.keyCode == 13) {
            localStorage.setItem('focus', e.target.innerText);
            focus.blur();
        }
    } else {
        localStorage.setItem('focus', e.target.innerText);
    }
    if (localStorage.getItem('focus') === '') {
        localStorage.setItem("focus", e.target.innerText);
        focus.textContent = focusSave;
        localStorage.removeItem("focus");
    }
}

async function getQuote() {
  document.querySelector(".blockquoteContainer").style.opacity= "0";

  const url = `https://quote-garden.herokuapp.com/api/v2/quotes/random`;
  const response = await fetch(url); 
  const data = await response.json(); 

  if (data.quote.quoteText.length <= 140) {
    blockquote.textContent = `“${data.quote.quoteText}”`;
    figcaption.textContent = data.quote.quoteAuthor;
    document.querySelector(".blockquoteContainer").style.opacity= "1";
  } else {
    getQuote();
  }
}

async function getWeather() {
    if (localStorage.getItem('city') === null || localStorage.getItem('city') === '') {
        city.textContent = 'Weather: [Enter city]';
    } else {
        city.textContent = localStorage.getItem('city');
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=en&appid=375cec672e7f7bd7d7e2274e83d639bd&units=metric`;
    const res = await fetch(url);
    const data = await res.json(); 
    
    if (data.cod !== 200) {
        city.textContent = 'Weather: [Please, enter valid city]';
        temperature.style.visibility = 'hidden';
        weatherIcon.style.visibility = 'hidden';
        humidity.style.visibility = 'hidden';
        windSpeed.style.visibility = 'hidden';
        weatherDescription.style.visibility = 'hidden';
    } else {
        temperature.style.visibility = 'visible';
        weatherIcon.style.visibility = 'visible';
        humidity.style.visibility = 'visible';
        windSpeed.style.visibility = 'visible';
        weatherDescription.style.visibility = 'visible';

        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        humidity.textContent = `Humidity: ${Math.round(data.main.humidity)}%`;
        windSpeed.textContent = `Wind speed: ${data.wind.speed} m/s`;
        weatherDescription.textContent = data.weather[0].description;
    }
}

function clearCity(e) {
    localStorage.setItem('city', e.target.innerText);
    citySave = localStorage.getItem('city');
    if (e.type === 'click') {
        city.textContent = '';
    }
}

function setCity(e) {
    if (e.type === 'keypress') {
        if (e.wich == 13 || e.keyCode == 13) {
        localStorage.setItem('city', e.target.innerText);
        city.blur();
        getWeather();
        }
    } else {
        localStorage.setItem('city', e.target.innerText);
    }
    if (localStorage.getItem('city') === '') {
        localStorage.setItem("city", e.target.innerText);
        city.textContent = citySave;
        localStorage.removeItem("city");
    }
}

name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
name.addEventListener('click', clearName);
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);
focus.addEventListener('click', clearFocus);
document.addEventListener('DOMContentLoaded', getQuote);
document.addEventListener('DOMContentLoaded', getWeather);
document.addEventListener('DOMContentLoaded', setBg);
city.addEventListener('keypress', setCity);
city.addEventListener('blur', setCity);
city.addEventListener('click', clearCity);
btnChangeQuote.addEventListener('click', getQuote);
btnSlideImg.addEventListener('click', slideBg);
btnSlidePreviousImg.addEventListener('click', slidePreviousBg);

generateNewArrBg();
setBg();
showTime();
getGreeting();
getName();
getFocus();
getWeather();