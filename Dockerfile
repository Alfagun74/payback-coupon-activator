FROM zenika/alpine-chrome:with-playwright
RUN mkdir /app
WORKDIR /app
COPY ./ ./
RUN npm i
CMD [ "npm", "start" ]