
import os
import getpass
import argparse
from aiohttp import web

from services.aiohttpServer import AiohttpServer
from services.pythonToView import PythonToView
from services.interaction import Interaction
from services import logger
from nucosObs import main_loop, loop, debug
from nucosObs.observable import Observable

import logging

# NOTE to switch on logging of the aiohttp server
# logging.basicConfig(level=logging.DEBUG)

_root_ = os.path.realpath(os.path.dirname(__file__))

debug.append(False)

parser = argparse.ArgumentParser(description="Angular-Bokeh server")
parser.add_argument(
    "--port",
    type=int,
    default=int(os.getenv("PORT", 9000)),
    help="Port for the web server (env: PORT)",
)
parser.add_argument(
    "--angular-path",
    default=os.getenv("ANGULAR_DIST_PATH", os.path.join(_root_, "../client/dist/dev")),
    help="Path to built Angular files (env: ANGULAR_DIST_PATH)",
)

args = parser.parse_args()
port = args.port

if __name__ == '__main__':
    ptv = PythonToView()
    server = AiohttpServer(ptv)
    ptv.setServer(server)

    path = os.path.abspath(args.angular_path)
    if not os.path.exists(path):
        logger.log(lvl="ERROR", msg="build the angular app first")
        exit()

    async def handle(request):
        return web.FileResponse(os.path.join(path, 'index.html'))

    # NOTE the app is already started in the server ....
    app = server.app
    app.add_routes([web.get('/', handle)])
    # NOTE for angular projects this is necessary ...
    app.add_routes([web.static('/', os.path.join(path, './'))])
    logger.log(lvl="INFO", msg="start server on localhost port %s" % port)
    logger.log(lvl="INFO", msg=f"path: {path}")
    runner = server.startService('0.0.0.0', port)
    interactionObservable = Observable()
    interaction = Interaction("ia", ptv, interactionObservable)
    # NOTE to test an update later on
    # interaction.scheduleOnceSync(interaction.addChart, 7.0)
    # interaction.scheduleRegular(interaction.addChart, 2.0)
    main_loop([runner, ])
