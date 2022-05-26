let news = [];
let menus = document.querySelectorAll(".menus button");

menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByTopic(event) ))

let searchButton = document.getElementById("search-button");
let url;

// 각 함수에서 필요한 url을 만든다.
// api 호출 함수를 부른다.

// 중복되는 부분을 묶어주는 함수
const getNews = async () => {
    let header = new Headers({
        'x-api-key' : '1033LLKR-z8stbNw7sGP6HmG0S3GG-FB4mOrt4NhtqQ'
    });

    let response = await fetch(url, {headers:header}); // ajax, axios, fetch, http
    let data = await response.json();
    news = data.articles;
    console.log(news);
    render();
}

const getLatestNews = async() => {
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=business&page_size=10`);
    getNews();
};

const getNewsByTopic = async(event) => {
    let topic = event.target.textContent.toLowerCase();
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`);
    getNews();
};

const getNewsByKeyword = async () => {
    // 1. 검색 키워드 읽어오기
    // 2. url에 검색 키워드 붙이기
    // 3. 헤더 준비
    // 4. url 부르기
    // 5. 데이터 가져오기
    // 6. 데이터 보여주기
    let keyword = document.getElementById("search-input").value;
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`);
    getNews();
}

const render = () => {
    let newsHTML = "";
    newsHTML = news.map((item) => {
        return ` <div class="row news">
        <div class="col-lg-4">
        <img class="news-img-size"
        src="${item.media || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"}" />
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p> ${
                item.summary == null || item.summary == ""
                ? "내용없음"
                : item.summary.length > 200
                ? item.summary.substring(0, 200) + " ..."
                : item.summary
            }
            </p>
            <div>   
                ${item.rights || "no source"} * ${moment(item.published_date).fromNow()}
            </div>
        </div>
    </div>`;
    }).join('');
    
    console.log(newsHTML);

    document.getElementById("news-board").innerHTML = newsHTML;
};



searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();