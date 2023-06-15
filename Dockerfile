FROM node:latest
CMD ["/usr/local/bin/node", "index.js"]
WORKDIR /home/node

COPY --chown=node:node . .

RUN apk add -U --no-cache --virtual .build-deps python3 git build-base sudo \
  && sudo -u node npm install --prod \
  && sudo -u node npm cache clean -f \
  && apk del .build-deps \
  && rm -rf build tmp/* /var/cache/apk/*

USER node