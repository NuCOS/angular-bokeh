import os
import sys

# Ensure services package can be imported
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from services.chartProvider import ChartProvider


def test_chart_provider_returns_bokeh_item():
    cp = ChartProvider()
    item = cp.chartExample()
    assert isinstance(item, dict)
    # Basic keys expected in a Bokeh JSON item
    for key in ["target_id", "root_id", "doc", "version"]:
        assert key in item
