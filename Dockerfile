FROM zenika/alpine-chrome:with-playwright
USER ROOT
RUN mkdir /app
WORKDIR /app
COPY ./ ./
RUN npm i
CMD [ "npm", "start" ]