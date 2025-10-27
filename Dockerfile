FROM --platform=linux/amd64 node:14

ARG name
ENV REACT_APP_NAME $name

COPY . /workdir
WORKDIR /workdir

RUN rm -rf node_modules build
RUN rm -rf package-lock.json
RUN npm i


CMD [ "npm", "start"]

EXPOSE 3000