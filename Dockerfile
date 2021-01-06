FROM node:12.19.0-stretch

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY --chown=node:node package*.json ./

RUN npm install --loglevel verbose

COPY --chown=node:node process.json process.json
COPY --chown=node:node keys keys
COPY --chown=node:node src src

ENV NODE_ENV release

CMD ["npm", "run", "start"]
