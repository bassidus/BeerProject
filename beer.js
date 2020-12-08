// https://github.com/zocom-david-lundholm/js10-vanilla-slutprojekt

const root = 'https://api.punkapi.com/v2/beers';
const random = 'https://api.punkapi.com/v2/beers/random';
const beername = '?beer_name=';
const displaySection = document.querySelector('main > div.display');
const searchInp = document.querySelector('.flexdiv > input.inp');
const searchBtn = document.querySelector('.flexdiv > input.search');
const advBtn = document.querySelector('.flexdiv > input.adv');
const advSection = document.querySelector('main > div.advanced');
const advName = document.querySelector('input[name=name]');
const advHops = document.querySelector('input[name=hops]');
const advMalt = document.querySelector('input[name=malt]');
const advBrewBef = document.querySelector('input[name=brewbefore]');
const advBrewAft = document.querySelector('input[name=brewafter]');
const advAbvGre = document.querySelector('input[name=abvgreater]');
const advAbvLes = document.querySelector('input[name=abvless]');
const advSubmit = document.querySelector('form > input[type=button]');
const resultUl = document.querySelector('.results > ul');

advSubmit.addEventListener('click', (e) => {
    console.log(e)
    getData(`${root}${beername}${advName.value}`, advSearch);
});

function advSearch(result) {
    console.log(result)
    removeAllChildNodes(resultUl);
    result.forEach(beer => {
        const li = document.createElement('li');
        li.textContent = beer.name;
        resultUl.appendChild(li);
    });
}

searchInp.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        searchBtn.click();
    }
});

searchBtn.addEventListener('click', () => {
    getData(`${root}${beername}${searchInp.value}`, renderBeer);
});

advBtn.addEventListener('click', () => {
    displaySection.classList.toggle('invisible');
    advSection.classList.toggle('invisible');
});


const rndBtn = document.querySelector('input.rnd');
rndBtn.addEventListener('click', () => getData(random, renderBeer));

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

        if (beer.image_url != null) {
            imgDiv.appendChild(img);
            img.src = beer.image_url;
        } else {
            const p404 = document.createElement('p');
            p404.textContent = '404 Not Found';
            imgDiv.appendChild(p404);
        }
        outerDiv.appendChild(imgDiv);

        h4Div.appendChild(h4);
        outerDiv.appendChild(h4Div)

        outerDiv.appendChild(p);

        imgDiv.classList.add('imgcontainer');
        outerDiv.classList.add('beercontainer');
        h4Div.classList.add('title')


        h4.textContent = beer.name;
        p.textContent = 'See More >';

        displaySection.appendChild(outerDiv);
    });
}