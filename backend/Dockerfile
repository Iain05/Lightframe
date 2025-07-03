FROM openjdk:17-jdk-alpine

WORKDIR /app

COPY .env ./

COPY build/libs/*.jar app.jar

RUN mkdir -p /root/.oci

ENV OCI_CONFIG_FILE=/root/.oci/config

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]