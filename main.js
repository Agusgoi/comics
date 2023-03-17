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
  const $containCardDetail = $(".cont-card-detail");

  const $btnSearch = $(".btn-search");

  const $searchInput = $(".search-input");
  const $typeFilter = $(".type-filter");
  const $orderSelect = $(".order-select");

  const $btnInitPage = $("#init-page");
  const $btnPreviousPage = $("#previous-page");
  const $btnNextPage = $("#next-page");
  const $btnLastPage = $("#last-page");

  let type = `comics`;
  let orderByDate = "";
  let orderByName = "";
  let orderByTitle = "";
  let nameSearch = "";
  let titleSearch = "";
  let offset = 0;
  let arrCount;
  let arr
  //let id = "";

  // ------------------- Default array -------------------
  btnDesactivated();


  
  fetch(
    `https://gateway.marvel.com//v1/public/${type}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
  )
    .then((response) => response.json())
    .then((info) => {
      arr = info.data.results;
      arrCount = info.data.total;
      paint(arr);
      results(arr, arrCount);
  

     
    })

    .catch((error) => console.log(error));

  // ------------------- GET array -------------------





  const getArray = () => {
btnDesactivated();
    fetch(
      `https://gateway.marvel.com//v1/public/${type}?offset=${offset}&ts=${ts}&apikey=${publicKey}&hash=${hash}${orderByDate}${nameSearch}${titleSearch}${orderByName}${orderByTitle}`
    )
      .then((response) => response.json())
      .then((info) => {
      
        arr = info.data.results;
        arrCount = info.data.total;
        paint(arr);
        results(arr, arrCount);
      
        
  })
  .catch((error) => console.log(error));
    }
  


     
  

  // ------------------- Paint -------------------
  const paint = (array) => {
    $containCards.innerHTML = "";
    $results.innerText = "";

    array.forEach((character) => {
      if ($typeFilter.value === "characters") {
        $containCards.innerHTML += `
          <div class="card" id=${character.id}>
          <img src=${
            character.thumbnail.path + "." + character.thumbnail.extension
          }>
              <p>${character.name}</p>
          </div> `;
      } else {
        $containCards.innerHTML += `
          <div class="card" id=${character.id}>
          <img src=${
            character.thumbnail.path + "." + character.thumbnail.extension
          }>
              <p>${character.title}</p>
          </div> `;
      }
    });

    cardSelected ()
  };

  // ------------------- btn Event + FILTERS -------------------

  $btnSearch.addEventListener("click", () => {
    // Search Input
    if ($searchInput.value === "") {
      nameSearch = "";
      titleSearch = "";
    } else if ($typeFilter.value === "characters") {
      nameSearch = `&nameStartsWith=${$searchInput.value}`;
      titleSearch = "";
    } else {
      titleSearch = `&titleStartsWith=${$searchInput.value}`;
      nameSearch = "";
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
    } else {
      orderByDate = "";
    }

    // Order by Name
    if ($typeFilter.value === "characters") {
      orderByTitle = "";
      if ($orderSelect.value === "az") {
        orderByName = `&orderBy=name`;
      } else if ($orderSelect.value === "za") {
        orderByName = `&orderBy=-name`;
      }
    }

    // Order by Title
    if ($typeFilter.value === "comics") {
      orderByName = "";
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
      //console.log(array)
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

  // ------------------- Pages -------------------

  $btnNextPage.addEventListener("click", () => {
    console.log(offset)
    console.log(arrCount)
    if (offset + 20 <= arrCount) {
      offset = offset + 20;

      getArray();
    }
  });

  $btnPreviousPage.addEventListener("click", () => {
    if (offset > 0) {
      offset = offset - 20;

      getArray();
    }
  });

  $btnInitPage.addEventListener("click", () => {
    if (offset != 0) {
      offset = 0;

      getArray();
    }
  });

  $btnLastPage.addEventListener("click", () => {
    if (offset + 20 <= arrCount) {
      while (offset + 20 <= arrCount) {
        offset += 20;
      }

      getArray();
    }
  });

  function btnDesactivated () {
    if (offset < 20) {
        $btnPreviousPage.classList.add("desactivated")
        $btnInitPage.classList.add("desactivated")
    } else {
      $btnPreviousPage.classList.remove("desactivated")
      $btnInitPage.classList.remove("desactivated")
    }

    if(offset + 20 > arrCount) {
        $btnNextPage.classList.add("desactivated")
        $btnLastPage.classList.add("desactivated")
    } else {
      $btnNextPage.classList.remove("desactivated")
      $btnLastPage.classList.remove("desactivated")
    }
}

//////////////////




const cardSelected = () =>{
  let $cards = document.querySelectorAll(".card");
  $cards.forEach((card) => {
    card.addEventListener("click", (e) => {
paintCardDetail (card.id)
    })
  })
}

////////////////////////////////////////////////////



const paintCardDetail = (id) => {
  fetch(`https://gateway.marvel.com//v1/public/${type}/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`)
    .then(response => response.json())
    .then(info => {
      cardInfo = info.data.results[0];
      console.log(cardInfo)
      console.log(type)
      $containCards.style.display = 'none';
      $containCardDetail.style.display = 'flex';
      $containCardDetail.innerHTML = "";

      if(type === 'comics'){
      $containCardDetail.innerHTML += `
      <div class="contain-img">
      <img class="card-img" src=${cardInfo.thumbnail.path + "." + cardInfo.thumbnail.extension
      }>
  </div>
  <div class="card-info">
      <h3>${cardInfo.title}</h3>
      <p>Creado por: ${cardInfo.creators.items[0].name}</p>
      <p>Descripcion: ${cardInfo.description}</p>
  </div>`

}else{
  $containCardDetail.innerHTML += `
  <div class="contain-img">
  <img class="card-img" src=${cardInfo.thumbnail.path + "." + cardInfo.thumbnail.extension
  }>
</div>
<div class="card-info">
  <h3>${cardInfo.name}</h3>
  <p>Descripcion: ${cardInfo.description}</p>
</div>`
}
    
      })
        .catch((error) => console.log(error));
      } 

   



  //cierran el window
});
