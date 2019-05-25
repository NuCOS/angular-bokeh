"""
pythonToView
------------

.. module:: pythonToView
   :platform: Unix, Windows
   :synopsis: python to view/gui base class

Created 2016/2017

@author: oliver, johannes
"""

import simplejson as json
from services.junction import Junction
from services.chartProvider import ChartProvider

class PythonToView(Junction):
    """
    This is the connection layer between angular and python. It keeps also information of the state of the gui.

    """
    def __init__(self):
        self.servers = []
        super(PythonToView, self).__init__(self.servers)
        self.chartProvider = ChartProvider()

    def setServer(self, server):
        self.servers.append(server)

    async def connect(self, *args, user=None):
        print("TEST", user, args)

    async def addChart(self, id_, callbackId, user):
        """
        Example for adding a bokeh chart from backend

        """
        chartItem = self.chartProvider.chartExample()
        print("try to add chart for dom-id %s" % id_)
        context = {"name": callbackId,
                   "args": {"item": chartItem, "id": id_}}
        await self.send_event(json.dumps(context), user=user)
