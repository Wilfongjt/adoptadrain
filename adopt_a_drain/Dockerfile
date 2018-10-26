FROM node:8.11.3
ENV HOST 0.0.0.0
WORKDIR /usr/src/app
ADD . /usr/src/app
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "dev"]
