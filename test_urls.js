const https = require('https');
const urls = [
  "https://www.pngmart.com/files/10/Porsche-Panamera-Transparent-PNG.png",
  "https://www.pngmart.com/files/22/Tesla-Car-PNG-Transparent.png",
  "https://www.pngall.com/wp-content/uploads/2016/04/Sports-Car-PNG.png",
  "https://www.transparentpng.com/thumb/car/bVj1s2-red-sports-car-png.png"
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(url, res.statusCode);
  }).on('error', (e) => {
    console.log(url, e.message);
  });
});
