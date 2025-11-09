FROM oven/bun:1 AS build
WORKDIR /app
COPY . .
RUN bun install
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
RUN bun run build --mode production

# Stage 2: Serve
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config to enable SPA fallback to index.html for client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
