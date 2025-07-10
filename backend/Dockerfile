FROM gradle:8.10-jdk17 AS build

WORKDIR /app
COPY . .

RUN gradle build --no-daemon --stacktrace

FROM openjdk:17-jdk-alpine

WORKDIR /app

COPY .env ./

# COPY build/libs/*.jar app.jar
COPY --from=build /app/build/libs/*.jar app.jar

RUN mkdir -p /root/.oci

ENV OCI_CONFIG_FILE=/root/.oci/config

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]