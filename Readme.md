# Angular & Bokeh
> A small example on connecting bokeh with Angular and send data from a python backend.

We recently had the problem to display a chart figure of quality in an app or website, but additionally we want to be able to send update events from the python back-end.

A bokeh-chart component might not always be  the optimal solution, but even though - we would like to share with you - what we found is a nice minimal example and a demonstrator:

    <bokeh-chart></bokeh-chart>

[see in app.component](client/src/app/app.component.html)

The interesting part of the problem is not the integration of bokeh as a bokeh-chart component to angular,

[see in bokeh-chart.component](client/src/app/shared/components/bokeh-chart/bokeh-chart.component.ts)

but the service, that provides the data for the chart and the functionality to the component, e.g. getChart():

[see in bokeh.service](client/src/app/shared/services/bokeh.service.ts)

and a possible back-end service written in python addChart() sends the chartItem as a json item over the websocket:

[see in pythonToView](python/services/pythonToView.py)

the minimal example, even written as a member function, looks very simple (chartProvider.py):

[see in chartProvider](python/services/chartProvider.py)

## Installation

OS X & Linux & Windows:

Install Anaconda and open a conda enabled shell:

```
conda create -n angular-bokeh python=3.7 simplejson bokeh aiohttp
conda activate angular-bokeh
pip install -r requirements.txt
```

## Usage

open shell in root folder of the repository

```
$ cd client/
$ npm install
$ ng build
```

change to python folder

```
$ cd ../python/
$ python app.py
```

in your browser you should see the app being served to:

```
http://localhost:9000/
```

## Meta

Twitter – [@eckjoh2](https://twitter.com/eckjoh2) – contact@nucos.de

[https://github.com/NuCOS](https://github.com/NuCOS)

## Contributing

1. Fork it (<https://github.com/yourname/yourproject/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
