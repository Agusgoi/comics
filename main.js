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
  const $results = $(".results");

  const $btnSearch = $(".btn-search");

  const $searchInput = $(".search-input");
  const $typeFilter = $(".type-filter");
  const $orderSelect = $(".order-select");

  // ------------------- Default array -------------------
  fetch(
    `https://gateway.marvel.com//v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}`
  )
    .then((response) => response.json())
    .then((info) => {
      let comics = info.data.results;
      let totalComics = info.data.total;
      paint(comics);
      results(comics, totalComics);
    })

    .catch((error) => console.log(error));

  // ------------------- Filter -------------------
  const filterByType = () => {
    if ($typeFilter.value === "character") {
      fetch(
        `https://gateway.marvel.com//v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`
      )
        .then((response) => response.json())
        .then((info) => {
          let array = info.data.results;
          let totalArray = info.data.total;
          order(array);
          paint(array);
          results(array, totalArray);
        })

        .catch((error) => console.log(error));
    } else {
      fetch(
        `https://gateway.marvel.com//v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}`
      )
        .then((response) => response.json())
        .then((info) => {
          let array = info.data.results;
          let totalArray = info.data.total;
          order(array);
          paint(array);
          results(array, totalArray);
        })

        .catch((error) => console.log(error));
    }
  };

  // ------------------- Paint -------------------
  const paint = (array) => {
    $containCards.innerHTML = "";
    $results.innerText = "";

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

  // ------------------- Count -------------------

  const results = (array, count) => {
    if (array != "") {
      $results.innerText = `${count} resultado/s`;
    } else {
      $containCards.innerHTML = "";
      $results.innerText = "No se encontraron resultados para tu busqueda.";
    }
  };

  // ------------------- Order -------------------

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

  // ------------------- Search Characters/Comics -------------------
  $btnSearch.addEventListener("click", () => {
    if ($searchInput.value != "") {
      if ($typeFilter.value === "character") {
        fetch(
          `https://gateway.marvel.com//v1/public/characters?nameStartsWith=${$searchInput.value}&ts=${ts}&apikey=${publicKey}&hash=${hash}`
        )
          .then((response) => response.json())
          .then((info) => {
            console.log(info)
            let charactersByInputValue = info.data.results;
            let totalCharactersFiltered = info.data.total;
            order(charactersByInputValue);
            paint(charactersByInputValue);
            results(charactersByInputValue, totalCharactersFiltered);
          })

          .catch((error) => console.log(error));
      } else {
        fetch(
          `https://gateway.marvel.com//v1/public/comics?titleStartsWith=${$searchInput.value}&ts=${ts}&apikey=${publicKey}&hash=${hash}`
        )
          .then((response) => response.json())
          .then((info) => {
            console.log(info);
            let comicsByInputValue = info.data.results;
            let totalComicsFiltered = info.data.total;
            order(comicsByInputValue);
            paint(comicsByInputValue);
            results(comicsByInputValue, totalComicsFiltered);
          })

          .catch((error) => console.log(error));
      }
    } else {
      filterByType();
    }
  });

  //cierran el window
});
