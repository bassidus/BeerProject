// https://github.com/zocom-david-lundholm/js10-vanilla-slutprojekt

const displaySection = document.querySelector('main > div.display');
const searchInp = document.querySelector('.flexdiv > input.inp');
const searchBtn = document.querySelector('.flexdiv > input.search');
const rndBtn = document.querySelector('input.rnd');
const advBtn = document.querySelector('.flexdiv > input.adv');
const advSection = document.querySelector('main > div.advanced');
const advInputs = document.querySelectorAll('form > input[type=text]');
const advSubmit = document.querySelector('form > input[type=button]');
const infoPage = document.querySelector('.beerinfo');

const root = 'https://api.punkapi.com/v2/beers';
const random = 'https://api.punkapi.com/v2/beers/random';
const beername = '?beer_name=';
const latestResults = [];

rndBtn.addEventListener('click', () => getData(random, renderBeer));
advInputs.forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') {
            advSearch();
        }
    });
});
advSubmit.addEventListener('click', advSearch);

function beerInfoPage(beer) {
    removeAllChildNodes(infoPage);
    const info = [
        `name: ${beer.name}`,
        `abv: ${beer.abv}`,
        `attenuation_level: ${beer.attenuation_level}`,
        `brewers_tips: ${beer.brewers_tips}`,
        `contributed_by: ${beer.contributed_by}`,
        `description: ${beer.description}`,
        `ebc: ${beer.ebc}`,
        `first_brewed: ${beer.first_brewed}`,
        `ibu: ${beer.ibu}`,
        `ph: ${beer.ph}`,
        `srm: ${beer.srm}`,
        `tagline: ${beer.tagline}`,
    ];
    const ul  = document.createElement('ul');
    info.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s;
        ul.appendChild(li);
    });
    infoPage.appendChild(ul);
    
    document.addEventListener('mousedown', function _hideInfo() {
        infoPage.classList.add('invisible');
        document.removeEventListener('mousedown', _hideInfo);
    })
    infoPage.classList.remove('invisible');
}

function validate() {
    // validera advInputs
    return true;
}
function advSearch() {
    if (validate() == false) return;

    let searchString = root;
    const parameters = ['?beer_name=', '?hops=', '?malt=', '?brewed_before=', '?brewed_after=', '?abv_gt=', '?abv_lt=']

    for (let i = 0; i < parameters.length; i++) {
        const par = parameters[i];
        const inp = advInputs[i];
        searchString += inp.value.length > 0 ? par + inp.value : '';
    }
    getData(`${searchString}`, cacheAdvResults);
}

function cacheAdvResults(result) {
    latestResults.length = 0;
    console.log(result)
    result.forEach(beer => {
        latestResults.push(beer);
    });

    renderPageButtons(latestResults.length);
    getPage(0);
}

function getPage(start) {
    const advResultsSection = document.querySelector('.advresults');
    removeAllChildNodes(advResultsSection);

    const advresultDiv = document.createElement('div');
    const resultUl = document.createElement('ul');

    for (let i = start; i < (start + 10); i++) {
        const beer = latestResults[i];
        if (beer == undefined) break;
        const li = document.createElement('li');
        li.textContent = beer.name;
        li.addEventListener('click', () => {
            beerInfoPage(beer);
        });
        resultUl.appendChild(li);
    }

    advresultDiv.appendChild(resultUl);
    advResultsSection.appendChild(advresultDiv);
}

function renderPageButtons(length) {
    const pageButtonsSection = document.querySelector('.pageButtonsSection');
    removeAllChildNodes(pageButtonsSection);

    let numPages = Math.ceil(length / 10);
    for (let i = 0; i < numPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i + 1;
        pageBtn.addEventListener('click', () => {
            getPage(i * 10);
        });
        pageButtonsSection.appendChild(pageBtn);
    }
    const results = document.querySelector('.results h2');
    results.textContent = `Search Results (${length})`;
}


searchInp.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        searchBtn.click();
    }
});

searchBtn.addEventListener('click', () => {
    getData(`${root}${beername}${searchInp.value}`, renderBeer);
});
// infoPage.addEventListener('click', () => {
//     infoPage.classList.toggle('invisible');
// });

advBtn.addEventListener('click', () => {
    displaySection.classList.toggle('invisible');
    advSection.classList.toggle('invisible');
});




function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function getData(url, callback) {
    fetch(url).then(r => r.json()).then(callback).catch(e => console.log(e));
}

function renderBeer(data) {
    removeAllChildNodes(displaySection);
    data.forEach(beer => {
        const outerDiv = document.createElement('div');
        const imgDiv = document.createElement('div');
        const h4Div = document.createElement('div');
        const img = document.createElement('img');
        const h4 = document.createElement('h4');
        const p = document.createElement('p');

        img.src = beer.image_url != null ? beer.image_url : 'notfound.png'
        h4.textContent = beer.name;
        p.textContent = 'See More >';

        imgDiv.classList.add('imgcontainer');
        h4Div.classList.add('title')
        outerDiv.classList.add('beercontainer');
        
        imgDiv.appendChild(img);
        h4Div.appendChild(h4);
        outerDiv.appendChild(imgDiv);
        outerDiv.appendChild(h4Div)
        outerDiv.appendChild(p);

        displaySection.appendChild(outerDiv);
        outerDiv.addEventListener('click', (e) => {
            // console.log(beer);
            beerInfoPage(beer);
        });
    });
}