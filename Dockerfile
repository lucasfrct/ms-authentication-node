FROM node:16
WORKDIR /home/olombongo/olombongo-ms-auth-node
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5001
CMD [ "npm", "run", "development" ]