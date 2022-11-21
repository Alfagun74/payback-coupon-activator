FROM zenika/alpine-chrome:with-playwright
USER root
RUN mkdir /app
WORKDIR /app
COPY ./ ./
RUN npm i
CMD [ "npm", "start" ]