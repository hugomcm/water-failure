# Water Failure

Checks from time to time for water supply failure and sends an email to notify the changes.

The application will search for a certain keyword and notifies only new messages with that keyword.

Note: by default the search will be on http://www.simar-louresodivelas.pt/ index page and will search for a certain passed keyword.

## On system

### Install

```
git clone https://github.com/hugomcm/water-failure.git
cd water-failure
npm i
```

### Run

```
# Usage
npm start [search string] [check period in seconds] [html element selector] [uri to get the html content]
```

```
# Default call throws error if no email addresses passed
npm start
```

```
# The same as the default call
npm start '' null null 2 '.tab-content #home' 'http://www.simar-louresodivelas.pt/'
```

```
# Searches for keyword 'Ramada' with a periodicity of 10 seconds
npm start 'Ramada' info@example.com dest1@example.com,dest2@example.com 10
```

## Launch with docker

### Build image

```
docker image build -f Dockerfile -t water-failure .
```

### Run container

#### Testing

```
# Run commandline
docker container run -it --rm --name check-water-failure --entrypoint /bin/bash water-failure
```

```
# Run detached
docker container run -d -it --rm --name check-water-failure water-failure Ramada 10
```

#### Common

```
# Exec bash on container
docker container exec -it check-water-failure /bin/bash
```

```
# Logs
docker logs check-water-failure
```

## Launch with docker-compose
```
# instead of passing the arguments use a .env file
# copy the default and configure the .env file with your own settings
cat .env.default > .env
```

```
# bring up
docker-compose up -d
```

```
# tear down
docker-compose down
```
