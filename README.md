# Water Failure

Checks from time to time for water supply failure and sends an email to notify the changes.

The application will search for a certain keyword and notifies only new messages with that keyword.

Note: by default the search will be on http://www.simar-louresodivelas.pt/ index page and will search for a certain passed keyword.

## Install

```bash
$ git clone https://github.com/hugomcm/water-failure.git
$ cd water-failure
$ npm i
```

## Config (see .env.default file)

```bash
$ export WF_URI=http://www.simar-louresodivelas.pt/
$ export WF_ELEM_SELECTOR=".tab-content #home"
$ export WF_CHECK_PERIOD_IN_SECS=1800
$ export WF_SEARCH_KEYWORD=odivelas
$ export WF_FROM=info@example.com
$ export WF_TO=recipient1@example.com,recipient2@example.com
$ export WF_SENDGRID_API_KEY=SG.????
```

## Run

```bash
$ npm start
```
