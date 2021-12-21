FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production

ADD src ./src
COPY package* ./
COPY tsconfig.json ./



RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001
RUN chown -R nodeuser:nodejs ./
USER nodeuser
RUN npm i
EXPOSE 3001

CMD ["npm", "start"]
