# Angular & Bokeh
> A small example on connecting bokeh with Angular and send data from a python backend.

objectives that are solved here:

* display a chart figure in an app or website, 
* be able to send update events from the python back-end.

A bokeh-chart component might not always be  the optimal solution, but we found this is a nice minimal example and a demonstrator:

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
conda create -n angular-bokeh python=3.8 simplejson bokeh aiohttp
conda activate angular-bokeh
pip install -r requirements.txt
```

At time of writing the current bokeh version is 2.3.2. It may change. Be sure the Bokeh-JS version located in index.html fits to the bokeh version in python. 

Latest update to Angular 10.

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

## Wiki

[Angular & Bokeh Wiki](../../wiki)

## Meta

Twitter – [@eckjoh2](https://twitter.com/eckjoh2) – contact@nucos.de

[https://github.com/NuCOS](https://github.com/NuCOS)

## Contributing

1. Fork it (<https://github.com/yourname/yourproject/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

### Keep your fork up-to-date

In your local working copy of your forked repository, you should add the original GitHub repository to the "remote" branches. ("remotes" are like nicknames for the URLs of repositories - origin is the default one, for example.) Then you can fetch all the branches from that upstream repository, and rebase your work to continue working on the upstream version. This can be done with the following sequence of commands:

1. Add the remote, call it e.g.: "upstream":

```
git remote add upstream git@github.com:NuCOS/angular-bokeh.git
```

2. Fetch all the branches of that remote into remote-tracking branches, such as upstream/master:

```
git fetch upstream
```

3. Make sure that you're on your master branch:

```
git checkout master
```
4. Rewrite your master branch so that any commits of yours that aren't already in upstream/master are replayed on top of that other branch:

```
git rebase upstream/master
```

If you don't want to rewrite the history of your master branch, (for example because other people may have cloned it) then you should replace the last command with git merge upstream/master. However, for making further pull requests that are as clean as possible, it's probably better to rebase.

5. If you've rebased your branch onto upstream/master you may need to force the push in order to push it to your own forked repository on GitHub. You'd do that with:
```
git push -f origin master
```
You only need to use the -f the first time after you've rebased
