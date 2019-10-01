let imagesPerLoad = 20;
let totalImageSets = 10;
let imageContainer = document.querySelector(".image-container");
let imagesSetsLoaded = 0;

function createImage(index) {

    fetch(`https://picsum.photos/400/300?random=${index * index}`).then((response) => {

        let item = document.createElement('div');
        item.classList.add('item' + imagesSetsLoaded + '' + index, 'item');
        item.innerHTML = `
        <img src="${response.url}" alt="random image"/>
        <div class="color-panel color-panel${imagesSetsLoaded}${index}">
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
    
    `
        imageContainer.appendChild(item);
        item.children[0].setAttribute("crossorigin", "anonymous");
        findColors(item);
    })

}


function loadImageSet() {

    imagesSetsLoaded++;
    if (imagesSetsLoaded < totalImageSets) {

        for (let i = 0; i < imagesPerLoad; i++) {
            createImage(i);
        }

    }

}


function findColors(item) {

    let color;
    const img = item.children[0];

    const colorThief = new ColorThief();
    const color1 = img.nextElementSibling.children[0];
    const color2 = img.nextElementSibling.children[1];
    const color3 = img.nextElementSibling.children[2];
    const color4 = img.nextElementSibling.children[3];
    // const color5 = img.nextElementSibling.children[4];

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
        // color5.style.backgroundColor = `rgb(${colors[4][0]},${colors[4][1]},${colors[4][2]})`;

        color1.children[0].innerHTML= rgbToHex(colors[0][0],colors[0][1],colors[0][1]);
        color2.children[0].innerHTML= rgbToHex(colors[1][0],colors[1][1],colors[1][1]);
        color3.children[0].innerHTML= rgbToHex(colors[2][0],colors[2][1],colors[2][1]);
        color4.children[0].innerHTML= rgbToHex(colors[3][0],colors[3][1],colors[3][1]);
    }



    //---------------Vibrant js------------------------------------------------

    // const vibrantColor = img.nextElementSibling.children[0];
    // const mutedColor = img.nextElementSibling.children[1];
    // const darkVibrantColor = img.nextElementSibling.children[2];
    // const darkMutedColor = img.nextElementSibling.children[3];
    // const lightVibrantColor = img.nextElementSibling.children[4];

    // img.addEventListener('load', function () {
    //     var vibrant = new Vibrant(img);

    //     var swatches = vibrant.swatches();

    //     for (var swatch in swatches) {
    //         if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
    //             // console.log(swatch, swatches[swatch].getHex());
    //             color = swatches[swatch].getHex();

    //             switch (swatch) {
    //                 case "Vibrant": vibrantColor.style.backgroundColor = color
    //                     break;
    //                 case "Muted": mutedColor.style.backgroundColor = color
    //                     break;
    //                 case "DarkVibrant": darkVibrantColor.style.backgroundColor = color
    //                     break;
    //                 case "DarkMuted": darkMutedColor.style.backgroundColor = color
    //                     break;
    //                 case "LightVibrant": lightVibrantColor.style.backgroundColor = color
    //                     break;

    //             }
    //         }
    //     }


    // });
}


window.addEventListener("scroll", () => {
    if (Math.ceil(window.innerHeight + document.documentElement.scrollTop) >= document.body.offsetHeight) {
        setTimeout(() => {
            loadImageSet();
        }, 500);
    }

});


function onColorClick(e) {
    let rgbColor = getRGB(e.target.style.backgroundColor);
    let red = rgbColor.red;
    let green = rgbColor.green;
    let blue = rgbColor.blue;
    let hexColor = rgbToHex(red, green, blue);
    copyToClipboard(hexColor);
    e.target.children[0].innerHTML = "Copied";
    setTimeout(() => {
        e.target.children[0].innerHTML = hexColor; 
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


function convertToHex(rgb) {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};


function rgbToHex(r, g, b) {
    let red = convertToHex(r);
    let green = convertToHex(g);
    let blue = convertToHex(b);
    return '#' + red + green + blue;
};


loadImageSet();




