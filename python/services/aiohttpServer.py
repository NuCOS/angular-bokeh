from aiohttp import web
import asyncio as aio
import simplejson as json

from nucosObs import debug
from nucosObs.observer import Observer
from nucosObs.observable import Observable
from nucosObs.aiohttpWebsocketInterface import AiohttpWebsocketInterface
from services import logger


# debug.append(True)

messageBroker = Observable()


def authenticate(id_, user, nonce, challenge):
    return True


class Authenticator():
    def __init__(self):
        self.approved = False

    async def startAuth(self, msg, wsi, nonce):
        inp = json.loads(msg)
        args = inp["args"]
        try:
            user, challenge, id_ = args["user"], args["challenge"], args["id"]
        except:
            return None, user
        if debug[-1]:
            print("start auth", msg)
        if authenticate(id_, user, nonce, challenge):
            context = {"name": "doAuth",
                       "args": {"authenticated": True, "id": id_},
                       "action": "finalizeAuth"}
            await wsi.send_str(json.dumps(context))
            if debug[-1]:
                print("Authenticate accepted of user %s" % user)
            return id_, user
        else:
            context = {"name": "doAuth",
                       "args": {"authenticated": False, "id": id_},
                       "action": "finalizeAuth"}
            await wsi.send_str(json.dumps(context))
            if debug[-1]:
                print("Authenticate refused")
            return None, user


class WebsocketObserver(Observer):
    def __init__(self, name, observable, wsi, ptv, concurrent=[]):
        super(WebsocketObserver, self).__init__(name, observable, concurrent)
        self.wsi = wsi
        self.ptv = ptv
        self.cn = self.__class__.__name__

    def parse(self, item):
        if debug[-1]:
            logger.log(lvl="INFO", msg="message received: %s" % item, orig=self.cn)
        if item.startswith("send") or item.startswith("client"):
            return super(WebsocketObserver, self).parse(item)
        else:
            out = self.ptv.do_it(item)
            # in case of error
            if type(out) is str:
                if "ERROR" in out:
                    print(out)
            return False, None, None

    async def client(self, msg):
        """
        do some extra shutdown work if necessary
        """
        pass

    async def send(self, user, *msg):
        n = 0
        while True and n < 20:
            n += 1
            try:
                await self.wsi.broadcast(' '.join(msg))
                break
            except:
                pass
            await aio.sleep(0.5)



class AiohttpServer():
    def __init__(self, ptv):
        self.app = web.Application(debug=False)
        self.messageBroker = Observable()
        self.wsi = AiohttpWebsocketInterface(
            self.app, self.messageBroker, doAuth=True, authenticator=Authenticator(), closeOnClientQuit=False)
        self.ptv = ptv
        self.wso = WebsocketObserver(
            "WSO", self.messageBroker, self.wsi, self.ptv)

    def close(self):
        aio.ensure_future(self.wsi.shutdown())

    async def startService(self, ip, port):
        """
        Handles a coroutine to be put into the loop elsewhere
        """
        runner = web.AppRunner(self.app)
        await runner.setup()
        site = web.TCPSite(runner, ip, port, ssl_context=None)
        await site.start()

    def sendEvent(self, jtxt, user):
        """
        Non blocking in this aio process:
        used if it is not critical to be processed at the moment
        """
        aio.ensure_future(self.messageBroker.put(f"send {user} " + jtxt))

    async def sendEventWait(self, jtxt, user):
        """
        blocking in this aio process:
        used if events must be put into certain order
        """
        await self.messageBroker.put(f"send {user} " + jtxt)




