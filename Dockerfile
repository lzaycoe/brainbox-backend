# ======================================================================
# Copyright (C) 2025 - lzaycoe (Lazy Code)
# ======================================================================
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
# ======================================================================

FROM node:20.17.0-alpine AS base
RUN addgroup -S backend && \
    adduser -S backend -G backend

#--------------------------------------------------

FROM base AS base-dev
RUN npm install -g --ignore-scripts pnpm prisma

#--------------------------------------------------

FROM base-dev AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml tsconfig.json tsconfig.build.json ./
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY ./src ./src
COPY ./prisma ./prisma
RUN pnpm run prisma:generate && \
    pnpm run build --webpack

#--------------------------------------------------

FROM base-dev AS production-dev
ARG NODE_ENV=production
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY ./prisma ./prisma
RUN pnpm install --frozen-lockfile --prod --ignore-scripts && \
    pnpm run prisma:generate && \
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
EXPOSE 4000
