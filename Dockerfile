FROM node:alpine

WORKDIR '/app'

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
# /app/build <--- all the stuff
FROM nginx
# To expose port for the cloud (AWS)
EXPOSE 80
COPY --from=0 /app/build /usr/share/nginx/html