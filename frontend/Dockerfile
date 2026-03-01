FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# The source code will be mounted from the host.
# We copy it here just in case, but docker-compose overrides it.
COPY . .

CMD ["npm", "run", "dev", "--", "--host"]
