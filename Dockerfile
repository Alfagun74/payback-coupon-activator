FROM mcr.microsoft.com/playwright
RUN mkdir /app
WORKDIR /app
COPY ./ ./
RUN npm i
CMD [ "npm", "start" ]