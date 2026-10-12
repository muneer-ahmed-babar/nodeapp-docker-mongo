FROM node:22-alpine

WORKDIR /app

# Copy package files first so the npm install layer is cached
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3030

CMD ["node", "server.js"]

# -----------------------------------------------------------------------

# FROM node

# ENV MONGO_DB_USERNAME=${MONGO_USER} \
#     MONGO_DB_PWD=${MONGO_PASSWORD}

# RUN mkdir -p nodeapp

# COPY . /nodeapp

# CMD ["node", "/nodeapp/server.js"]