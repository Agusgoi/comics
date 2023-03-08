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

  const $btnSearch = $(".btn-search");

  const $searchInput = $(".search-input");
  const $typeFilter = $(".type-filter");
  const $orderSelect = $(".order-select");

  // GET Array
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
      if ($typeFilter.value === "character") {
        $containCards.innerHTML += `
          <div class="card">
          <img src=${
            character.thumbnail.path + "." + character.thumbnail.extension
          }>
              <p>${character.name}</p>
          </div> `;
      } else {
        $containCards.innerHTML += `
          <div class="card">
          <img src=${
            character.thumbnail.path + "." + character.thumbnail.extension
          }>
              <p>${character.title}</p>
          </div> `;
      }
    });
  };

  // Order

  const order = (array) => {
    if ($typeFilter.value === "character") {
      if ($orderSelect.value === "az") {
        array = array.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
        });
      } else {
        array = array.sort((a, b) => {
          if (a.name > b.name) {
            return -1;
          }
        });
      }
    } else {
      if ($orderSelect.value === "az") {
        array = array.sort((a, b) => {
          if (a.title < b.title) {
            return -1;
          }
        });
      } else {
        array = array.sort((a, b) => {
          if (a.title > b.title) {
            return -1;
          }
        });
      }
    }
  };

  // Search Characters/Comics by SearchInput
  $btnSearch.addEventListener("click", () => {
    if ($typeFilter.value === "character") {
      fetch(
        `https://gateway.marvel.com//v1/public/characters?nameStartsWith=${$searchInput.value}&ts=${ts}&apikey=${publicKey}&hash=${hash}`
      )
        .then((response) => response.json())
        .then((info) => {
          let charactersByInputValue = info.data.results;
          order(charactersByInputValue);
          paint(charactersByInputValue);
        })

        .catch((error) => console.log(error));
    } else {
      fetch(
        `https://gateway.marvel.com//v1/public/comics?titleStartsWith=${$searchInput.value}&ts=${ts}&apikey=${publicKey}&hash=${hash}`
      )
        .then((response) => response.json())
        .then((info) => {
          let comicsByInputValue = info.data.results;
          order(comicsByInputValue);
          paint(comicsByInputValue);
        })

        .catch((error) => console.log(error));
    }
  });

  //cierran el window
});
