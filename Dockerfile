FROM node:16.18-alpine
CMD ["/usr/local/bin/node", "index.js"]
WORKDIR /home/node

ENV HTTP_PORT 8080
ENV MONGO_URI mongodb://localhost:27017/db

COPY --chown=node:node . .

RUN apk add -U --no-cache --virtual .build-deps python3 git build-base sudo \
  && sudo -u node npm install --prod \
  && sudo -u node npm cache clean -f \
  && apk del .build-deps \
  && rm -rf build tmp/* /var/cache/apk/*

USER node