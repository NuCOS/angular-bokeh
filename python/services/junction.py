import sys
import asyncio as aio
import traceback
import simplejson as json
import inspect
from services import logger

from nucosObs.observer import broadcast

modalFct = ["wakeUp"]


class Junction():
    def __init__(self, servers):
        self.cn = self.__class__.__name__
        self.servers = servers
        self.sleep = False

    async def shutdown(self):
        """
        not used at the moment
        """
        await broadcast.put("stop_observer")

    def do_it(self, a):
        try:
            inp = json.loads(a)
            is_json = True
        except:
            is_json = False
        logger.log(lvl="INFO", msg="from angular: %s" % a[0:100], orig=self.cn)
        if is_json:
            fct = inp["name"]
            args = inp["args"]
            user = inp["user"]
            if self.sleep and fct not in modalFct:
                return
            try:
                method = getattr(self, fct)
                if inspect.iscoroutinefunction(method):
                    aio.ensure_future(method(*args, user=user))
                else:
                    return method(*args, user=user)
            except:
                exc_type, exc_value, exc_traceback = sys.exc_info()
                formatted_lines = traceback.format_exc().splitlines()
                return ("ERROR no valid json-function call from junction via .. %s \n %s \n %s \n %s" % (fct, exc_type, exc_value, formatted_lines))

    async def send_event(self, jtxt, user=None):
        await self.servers[0].sendEventWait(jtxt, user)


