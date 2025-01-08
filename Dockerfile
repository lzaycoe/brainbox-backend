FROM node:20.17.0-alpine AS base
RUN addgroup -S backend && \
    adduser -S backend -G backend

#--------------------------------------------------

FROM base AS base-dev
RUN npm install -g --ignore-scripts pnpm

#--------------------------------------------------

FROM base-dev AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml tsconfig.json tsconfig.build.json ./
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY ./src ./src
RUN pnpm run build --webpack

#--------------------------------------------------

FROM base-dev AS production-dev
ARG NODE_ENV=production
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts && \
    pnpm cache delete

#--------------------------------------------------

FROM base AS production
ARG NODE_ENV=production
WORKDIR /app
COPY --from=production-dev /app/node_modules ./node_modules
COPY --from=build /app/dist ./
COPY package.json ./
USER backend
ENTRYPOINT ["node", "main.js"]
EXPOSE 3000
