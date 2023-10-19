FROM node 

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]

#docker build -t dockeroperation


#Run docker run -p 8080:8080 dockeroperation:latest