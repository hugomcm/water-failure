# Base image
FROM node:12.16.1-stretch-slim

RUN apt-get update && apt-get upgrade -y
#RUN apt-get install vim.tiny -y

USER node
RUN echo "alias ls='ls -alF --color=auto'" >> /home/node/.bashrc
RUN mkdir -p /home/node/water-failure
WORKDIR /home/node/water-failure

COPY index.js lib.js test-email.js package.json package-lock.json ./

RUN npm i

USER root
WORKDIR /home/node/water-failure

ENTRYPOINT ["npm", "start"]