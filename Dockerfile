FROM node:8 AS front-builder

WORKDIR /usr/src/app

COPY viewer-app/package*.json ./viewer-app/

RUN cd viewer-app && yarn install

COPY viewer-app ./viewer-app

RUN cd viewer-app; npm run build

FROM node:8 AS back-builder

WORKDIR /usr/src/app
COPY imagereceiver/package*.json ./imagereceiver/

RUN cd imagereceiver && npm install

COPY imagereceiver/ ./imagereceiver/

RUN cd imagereceiver && npm run build-ts

FROM node:8

WORKDIR /usr/src/app

COPY --from=front-builder /usr/src/app/viewer-app/dist ./viewer-app/dist

COPY --from=back-builder /usr/src/app/imagereceiver/node_modules ./imagereceiver/node_modules
COPY --from=back-builder /usr/src/app/imagereceiver/lib ./imagereceiver/lib

EXPOSE 8080

CMD ["node", "imagereceiver/lib/index.js"]