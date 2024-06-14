from casetas.models import Unidad, Cruce
from datetime import datetime, date, time
import pandas as pd
import requests, urllib, json


class TeleviaAPI:
    base_url = "https://www.televiaweb.mx/"
    auth_payload = '__RequestVerificationToken=-tm9UYCB3V3roRGLqR0ftZkQQdfTWjToXmUcea3xYA800blkOXhB8VFueMkUzzwhjdwqVyFrd1DN8KL0pVL12aAo76_k2Jm_Mr8wuCAKvjU1&userClave=%s&password=%s&Captcha=39&Tag=(Todas)'
    base_heders = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': '%s',
        'Origin': 'https://www.televiaweb.mx',
        'Pragma': 'no-cache',
        'Referer': 'https://www.televiaweb.mx/',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'accept': 'text/css,*/*;q=0.1',
        'accept-language': 'en-US,en;q=0.9,es;q=0.8',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
        'priority': 'u=0',
        'referer': 'https://www.televiaweb.mx/',
        'sec-fetch-dest': 'style',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'cookie': 'ar_debug=1',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Length': '0',
        'content-length': '0',
        'content-type': 'text/plain',
        'origin': 'https://www.televiaweb.mx',
        'x-client-data': 'CJe2yQEIpLbJAQipncoBCKGNywEIlaHLAQiGoM0BGPbJzQE='
    }

    def login(self, username, password):
        headers = self.base_heders.copy()
        del headers['Cookie']
        self.auth_payload = self.auth_payload % (username, password)
        response = requests.request("POST", self.base_url, headers=headers, data=self.auth_payload)
        if response.status_code == 200:
            response_headers = response.headers
            cookie = response_headers.get('Cookie')
            if cookie:
                self.base_heders['Cookie'] = cookie
                self.import_data()
            
            return cookie
        else:
            raise Exception("Login failed: " + response.text)

    def import_data(self):
        tags_to_import = Unidad.objects.all().values_list('tag', flat=True)
        today_start_of_day = datetime.combine(date.today(), time.min)
        today_end_of_day = datetime.combine(date.today(), time.max)
        start = today_start_of_day.strftime("%d/%m/%Y")
        start = urllib.parse.quote_plus(start)
        end = today_end_of_day.strftime("%d/%m/%Y")
        end = urllib.parse.quote_plus(end)

        # form data
        errors = []
        for tag in tags_to_import:
            payload = 'tag=%s&pfechaini=%s&pfechafin=%s&reg=999&pTipoCons=false&pConcesion=0' % (tag, start, end)
            headers = self.base_heders.copy()
            url = self.base_url + "LogOn/ObternerViajes"
            try:
                response = requests.request("POST", url, headers=headers, data=payload)
                if response.status_code == 200:
                    data = json.loads(response.text)
                    df = pd.DataFrame(data)
                    Cruce.import_from_raw_data(df)
                else:
                    errors.append(response.text)
            except Exception as e:
                errors.append(str(e))
            time.sleep(5) # to avoid being blocked by the server
        return errors
