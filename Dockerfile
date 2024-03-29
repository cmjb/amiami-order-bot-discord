FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production

ENV DISCORD_CHANNEL 0
ENV DISCORD_TOKEN 0
ENV SEARCH_INTERVAL_MINUTES 5

ADD src ./src
COPY package* ./
COPY tsconfig.json ./



RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001
RUN chown -R nodeuser:nodejs ./
USER nodeuser
RUN npm i
RUN npx tsc

CMD ["npm", "start"]
