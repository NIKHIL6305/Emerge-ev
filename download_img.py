import urllib.request
import re

url = 'https://html.duckduckgo.com/html/?q=tata+tiago+ev+indias+most+affordable+electric+car+battery+capacity+claimed+range'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    links = re.findall(r'https?://[^"\']+\.(?:png|jpg|jpeg)', html, re.IGNORECASE)
    if links:
        print("Found links:", links[:5])
        img_url = links[0]
        urllib.request.urlretrieve(img_url, 'public/cars/tiago.jpg')
        print("Downloaded to public/cars/tiago.jpg")
except Exception as e:
    print(e)
