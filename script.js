// https://github.com/zocom-david-lundholm/js10-vanilla-slutprojekt

const gallery = document.querySelector('.beer-gallery');
const inpSearch = document.querySelector('.inp-search');
const btnSearch = document.querySelector('.btn-search');
const btnRandom = document.querySelector('.btn-random');
const btnAdvanced = document.querySelector('.btn-advanced');
const advSection = document.querySelector('.adv-search');
const advInputs = document.querySelectorAll('.adv-input');
const advSubmit = document.querySelector('.adv-search-btn');
const infoPage = document.querySelector('.beer-info');

const root = 'https://api.punkapi.com/v2/beers';
const random = 'https://api.punkapi.com/v2/beers/random';
const latestResults = [];


btnSearch.addEventListener('click', () => getData(`${root}?beer_name=${inpSearch.value}`, renderBeer));
btnRandom.addEventListener('click', () => getData(random, renderBeer));
advSubmit.addEventListener('click', advSearch);
inpSearch.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        btnSearch.click();
    }
});
advInputs.forEach(input => {
    input.addEventListener('keydown', e => {
        if (e.key == 'Enter') advSearch();
    })
});
btnAdvanced.addEventListener('click', () => {
    gallery.classList.toggle('invisible');
    advSection.classList.toggle('invisible');
});

function beerInfoPage(beer) {
    console.log(beer);
    removeAllChildNodes(infoPage);
    const info = [
        `${beer.description}`,
        `<strong>First Brewed: </strong>${beer.first_brewed}`,
        `<strong>Brewers tips: </strong>${beer.brewers_tips}`,
        `<strong>Consume together with: </strong>${beer.food_pairing.map(food => food).join(' or ')}`,
        `<strong>Alcohol by volume: </strong>${beer.abv} %`,
        `<strong>Volume: </strong>${beer.volume.value} ${beer.volume.unit}`,
        `<strong>Ingredients: </strong>${Object.getOwnPropertyNames(beer.ingredients).join(', ')}`,
        `<strong>Hops: </strong>${beer.ingredients.hops.map(hops => hops.name).join(', ')}`,
    ];
    const div = createElement('div');
    infoPage.appendChild(div);

    div.appendChild(createElement('h2', null, beer.name));
    const ul  = createElement('ul', 'info-ul');
    info.forEach(s => ul.appendChild(createElement('li', 'info-li', s)));
    div.appendChild(ul);
    infoPage.appendChild(createElement('img', 'info-img', beer.image_url));
    
    document.addEventListener('mousedown', function _hideInfo() {
        infoPage.classList.add('invisible');
        document.removeEventListener('mousedown', _hideInfo);
    });

    infoPage.classList.remove('invisible');
}

function validate() {
    // att göra - validera advInputs
    return true;
}

function advSearch() {
    if (validate() == false) return;
    let searchString = root;
    const p = ['?beer_name=', '?hops=', '?malt=', '?brewed_before=', '?brewed_after=', '?abv_gt=', '?abv_lt=']
    for (let i = 0; i < p.length; i++) {
        const inp = advInputs[i];
        searchString += inp.value.length > 0 ? p[i] + inp.value : '';
    }
    getData(`${searchString}`, cacheAdvResults);
}

function cacheAdvResults(result) {
    latestResults.length = 0;
    result.forEach(beer => latestResults.push(beer));
    renderPageButtons(latestResults.length);
    getPage(0);
}

function getPage(start) {
    const advResultsSection = document.querySelector('.adv-results');
    removeAllChildNodes(advResultsSection);
    const advresultDiv = createElement('div');
    const resultUl = createElement('ul');
    for (let i = start; i < (start + 10); i++) {
        const beer = latestResults[i];
        if (!beer) break;
        const li = createElement('li', null, beer.name);
        li.addEventListener('click', () => beerInfoPage(beer));
        resultUl.appendChild(li);
    }
    advresultDiv.appendChild(resultUl);
    advResultsSection.appendChild(advresultDiv);
}

function renderPageButtons(length) {
    const pageButtonsSection = document.querySelector('.adv-results-page-buttons');
    removeAllChildNodes(pageButtonsSection);
    let numPages = Math.ceil(length / 10);
    for (let i = 0; i < numPages; i++) {
        const pageBtn = createElement('button');
        pageBtn.textContent = i + 1;
        pageBtn.addEventListener('click', () => {
            getPage(i * 10);
        });
        pageButtonsSection.appendChild(pageBtn);
    }
    const results = document.querySelector('.adv-search-results h2');
    results.textContent = `Search Results (${length})`;
}

function renderBeer(data) {
    removeAllChildNodes(gallery);
    data.forEach(beer => {
        const outerDiv = createElement('div', 'beer-holder');
        const imgDiv = createElement('div', 'imgcontainer');
        const h4Div = createElement('div', 'title');
        const img = createElement('img', null, beer.image_url != null ? beer.image_url : 'notfound.png');
        const h4 = createElement('h4', null, beer.name);
        const p = createElement('p', null, 'See More &gt;');

        imgDiv.appendChild(img);
        h4Div.appendChild(h4);
        outerDiv.appendChild(imgDiv);
        outerDiv.appendChild(h4Div)
        outerDiv.appendChild(p);
        gallery.appendChild(outerDiv);

        outerDiv.addEventListener('click', () => beerInfoPage(beer));
    });
}

