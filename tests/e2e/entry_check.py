import sys, os, threading, http.server, socketserver, functools
from playwright.sync_api import sync_playwright
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),"..",".."))
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),"out"); os.makedirs(OUT,exist_ok=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
s=socketserver.ThreadingTCPServer(("127.0.0.1",0),functools.partial(Q,directory=ROOT)); threading.Thread(target=s.serve_forever,daemon=True).start()
URL="http://127.0.0.1:%d/index.html"%s.server_address[1]
CHROME=os.environ.get("CHROME_PATH"); bad=[]
def ck(n,c):
    print(("ok   " if c else "FAIL ")+n)
    if not c: bad.append(n)
STATE="document.documentElement.dataset.entry"
with sync_playwright() as p:
    b=p.chromium.launch(**({"executable_path":CHROME} if CHROME else {}),args=["--no-sandbox"])
    for name,w,h,mobile,reduce in [("desktop",1280,800,False,"no-preference"),("mobile",390,844,True,"no-preference"),("reduced",390,844,True,"reduce")]:
        ctx=b.new_context(viewport={"width":w,"height":h},is_mobile=mobile,has_touch=mobile,reduced_motion=reduce)
        pg=ctx.new_page(); errs=[]; pg.on("pageerror",lambda e: errs.append(str(e)))
        pg.route("**/api/**",lambda r: r.fulfill(status=503,body="{}")); pg.route("https://**",lambda r: r.abort())
        pg.goto(URL); pg.wait_for_timeout(600)
        ck(name+": locked on first load",pg.evaluate(STATE)=="locked")
        box=pg.evaluate("(()=>{const r=document.getElementById('entry').getBoundingClientRect();return [r.width,r.height,innerWidth,innerHeight]})()")
        ck(name+": entry fills the viewport",box[0]==box[2] and box[1]==box[3])
        ck(name+": main hidden and inert while locked",pg.evaluate("getComputedStyle(document.querySelector('main')).visibility")=="hidden" and pg.evaluate("document.querySelector('main').inert"))
        ck(name+": page not scrollable while locked",pg.evaluate("getComputedStyle(document.documentElement).overflow")=="hidden")
        ck(name+": button text",pg.inner_text(".entry-btn").strip()=="tap to enter")
        if name=="mobile": pg.screenshot(path=os.path.join(OUT,"entry-mobile.png"))
        pg.tap(".entry-btn") if mobile else pg.click(".entry-btn")
        pg.wait_for_timeout(120)
        ck(name+": opening state right after tap",pg.evaluate(STATE) in("opening","open"))
        pg.wait_for_timeout(1200)
        ck(name+": open and entry removed",pg.evaluate(STATE)=="open" and pg.evaluate("!document.getElementById('entry')"))
        ck(name+": main visible and not inert",pg.evaluate("getComputedStyle(document.querySelector('main')).visibility")=="visible" and not pg.evaluate("document.querySelector('main').inert"))
        ck(name+": hero title removed",pg.evaluate("!document.querySelector('.hero-title')")and pg.evaluate("document.querySelector('h1').className")=="sr")
        ck(name+": no horizontal overflow",pg.evaluate("document.documentElement.scrollWidth")<=w)
        ck(name+": no page errors",not errs)
        if name!="reduced": pg.wait_for_timeout(2500); pg.screenshot(path=os.path.join(OUT,"home-"+name+".png"))
        pg.reload(); pg.wait_for_timeout(500)
        ck(name+": reload in same session skips entry",pg.evaluate(STATE)=="open" and pg.evaluate("!document.getElementById('entry')"))
        ctx.close()
    b.close()
print("FAILED: "+", ".join(bad) if bad else "all passed"); sys.exit(1 if bad else 0)
