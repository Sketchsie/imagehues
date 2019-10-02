let imagesPerLoad = 30;
let totalImageSets = 15;
let imageContainer = document.querySelector(".image-container");
let loader = document.querySelector(".loader");
let imagesSetsLoaded = 0;
let flag = true;
let favouriteImages = [];
let imageProperties = { url: "", color1: "", color2: "", color3: "", color4: "" };
let displayedImageUrls = [];
let rowUrl = [];
let continuousLoad = true;


//Fetch image set with api
function fetchImage() {


    // const requestUrl = `https://picsum.photos/400/300?random=${Math.ceil(Math.random() * 10000)}`;
    const requestUrl = `https://source.unsplash.com/collection/random/400x300?sig=${Math.ceil(Math.random() * 10000)}`;

    axios({
        method: 'get',
        url: requestUrl,
        responseType: 'json',
    })
        .then(function (response) {
            console.log(response);
            imageUrl = response.request.responseURL;


            let imageExists = false;


            for (let i = 0; i < displayedImageUrls.length; i++) {
                if (response.request.responseURL === displayedImageUrls[i]) {
                    imageExists = true;
                }
            }

            if (!imageExists) {

                createImageCard(response.request.responseURL);

                displayedImageUrls.push(response.request.responseURL);
            }


        });

}





//Creating image card
function createImageCard(url) {
    let item = document.createElement('div');
    item.classList.add('item');
    item.innerHTML = `
                <img src="${url}" alt="random image"/>
                <div class="color-panel">
                    <div class="color" onclick="onColorClick(event)">
                        <div class="tooltip"></div>
                    </div>
                    <div class="color" onclick="onColorClick(event)">
                        <div class="tooltip"></div>
                    </div>
                    <div class="color" onclick="onColorClick(event)">
                        <div class="tooltip"></div>
                    </div>
                    <div class="color" onclick="onColorClick(event)">
                        <div class="tooltip"></div>
                    </div>
                </div>
                <div class="favourite" onclick="addRemoveFavourites(event)">
                    <svg viewBox="0 0 14.231 12.094" xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(-1.999 -4)">
                        <g transform="translate(1.999 4)" data-name="Layer 2">
                        <path transform="translate(-1.999 -4)" d="M9.114,16.095a.711.711,0,0,1-.505-.206L3.081,10.353A3.723,3.723,0,1,1,8.346,5.089l.768.768.768-.768a3.723,3.723,0,1,1,5.265,5.265L9.619,15.888A.711.711,0,0,1,9.114,16.095ZM5.713,5.423a2.277,2.277,0,0,0-1.622.669,2.305,2.305,0,0,0,0,3.251l5.023,5.03,5.023-5.03a2.305,2.305,0,0,0,0-3.251,2.362,2.362,0,0,0-3.244,0L9.619,7.372a.711.711,0,0,1-1.01,0L7.335,6.092a2.277,2.277,0,0,0-1.622-.669Z" fill="#202428"/>
                        </g>
                        </g>
                    </svg>
                </div>
            
            `
    imageContainer.appendChild(item);
    item.children[0].setAttribute("crossorigin", "anonymous");
    findColors(item);
    loadFavourites(item);
}


//Load Images
function loadImageSet() {

    imagesSetsLoaded++;



    if (imagesSetsLoaded < totalImageSets) {

        loader.style.display = "flex";

        for (let i = 0; i < imagesPerLoad; i++) {
            fetchImage();
        }

    }
    else {
        loader.style.display = "none";
    }

}

//Find image color palette
function findColors(item) {

    let color;
    const img = item.children[0];

    const colorThief = new ColorThief();
    const color1 = img.nextElementSibling.children[0];
    const color2 = img.nextElementSibling.children[1];
    const color3 = img.nextElementSibling.children[2];
    const color4 = img.nextElementSibling.children[3];

    if (img.complete) {
        fillColor(colorThief.getPalette(img, 4));
    } else {
        img.addEventListener('load', function () {
            fillColor(colorThief.getPalette(img, 4));
        });
    }

    function fillColor(colors) {
        color1.style.backgroundColor = `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})`;
        color2.style.backgroundColor = `rgb(${colors[1][0]}, ${colors[1][1]}, ${colors[1][2]})`;
        color3.style.backgroundColor = `rgb(${colors[2][0]}, ${colors[2][1]}, ${colors[2][2]})`;
        color4.style.backgroundColor = `rgb(${colors[3][0]}, ${colors[3][1]}, ${colors[3][2]})`;

        color1.children[0].innerHTML = "<span>" + rgbToHex(colors[0][0], colors[0][1], colors[0][1]) + "</span";
        color2.children[0].innerHTML = "<span>" + rgbToHex(colors[1][0], colors[1][1], colors[1][1]) + "</span";
        color3.children[0].innerHTML = "<span>" + rgbToHex(colors[2][0], colors[2][1], colors[2][1]) + "</span";
        color4.children[0].innerHTML = "<span>" + rgbToHex(colors[3][0], colors[3][1], colors[3][1]) + "</span";
    }


}


//Load more images when scroll reaches bottom
window.addEventListener("scroll", () => {
    if (Math.ceil(window.innerHeight + document.documentElement.scrollTop) >= document.body.offsetHeight - 30) {

        if (continuousLoad) {
            setTimeout(() => {
                loadImageSet();
            }, 500);
        }
        else {
            if (flag) {
                loadImageSet();
            }
            flag = false;
        }


    }
    else {
        flag = true;
    }


});


//Copy color to clipboard on click
function onColorClick(e) {
    let rgbColor = getRGB(e.target.style.backgroundColor);
    let red = rgbColor.red;
    let green = rgbColor.green;
    let blue = rgbColor.blue;
    let hexColor = rgbToHex(red, green, blue);
    copyToClipboard(hexColor);
    e.target.children[0].innerHTML = "<span>Copied</span>";
    setTimeout(() => {
        e.target.children[0].innerHTML = "<span>" + hexColor + "</span";
    }, 4000);

    function getRGB(str) {
        var match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
        return match ? {
            red: match[1],
            green: match[2],
            blue: match[3]
        } : {};
    }

    function copyToClipboard(str) {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        const selected =
            document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        if (selected) {
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(selected);
        }
    };
}


//convert particular r,g or b value to its corresponding hex value
function convertToHex(rgb) {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};


//convert rgb value to hex value
function rgbToHex(r, g, b) {
    let red = convertToHex(r);
    let green = convertToHex(g);
    let blue = convertToHex(b);
    return '#' + red + green + blue;
};


//add or remove to/from favourites
function addRemoveFavourites(event) {

    event.currentTarget.classList.add("added");
    if (localStorage.getItem("imageHueUrl")) {
        favouriteImages = JSON.parse(localStorage.getItem("imageHueUrl"));
    }
    let imageUrl = event.currentTarget.parentElement.children[0].getAttribute("src");
    let colorPalette = event.currentTarget.parentElement.children[1];
    imageProperties.url = imageUrl;
    imageProperties.color1 = colorPalette.children[0].style.backgroundColor;
    imageProperties.color2 = colorPalette.children[1].style.backgroundColor;
    imageProperties.color3 = colorPalette.children[2].style.backgroundColor;
    imageProperties.color4 = colorPalette.children[3].style.backgroundColor;
    for (let i = 0; i < favouriteImages.length; i++) {
        if (imageUrl === favouriteImages[i].url) {
            event.currentTarget.classList.remove("added");
            favouriteImages.splice(i, 1);
            localStorage.setItem("imageHueUrl", JSON.stringify(favouriteImages));
        }
    }
    favouriteImages.push(imageProperties);
    localStorage.setItem("imageHueUrl", JSON.stringify(favouriteImages));

}


//set image as favourite if the image displayed has already been added to favourites
function loadFavourites(item) {
    const imageUrl = item.children[0].getAttribute("src");
    if (localStorage.getItem("imageHueUrl")) {
        favouriteImages = JSON.parse(localStorage.getItem("imageHueUrl"));
    }
    for (let i = 0; i < favouriteImages.length; i++) {
        if (imageUrl === favouriteImages[i].url) {
            item.querySelector(".favourite").classList.add("added");
        }
    }
}



loadImageSet();




