java -cp ./:./Logging/target/classes:./InstrumentationPlugin/target/classes \
  --add-opens java.base/java.util=ALL-UNNAMED \
  --add-opens java.base/java.util.stream=ALL-UNNAMED \
  -agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=*:8800 \
 Exemple