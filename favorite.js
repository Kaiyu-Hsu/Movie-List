const BASE_URL = "https://movie-list.alphacamp.io"
const index_URL = BASE_URL + "/api/v1/movies/"
const poster_URL = BASE_URL + "/posters/"

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")

function renderMovieList(data) {
  let rawHTML = ""
  data.forEach((item) => {
    // console.log(item)
    rawHTML += `
    <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${poster_URL + item.image}" class="card-img-top"
              alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                data-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
    </div>
  `

  })

  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title")
  const modalImage = document.querySelector("#movie-modal-image")
  const modalDate = document.querySelector("#movie-modal-date")
  const modalDescription = document.querySelector("#movie-modal-description")

  axios.get(index_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = `Release at   ` + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${poster_URL + data.image}" alt="movie-poster"
                class="img-fuid">`

  })
}

//收藏清單
// function addToFavorite(id) {
//   // function isMovieIdMatched(movie) {
//   //   return movie.id === id
//   // }

//   // console.log(id)
//   const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
//   const movie = movies.find(movie => movie.id === id)

//   if (list.some(movie => movie.id === id)) {
//     return alert('此電影已經在收藏清單中!')
//   }

//   list.push(movie)
//   // const jsonString = JSON.stringify(list)

//   // console.log(movie)
//   // console.log('json string: ', jsonString) //轉成字串
//   // console.log('json object: ', JSON.parse(jsonString)) //轉成物件

//   // console.log(list)
//   localStorage.setItem('favoriteMovies', JSON.stringify(list))
// }

function removeFromFavorite(id) {
  // const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movieIndex = movies.findIndex(movie => movie.id === id)

  // return console.log(movieIndex)

  movies.splice(movieIndex, 1)

  // if (list.some(movie => movie.id === id)) {
  //   return alert('此電影已經在收藏清單中!')
  // }

  // list.push(movie)
  // const jsonString = JSON.stringify(list)

  // console.log(movie)
  // console.log('json string: ', jsonString) //轉成字串
  // console.log('json object: ', JSON.parse(jsonString)) //轉成物件

  // console.log(list)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}



// 監聽 data panel
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    // console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches(".btn-remove-favorite")) { //按+可以把電影放進收藏清單
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderMovieList(movies)

//監聽search submit btn & search function
// searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
//   event.preventDefault() //請瀏覽器不要做預設動作
//   // console.log(searchInput.value)
//   const keyword = searchInput.value.trim().toLowerCase() //trim()字串的两端删除空白  toLowerCase()不管輸入大小寫都可以搜尋
//   let filteredMovies = [] //要將搜尋到電影放入陣列裡

//   // if (!keyword.length) {
//   //   return alert('Please enter a vaild string')
//   // }



//   //第二種方法 filter()
//   filteredMovies = movies.filter(
//     movie => movie.title.toLowerCase().includes(keyword)
//   )

//   //原始迴圈用法
//   // for (const movie of movies) {
//   //   if (movie.title.toLowerCase().includes(keyword)) {
//   //     filteredMovies.push(movie)
//   //   }
//   // }

//   //如果搜尋亂碼或空白會顯示以下
//   if (filteredMovies.length === 0) {
//     return alert('Cannot find movies with keyword: ' + keyword)
//   }

//   renderMovieList(filteredMovies)
// })

// axios.get(index_URL).then((response) => {
//   // console.log(response.data.results)
//   // for (const movie of response.data.results) {
//   //   movies.push(movie)
//   // } 會把全部陣列結果拆分，放進movies陣列裡，但還有更快的方式
//   movies.push(...response.data.results) //... 為展開運算子 (spread operator)
//   // movies.push(response.data.results) 外面會再包一層陣列，所以此陣列的元素只有一個
//   // console.log(movies)
//   renderMovieList(movies)
// })

// localStorage.setItem('default_language', 'english') // localStorage('key', 'string')
// console.log(localStorage.getItem('default_language'))
// localStorage.removeItem('default_language')
// console.log(localStorage.getItem('default_language'))
localStorage.setItem('default_language', JSON.stringify()) // 用JSON.stringify轉成字串