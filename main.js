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
  const $card = $(".card");

  const $btnSearch = $(".btn-search");

  const $searchInput = $(".search-input");
  const $typeFilter = $(".type-filter");
  const $orderSelect = $(".order-select");

  let type = `comics`;
  let orderByDate = "";
  let orderByName = "";
  let orderByTitle = "";
  let nameSearch = "";
  

  // ------------------- Default array -------------------

  fetch(
    `https://gateway.marvel.com//v1/public/${type}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
  )
    .then((response) => response.json())
    .then((info) => {
      let arr = info.data.results;
      let arrCount = info.data.total;
      paint(arr);
      results(arr, arrCount);
    })

    .catch((error) => console.log(error));

  // ------------------- GET array -------------------

  const getArray = () => {
    fetch(
      `https://gateway.marvel.com//v1/public/${type}?ts=${ts}&apikey=${publicKey}&hash=${hash}${orderByDate}${nameSearch}${orderByName}${orderByTitle}`
    )
      .then((response) => response.json())
      .then((info) => {
        let arr = info.data.results;
        let arrCount = info.data.total;
        paint(arr);
        results(arr, arrCount);
      })

      .catch((error) => console.log(error));
  };

  
  // ------------------- Paint -------------------
  const paint = (array) => {
    $containCards.innerHTML = "";
    $results.innerText = "";

    array.forEach((character) => {
      if ($typeFilter.value === "characters") {
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

  // ------------------- btn Event + FILTERS -------------------

  $btnSearch.addEventListener("click", () => {
    // Search Input
    if ($searchInput.value === "") {
      nameSearch = "";
    } else {
      nameSearch = `&nameStartsWith=${$searchInput.value}`;
    }

    // Type
    if ($typeFilter.value === "characters") {
      type = `characters`;
    } else {
      type = `comics`;
    }

    // Order by Date
    if ($typeFilter.value === "comics") {
      if ($orderSelect.value === "mas-nuevo") {
        orderByDate = `&orderBy=focDate`;
      } else if ($orderSelect.value === "mas-viejo") {
        orderByDate = `&orderBy=-focDate`;
      }
    }

    // Order by Name/Title
    if ($typeFilter.value === "characters") {
      if ($orderSelect.value === "az") {
        orderByName = `&orderBy=name`;
      } else if ($orderSelect.value === "za") {
        orderByName = `&orderBy=-name`;
      }
    } else {
      if ($orderSelect.value === "az") {
        orderByTitle = `&orderBy=title`;
      } else if ($orderSelect.value === "za") {
        orderByTitle = `&orderBy=-title`;
      }
    }

    getArray();
  });

  // ------------------- Count -------------------

  const results = (array, count) => {
    if (array != "") {
      $results.innerText = `${count} resultado/s`;
    } else {
      $containCards.innerHTML = "";
      $results.innerText = "No se encontraron resultados para tu busqueda.";
    }
  };

  // ------------------- Adding Order Select Options -------------------

  $typeFilter.addEventListener("change", () => {
    if ($typeFilter.value === "comics") {
      $orderSelect.innerHTML = "";
      $orderSelect.innerHTML = `
      <option value="az">A-Z</option>
      <option value="za">Z-A</option>
      <option value="mas-nuevo">Mas nuevo</option>
      <option value="mas-viejo">Mas viejo</option>`;
    } else {
      $orderSelect.innerHTML = "";
      $orderSelect.innerHTML = `
      <option value="az">A-Z</option>
      <option value="za">Z-A</option>`;
    }
  });

  //cierran el window
});
