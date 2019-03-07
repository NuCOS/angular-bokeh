"""
services
--------

Created 2016/2017

@author: oliver, johannes

general app services

"""

DEBUG = False
if DEBUG:
    # initiate logger with the lowest log-level
    loglvl = "DEBUG"
else:
    """
    ========  ===========
    ERROR     'ERROR'
    WARNING   'WARNING'
    INFO      'INFO'
    DEBUG     'DEBUG'
    ========  ===========
    """
    loglvl = "INFO"  # WARNING ERROR

from services.backbonelogger import Logger
logger = Logger('Logger')
logger.level(loglvl)
