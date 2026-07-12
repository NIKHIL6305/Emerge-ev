import urllib.request
import re

url = "https://3dmodels.org/3d-models/tata-tiago-2021/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        images = re.findall(r'https://[^"]+\.jpg', html)
        for img in set(images):
            if "Tiago" in img or "tiago" in img:
                print(img)
except Exception as e:
    print(e)
