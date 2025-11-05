# Use Node.js 22 Alpine (light image)
FROM node:22-alpine

#Create user no-root for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

#Set the working directory in the container
WORKDIR /app

#Copy package.json and package-lock.json to the working directory
COPY package*.json ./

#Install app dependencies
RUN npm install

##Copy necessary files
COPY --chown=nodejs:nodejs . .

#Change to no-root user
USER nodejs

#Expose the port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production \
    PORT=3000

# Healthcheck to verify app is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/home', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

#Command to run the app
CMD [ "node", "app.js" ]

