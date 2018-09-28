FROM node:8

WORKDIR /usr/src/app

COPY imagereceiver/package*.json ./imagereceiver/

RUN cd imagereceiver && npm install

COPY imagereceiver/ ./imagereceiver/

RUN cd imagereceiver && npm run build-ts

COPY viewer-app/dist ./viewer-app/dist

EXPOSE 8080

CMD ["node", "imagereceiver/lib/index.js"]