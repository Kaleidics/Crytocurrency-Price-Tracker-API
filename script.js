"use strict";

//cryptocurrency api
const api_key1 ="960e428fdca399a09e41196327f5766b1f76aa979eec604f31318a4e0ac3f032";
//news api
const api_key2 = "3d4f6056ea124d38aff81d043310b2f2";





function registerNavbtnI() {
    $(".nav-btn1").on("click",function(event){
        event.preventDefault();
        $(this).prop("disabled", true);
        $(".landing").empty();
        generateTopTenLayout();
        generateTopTen();
    })
}
function generateTopTenLayout() {
    $(".landing").hide().fadeIn().append(`
        <section>
            <h2>Toplist by 24 Hour Volume Subscriptions</h2>
                <table class="top-currencies">
                    <tr class="main-table">
                        <th>Name</th>
                        <th>Price</th>
                        <th>High/Low</th>
                    </tr>
                </table>
        </section>`)
}
//fetch endpoint top10 total volume append results as html page
function generateTopTen() {
    const searchUrl = "https://min-api.cryptocompare.com/data/top/totalvolfull";//seperate query parameters
    const baseImageUrl = "https://www.cryptocompare.com/";

    let params = {
        limit: "10",
        tsym: "USD",
        api_key: api_key1
    };

    const queryString = formatQueryParams(params);
    const url = searchUrl + "?" + queryString;


    return fetch(url)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } throw new Error(response.statusText);
        })

        .then(function (responseJson) {
            for( let i=0; i<responseJson.Data.length; i++){
                $(".top-currencies").hide().fadeIn().append(`
                <tr class="table-info">
                    <td class="cName"><img class="icons" src="${baseImageUrl}${responseJson.Data[i].CoinInfo.ImageUrl}">${responseJson.Data[i].CoinInfo.FullName}</td>
                    <td class="price">${responseJson.Data[i].DISPLAY.USD.PRICE}</td>
                    <td class="volume">${responseJson.Data[i].DISPLAY.USD.HIGHDAY}/${responseJson.Data[i].DISPLAY.USD.LOWDAY}</td>
                </tr>
                `);
            }
      
        })
        .catch(error => console.log("generateTopTen failed"));
}

// landing page generates 3 most recent news articles for cryptocurrency 
// function generateNews(){
//     const searchUrl = "https://newsapi.org/v2/everything?q=cryptocurrency+blockchain&apiKey=";
//     const url = searchUrl + api_key2;
//     return fetch(url)
//         .then(response => {
//             if (response.ok){
//                 return response.json();
//             } throw new Error(response.statusText);
//         })

//         .then(function (responseJson){
//             for(let i=0; i<6;i++){
//                 $(".news-articles").append(`
//                     <article class="article"><a class="a-link" href="${responseJson.articles[i].url}"><span>${responseJson.articles[i].title}</span><span>${responseJson.articles[i].source.name}</span><img src="${responseJson.articles[i].urlToImage}"></a></article>
//                     `)}
//                 })
//         .catch(error => console.log("generateNews failed"))

// }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}


function buildResultsLayout(){
    $(".landing").append(`
        <div class= "checktest"></div>
    `)
}
//listen for search input submission and send to results page
function registerEvents(){
    $(".search-bar").on("submit", function(event){
        event.preventDefault();
        
        let searchTerm = ($(".search-term").val());
        console.log("search term", searchTerm);

        let searchMarket = $(".search-ex").val();
        console.log("market", searchMarket);

        let fCurrency = $(".search-xxx").val();
        console.log("fcurrecny", fCurrency);

        $(".landing").empty();
        buildResultsLayout();

        generateResultsMedia(searchTerm);
        generateResults(searchTerm, searchMarket, fCurrency);

        
    })
}

//generates statistics from Custom Average endpoint
function generateResults(search, exchange, currency){
    const searchUrl = "https://min-api.cryptocompare.com/data/generateAvg"
    if(exchange ===""){
        exchange = "CCCAGG";
    }

    if(search===""){
        search ="BTC";
    }

    let params = {
        fsym: search,
        tsym: currency,
        e: exchange,
        api_key: api_key1
    };

    const queryString = formatQueryParams(params);
    const url = searchUrl + "?" + queryString;

    return fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } throw new Error(response.statusText);
        })

        .then(function (responseJson) {

            $(".checktest").append(`<div>Price: ${responseJson.DISPLAY.PRICE}</div><div>`)
            $(".checktest").append(`<div>Open24: ${responseJson.DISPLAY.OPEN24HOUR}</div>`)
            $(".checktest").append(`<div>High24: ${responseJson.DISPLAY.HIGH24HOUR}</div>`)
            $(".checktest").append(`<div>Low24: ${responseJson.DISPLAY.LOW24HOUR}</div>`)
            $(".checktest").append(`<div>Change24: ${responseJson.DISPLAY.CHANGE24HOUR}</div>`)
            $(".checktest").append(`<div>ChangePercent: ${responseJson.DISPLAY.CHANGEPCT24HOUR}%</div>`)
        })
        .catch(error => console.log("1 error happened"));
}


function generateResultsMedia(search) {
    const searchUrl = "https://min-api.cryptocompare.com/data/all/coinlist"

    const url = searchUrl + "?" + api_key1;

    if(search ==""){
        search = "BTC"
    }
    return fetch(url)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } throw new Error(response.statusText);
        })

        .then(function (responseJson) {
            console.log("123", responseJson.Data[search].FullName)
            $(".checktest").append(`<div>${responseJson.Data[search].FullName}</div>`);
            
        })
        .catch(error => console.log(error));
}



function reloadPage(){
    $(".logo").on("click", function(){
        location.reload();
    });

}


window.onload = function(){
    Particles.init({
        selector:".background",
        connectParticles: true,
        maxParticles: 110,
        speed:0.33
    });
};


function documentReady(){
    // generateTopTenLayout();
    // generateTopTen();
    // generateNews();
    registerEvents();
    registerNavbtnI();
    reloadPage();
    // test();
}

$(documentReady);


















