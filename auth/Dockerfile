FROM node:14-alpine
RUN apk update && apk add bash
RUN apk add --no-cache --virtual .build-deps alpine-sdk python3
RUN mkdir -p /var/www/auth

WORKDIR /var/www/auth
ADD . /var/www/auth

RUN npm install
# RUN npm run build
RUN npx prisma generate

CMD npm run start