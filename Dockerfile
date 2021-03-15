# Base image
FROM node:14-buster-slim

RUN apt-get update && apt-get upgrade -y
#RUN apt-get install vim.tiny -y

# Not working with npm 7
# RUN npm install npm@latest -g

USER node
RUN echo "alias ls='ls -alF --color=auto'" >> /home/node/.bashrc
RUN mkdir -p /home/node/water-failure
WORKDIR /home/node/water-failure

COPY . .

RUN npm i

WORKDIR /home/node/water-failure

ENTRYPOINT ["npm", "start"]