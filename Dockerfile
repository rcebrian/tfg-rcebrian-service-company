#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:14 AS builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY tsconfig*.json ./
COPY .npmrc ./
COPY .env.development ./
COPY ./src ./src
RUN npm ci --quiet && npm run build



#
# Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM node:14

WORKDIR /app
ENV NODE_ENV=development

COPY package*.json ./
COPY .npmrc ./
COPY .env.development ./
RUN npm ci --quiet --only=development

## We just need the build to execute the command
COPY --from=builder /usr/src/app ./build
EXPOSE 3000 3306
CMD [ "node", "build/dist/src/index.js" ]
