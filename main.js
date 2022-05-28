let news = [];
let page = 1;
let total_pages = 0;

let menus = document.querySelectorAll(".menus button");

menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByTopic(event) ))

let searchButton = document.getElementById("search-button");
let url;

// 각 함수에서 필요한 url을 만든다.
// api 호출 함수를 부른다.

// 중복되는 부분을 묶어주는 함수
const getNews = async () => {
    try {

        let header = new Headers({
            'x-api-key' : '1033LLKR-z8stbNw7sGP6HmG0S3GG-FB4mOrt4NhtqQ'
        });

        // &page= 를 추가한다는 뜻
        url.searchParams.set('page', page);
        console.log(url);
        let response = await fetch(url, {headers:header}); // ajax, axios, fetch, http
        let data = await response.json();
        if(response.status == 200){
            if(data.total_hits == 0) {
                throw new Error("검색된 결과값이 없습니다.");
            }
            console.log("받는 데이터가 뭐지?", data);
            news = data.articles;
            total_pages = data.total_pages;
            page = data.page;
            console.log(news);
            render();
            pagenation();
        }else {
            throw new Error(data.message);
        }
    } catch(error){
        console.log("잡힌 에러는", error.message);
        errorRender(error.message);
    }
    
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

const errorRender = (message) => {
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">
    ${message}
  </div>`;
    document.getElementById("news-board").innerHTML = errorHTML;
};

const pagenation = () => {
    let pagenationHTML = ``;
    // total_page
    // 현재 page
    // page group
    let pageGroup = Math.ceil(page/5);
    // last
    let last = pageGroup*5;
    if(last > total_pages){
        // 마지막 그룹이 5개 이하이면
        last = total_pages;
    }
    // first
    let first = last - 4 <= 0 ? 1: last - 4;
    // first ~ last page 프린트

    // total page 3일경우 3개의 페이지만 프린트 하는법 last, first
    // << >> 버튼 만들어주기 맨처음, 맨끝으로 가는 버튼 만들어주기
    // 내가 그룹 1일때 << < 이 버튼이 없다.
    // 내가 마지막 그룹일때 > >> 버튼이 없다.


    if(first >= 6) {
        pagenationHTML = `<li class="page-item" onclick="moveToPage(1)">
                        <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                      </li>
                      <li class="page-item">
                        <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
                            page - 1
                         })">
                        <span aria-hidden="true">&lt;</span>
                        </a>
                    </li>`;
    }
    
    for(let i=first; i<=last; i++){
        pagenationHTML += `<li class="page-item ${
            page==i?"active":""
        }"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
    }
    
    if(last < total_pages){
        pagenationHTML += ` <li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${
        page + 1
    })">
      <span aria-hidden="true">&gt;</span>
    </a>
    </li>
    <li class="page-item" onclick="moveToPage(${total_pages})">
        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
    </li>`;
    }


    document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const moveToPage = (pageNum) => {
    // 1. 이동하고 싶은 페이지를 알아야 됨.
    page = pageNum;
    // 2. 이동하고 싶은 페이지를 가지고 api를 다시 호출해주자.
    getNews();

}
searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();