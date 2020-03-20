# Water Failure

Checks from time to time for water supply failure and sends an email to notify the changes.

The application will search for a certain keyword and notifies only new messages with that keyword.

Note: by default the search will be on http://www.simar-louresodivelas.pt/ index page and will search for a certain passed keyword.

## On system

### Install

```
$ git clone https://github.com/hugomcm/water-failure.git
$ cd water-failure
$ npm i
```

### Run

```
# Usage
$ node index.js [search string] [check period in seconds] [html element selector] [uri to get the html content]
```

```
# Default call
$ npm start
```

```
# The same as the default call
$ npm start '' 2 '.tab-content #home' 'http://www.simar-louresodivelas.pt/'
```

```
# Searches for keyword 'Ramada' with a periodicity of 10 seconds
$ npm start 'Ramada' 10
```

## On a Docker container

### Build image

```
$ docker image build -f Dockerfile -t water-failure .
```

### Run container

#### Testing

```
# Run commandline
$ docker container run -it --rm --name check-water-failure-onlocation --entrypoint /bin/bash water-failure
```

```
# Run detached
$ docker container run -d -it --rm --name check-water-failure-onlocation water-failure Ramada 10
```

#### Production

```
# Run detached
$ docker container run -d -it --rm --name check-water-failure-onlocation water-failure Ramada 3600
```

#### Common

```
# Attach | Detach with interrupt: "^P^Q"
$ docker attach check-water-failure-onlocation
```

```
# Exec bash on container
$ docker container exec -it check-water-failure-onlocation /bin/bash
```

```
# Logs
$ docker logs check-water-failure-onlocation
```
