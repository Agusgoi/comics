// API
const ts = Date.now();
const publicKey = `0c3b7c37c01051ae643518aa1c165233`;
const privateKey = `daa1a52d6df3ba709de03fa0c9ba5a446fbba65d`;

const hash = md5(`${ts}${privateKey}${publicKey}`);

// $
const $ = (selector) => document.querySelector(selector);

window.addEventListener("load", () => {
    
  // variables

  const $containCards = $(".contain-cards");

  fetch(
    `https://gateway.marvel.com//v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`
  )
    .then((response) => response.json())
    //.then (data => console.log(data))
    .then((info) => {
      let characters = info.data.results;
      paint(characters);
    })

    .catch((error) => console.log(error));

  // Paint

  const paint = (array) => {
    $containCards.innerHTML = "";
    array.forEach((character) => {
      $containCards.innerHTML += `
          <div class="card">
          <img src=${
            character.thumbnail.path + "." + character.thumbnail.extension
          }>
              <p>${character.name}</p>
          </div> `;
    });
  };

  //cierran el window
});
