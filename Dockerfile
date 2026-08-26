FROM node:20-alpine as frontend_builder

WORKDIR /app

COPY Frontend/package*.json ./
RUN npm install

COPY Frontend/ ./
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]


FROM node:20-alpine

WORKDIR /app

COPY Backend/package*.json ./
RUN npm install

COPY Backend/ ./
COPY --from=frontend_builder /app/dist ./public

EXPOSE 8000

CMD ["node", "server.js"]
