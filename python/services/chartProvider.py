import time
import numpy as np
from bokeh.plotting import figure
from bokeh.embed import json_item

# NOTE: update to 2.3.2

class ChartProvider():
    def __init__(self):
        self.phi = 0

    def chartExample(self):
        t0 = time.time()
        # prepare some data
        self.phi += 0.02
        x = np.arange(0., 10., 0.1)
        y = np.sin(x + self.phi)
        # create a new plot
        p = figure()
        p.line(x, y, legend_label="SIN")
        chart_item = json_item(p)
        print(time.time()-t0)
        return chart_item
