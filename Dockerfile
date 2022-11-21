FROM zenika/alpine-chrome:100-with-playwright
USER root
RUN mkdir /app
WORKDIR /app
COPY ./ ./
RUN npm i
RUN npx playwright install
CMD [ "npm", "start" ]