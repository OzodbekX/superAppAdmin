FROM node:18-alpine3.18 as builder
WORKDIR /app
COPY package.json .
# RUN npm install
RUN yarn
COPY . .
RUN yarn build
# RUN npm run build
FROM nginx
# FROM nginx:alpine
#WORKDIR /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/.env /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
