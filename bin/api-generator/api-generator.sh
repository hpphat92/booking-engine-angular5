# Generate API services and models
rm --recursive -f ./src/app/shared/api
java -jar ./bin/api-generator/swagger-codegen-cli.jar generate -i http://localhost:55646/swagger/v1/swagger.json -l typescript-angular -o ./src/app/shared/api
