const https = require('https');
https.get('https://html.duckduckgo.com/html/?q=tata+tiago+transparent+png', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const urls = data.match(/https?:\/\/[^"']+\.png/g);
    if(urls) {
      console.log([...new Set(urls)].join('\n'));
    }
  });
});
