from nucosObs.observer import Observer
import asyncio as aio


class Interaction(Observer):
    def __init__(self, name, ptv, observable):
        super(Interaction, self).__init__(name, observable)
        self.cn = self.__class__.__name__
        self.ptv = ptv

    async def addChart(self):
        await self.ptv.addChart()

    def scheduleOnceSync(self, method, t, *args):
        aio.ensure_future(self.scheduleOnce(method, t, *args))

