const BASE_URL = "https://movie-list.alphacamp.io"
const index_URL = BASE_URL + "/api/v1/movies/"
const poster_URL = BASE_URL + "/posters/"
const MOVIES_PER_PAGE = 12 //每一頁顯示12個電影

const movies = []
let filteredMovies = [] //要將搜尋到電影放入陣列裡

const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const paginator = document.querySelector("#paginator")

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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
    </div>
  `

  })

  dataPanel.innerHTML = rawHTML
}

//讓分頁器有實際作用
function renderPaginator(amount) {
  // 80 / 12 = 6 ...8
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE) //Math.ceil 為無條件進位
  let rawHTML = ''

  for (let page = 0; page < numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page + 1}">${page + 1}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

//每一頁需要顯示的電影，需要切割資料
function getMoviesByPage(page) {
  // page 1 -> movies 0 - 11
  // page 2 -> movies 12 - 23
  // 以此類推

  // movies ? 'movies' : 'filteredMovies'

  const data = filteredMovies.length ? filteredMovies : movies

  const startIndex = (page - 1) * MOVIES_PER_PAGE

  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
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
function addToFavorite(id) {
  // function isMovieIdMatched(movie) {
  //   return movie.id === id
  // }

  // console.log(id)
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id) //find()為條件函式會去陣列裡面一一比對，不過在找到第一個符合條件的 item 後就回停下來回傳該 item。

  //相同電影不應該重複收藏
  if (list.some(movie => movie.id === id)) { //some() 只會回報「陣列裡有沒有 item 通過檢查條件」，回傳的是布林值。
    return alert('此電影已經在收藏清單中!') //alert() 用來跳出提示 (警告) 對話視窗。
  }

  list.push(movie)
  // const jsonString = JSON.stringify(list)

  // console.log (movie)
  // console.log('json string: ', jsonString) //轉成字串
  // console.log('json object: ', JSON.parse(jsonString)) //轉成物件

  // console.log(list)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// 監聽 data panel
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    // console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches(".btn-add-favorite")) { //按+可以把電影放進收藏清單
    addToFavorite(Number(event.target.dataset.id))
  }
})

//監聽paginator btn
paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  // 'A' => <a></a> 如果不是此標籤就不執行
  // console.log(event.target.dataset.page)
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})

//監聽search submit btn & search function
searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault() //請瀏覽器不要做預設動作
  // console.log(searchInput.value)
  const keyword = searchInput.value.trim().toLowerCase() //trim()字串的两端删除空白  toLowerCase()不管輸入大小寫都可以搜尋


  // if (!keyword.length) {
  //   return alert('Please enter a vaild string')
  // }



  //第二種方法 filter()
  filteredMovies = movies.filter(
    movie => movie.title.toLowerCase().includes(keyword)
  )

  //原始迴圈用法
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie)
  //   }
  // }

  //如果搜尋亂碼或空白會顯示以下
  if (filteredMovies.length === 0) {
    return alert('Cannot find movies with keyword: ' + keyword)
  }

  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
  // renderMovieList(filteredMovies)
})

axios.get(index_URL).then((response) => {
  // console.log(response.data.results)
  // for (const movie of response.data.results) {
  //   movies.push(movie)
  // } 會把全部陣列結果拆分，放進movies陣列裡，但還有更快的方式
  movies.push(...response.data.results) //... 為展開運算子 (spread operator)
  // movies.push(response.data.results) 外面會再包一層陣列，所以此陣列的元素只有一個
  // console.log(movies)
  renderPaginator(movies.length)
  renderMovieList(getMoviesByPage(1))
}).catch((err) => console.log(err))

// localStorage.setItem('default_language', 'english') // localStorage('key', 'string')
// console.log(localStorage.getItem('default_language'))
// localStorage.removeItem('default_language')
// console.log(localStorage.getItem('default_language'))
localStorage.setItem('default_language', JSON.stringify()) // 用JSON.stringify轉成字串