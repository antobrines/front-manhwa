FROM node:latest AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . . 
RUN npm run build --prod

FROM nginx:latest
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/real-front/browser /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
