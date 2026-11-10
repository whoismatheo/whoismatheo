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
        pg.goto(URL); pg.wait_for_timeout(700)
        ck(name+": locked on first load",pg.evaluate(STATE)=="locked")
        box=pg.evaluate("(()=>{const r=document.getElementById('entry').getBoundingClientRect();return [r.width,r.height,innerWidth,innerHeight]})()")
        ck(name+": entry fills the viewport",box[0]==box[2] and box[1]==box[3])
        ck(name+": main hidden and inert while locked",pg.evaluate("getComputedStyle(document.querySelector('main')).visibility")=="hidden" and pg.evaluate("document.querySelector('main').inert"))
        ck(name+": page not scrollable while locked",pg.evaluate("getComputedStyle(document.documentElement).overflow")=="hidden")
        ck(name+": button text",pg.inner_text(".entry-btn").strip()=="tap to enter")
        if name=="mobile": pg.screenshot(path=os.path.join(OUT,"entry-mobile.png"))
        pos=pg.evaluate("(()=>{const s=document.querySelector('.zp-stage').getBoundingClientRect(),b=document.querySelector('.entry-btn').getBoundingClientRect();return {gap:Math.round(b.top-s.bottom),cx:Math.round((s.left+s.right)/2-innerWidth/2),bcx:Math.round((b.left+b.right)/2-innerWidth/2),bb:Math.round(innerHeight-b.bottom)}})()")
        ck(name+": text sits right under the zippo, centered, not pinned to the bottom",abs(pos["gap"])<=24 and abs(pos["cx"])<=2 and abs(pos["bcx"])<=2 and pos["bb"]>60)
        lid="(()=>{const m=getComputedStyle(document.querySelector('.zp-pivot')).transform;if(m==='none')return 0;const v=m.match(/matrix3d\\((.*)\\)/)[1].split(',').map(Number);return Math.round(Math.atan2(v[6],v[5])*180/Math.PI)})()"
        ck(name+": zippo starts open (lid far from closed)",abs(pg.evaluate(lid))>60)
        pg.tap(".entry-btn") if mobile else pg.click(".entry-btn")
        pg.wait_for_timeout(60)
        ck(name+": closing state first",pg.evaluate(STATE)=="closing")
        ck(name+": site still locked while the lid closes",pg.evaluate("getComputedStyle(document.querySelector('main')).visibility")=="hidden")
        if not reduce:
            vals=[]
            for _ in range(40):
                if pg.evaluate(STATE)!="closing": break
                vals.append(abs(pg.evaluate(lid))); pg.wait_for_timeout(40)
            ck(name+": lid swings through intermediate angles (animated, not a swap)",any(8<v<100 for v in vals) and max(vals)>60)
        pg.wait_for_function("document.documentElement.dataset.entry==='opening'",timeout=4000)
        ck(name+": lid closed before the reveal starts",abs(pg.evaluate(lid))<=1)
        ck(name+": site unlocked only now",pg.evaluate("getComputedStyle(document.querySelector('main')).visibility")=="visible")
        if name!="reduced": pg.screenshot(path=os.path.join(OUT,"opening-"+name+".png"))
        pg.wait_for_function("document.documentElement.dataset.entry==='open'",timeout=5000)
        ck(name+": open and entry removed",pg.evaluate(STATE)=="open" and pg.evaluate("!document.getElementById('entry')"))
        ck(name+": main visible and not inert",pg.evaluate("getComputedStyle(document.querySelector('main')).visibility")=="visible" and not pg.evaluate("document.querySelector('main').inert"))
        ck(name+": no giant title, no tagline, no footer line",pg.evaluate("!document.querySelector('.hero-title')&&!document.querySelector('.tag')&&!document.querySelector('footer [data-i18n=footer]')")and pg.evaluate("document.querySelector('h1').className")=="sr")
        ck(name+": no horizontal overflow",pg.evaluate("document.documentElement.scrollWidth")<=w)
        ck(name+": no page errors",not errs)
        if name!="reduced": pg.wait_for_timeout(2500); pg.screenshot(path=os.path.join(OUT,"home-"+name+".png"))
        pg.reload(); pg.wait_for_timeout(500)
        ck(name+": reload in same session skips entry",pg.evaluate(STATE)=="open" and pg.evaluate("!document.getElementById('entry')"))
        ctx.close()
    b.close()
print("FAILED: "+", ".join(bad) if bad else "all passed"); sys.exit(1 if bad else 0)
