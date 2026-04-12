FROM gradle:8.10-jdk17 AS build

WORKDIR /app
COPY . .

RUN gradle build --no-daemon --stacktrace

FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY .env ./

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]