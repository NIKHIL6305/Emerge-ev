import urllib.request
import re

url = "https://html.duckduckgo.com/html/?q=tata+tiago+2021+hum3d"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        images = re.findall(r'https://[^"]+\.jpg', html)
        for img in images:
            print(img)
except Exception as e:
    print(e)
