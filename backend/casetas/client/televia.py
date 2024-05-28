import requests

url = "https://www.televiaweb.mx/"

payload = '__RequestVerificationToken=-tm9UYCB3V3roRGLqR0ftZkQQdfTWjToXmUcea3xYA800blkOXhB8VFueMkUzzwhjdwqVyFrd1DN8KL0pVL12aAo76_k2Jm_Mr8wuCAKvjU1&userClave=0002536516&password=rOBAISp0&Captcha=39&Tag=(Todas)'
headers = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Content-Type': 'application/x-www-form-urlencoded',
  'Cookie': 'ARRAffinity=bfc182fe46a87aff3e3143aeb2efacc573fc1df446250053af04cb513db66771; ARRAffinitySameSite=bfc182fe46a87aff3e3143aeb2efacc573fc1df446250053af04cb513db66771; TS0125a7b9=01ee700fafb27412acff85adbad355972471a1b39419733319d181bd7b4082423fb4d6acf60eb459ae3926e74ec5059de51f61ab96fa4d60f675d5dd66e20c9689316d8d6c6cade3b6c208765bbd42ebf2a321061e; __RequestVerificationToken=dkkn9zxNZRQL6pAQ1yA3ZtyIF2aflLbzRyh0aJKyuCvsq_e1aHFJ_tUihJtIMhZQngGiMRp5jm7dUbYt23qEpdqCrttSmhzCfhWmTAjIUz81; ASP.NET_SessionId=p2p030svk4gl0scalmvjlpx4; _gid=GA1.2.1671681678.1716854369; _ga=GA1.1.645061102.1713910873; TS017d91ba=01ee700fafc1077250edf21b880b40af3eb0e6b8b315d82becefb446aacae0b0ad42cb85159543018406cdaef35451b264ac0e899a0a8d76616209bf4bc4086b5305905b0b452a4694cb94088508d86c0bef5f844595042bb74603f78dd982b6f839050488; _ga_9L7T8WPTHM=GS1.1.1716854369.7.1.1716854582.60.0.0; TS017d91ba=01ee700faf738373965d6294c506e4d1be7cd4dcede47ba8c5220d52d2b4377889e2010da8549ae2c86f39180b01248af8affa97b68b87c579e55e1e761292472ccc0e3e5dc7a8baac7da107c86599f5b5a9eb94cb07f37fdb7443fbebc73f83690e41bf72',
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

class TeleviaAPI:

    def login(self, *args, **kwargs):
        response = requests.request("POST", url, headers=headers, data=payload)
        if response.status_code == 200:
            print(response.text)
        else:
            raise Exception("Login failed: " + response.text)


{"username": "0002536516", "password": "rOBAISp0"}