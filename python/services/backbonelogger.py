# -*- coding: utf-8 -*-
"""
backbonelogger
--------------

.. module:: backbonelogger
   :platform: Unix, Windows
   :synopsis: provides logging
    
log levels:

========  ===========
ERROR     'ERROR'
WARNING   'WARNING'
INFO      'INFO'
DEBUG     'DEBUG'
========  ===========

Created 2016/2017

@author: oliver, johannes
"""

import logging
import os


class Logger():
    """
    This brings advanced logging from the python batteries:

        logger = Logger('clientLogger')

        logger.format([], '[%(asctime)-15s] %(name)-8s %(levelname)-7s  -- %(message)s')

        logger.level("DEBUG")

    Das format gibt ein Ausgabeformat vor, das bestimmte items vorhält. Bei FDM Tool braucht zunächst kein item in die Liste rein, also eher sowas::

         logger.format(["clientip","user"], '[%(asctime)-15s] %(name)-8s %(levelname)-7s %(clientip)s %(user)s -- %(message)s')

    a basic logger format would be::

        "%(levelname)s:%(name)s:%(message)s"

    """

    def __init__(self, name, path=os.path.dirname(__file__)):
        self.logger = logging.getLogger(name=name)
        self.items = []
        self.path = path
        self.format(
            ["orig"],
            '[%(asctime)-15s] %(orig)-12s %(levelname)-7s  -- %(message)s')
        self.level("WARNING")

    def getLogger(self, name):
        return self
        # Logger(name,path=self.path)
        # self.logger.getChild(name)

    def format(self, items, FORMAT):
        """
        :param items: [] list type item argument(s)
        :param FORMAT: '[%(asctime)-15s] %(name)-8s %(levelname)-7s  -- %(message)s' format string e.g. with four variables
        """
        if self.logger.handlers:
            return
        self.items = items
        handler = logging.StreamHandler()
        self.formatter = logging.Formatter(FORMAT)
        handler.setFormatter(self.formatter)
        self.logger.addHandler(handler)

    def level(self, loglevel):
        numeric_level = getattr(logging, loglevel.upper(), None)
        if isinstance(numeric_level, int):
            self.logger.setLevel(numeric_level)
        else:
            raise ValueError('Invalid log level: %s' % loglevel)

    def log(self, *msgs, **logdict):
        """
        more robust version, since missing arguments in the logdict are handled correctly
        TODO: add the loglevel logic

        Most commonly use like this::

            self.cn = self.__class__.__name__
            message = f"my message from {self.cn}"

            log(lvl="INFO", msg=message, orig=self.cn)

        """
        # if logger.isEnabledFor(self.DEBUG):
        # this is to put a special output level in the Logger class

        if not msgs:
            msg = logdict.pop('msg')
        else:
            msg = msgs[0]
        for i in self.items:
            if i not in logdict.keys():
                logdict.update({i: ""})
        if 'lvl' in logdict.keys():
            lvl = logdict['lvl']
            numeric_level = getattr(logging, lvl.upper(), None)
            if not isinstance(numeric_level, int):
                raise ValueError('Invalid log level: %s' % lvl)
        else:
            numeric_level = logging.INFO
        self.logger.log(numeric_level, msg, extra=logdict)


if __name__ == "__main__":

    logger = Logger("TestLogger")
    logger.level("DEBUG")

    class ExampleClass():
        """

        """

        def __init__(self):
            self.logger = logger.getLogger(name=self.__class__.__name__)
            self.logger.level("DEBUG")

        def print_fun(self, msg):
            self.logger.log(lvl="DEBUG", msg=msg)

    class OtherExampleClass():
        """

        """

        def __init__(self):
            self.logger = logger.getLogger(name=self.__class__.__name__)
            self.logger.level("DEBUG")

        def print_fun(self, msg):
            self.logger.log(lvl="DEBUG", msg=msg)

    logger.log(lvl="INFO", msg="Initial message")

    new_instance1 = ExampleClass()
    new_instance1.print_fun("message1")
    new_instance2 = OtherExampleClass()
    new_instance2.print_fun("message2")
