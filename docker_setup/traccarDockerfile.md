# Create a custom docker image
To create our custom [docker image](custom_docker_image/Dockerfile), we have used default image of Traccar version 6.6 and then updated the web folder with a build from our own custom UI code.

## Create custom folder
- Create a folder structure containing 
```
    |-- data
    |-- logs
     -- Dockerfile
     -- traccar.xml
```

- Refer [this structure](custom_docker_image) 

## Configure traccar.xml file
- Database and OpenID connect configuration have been added in the [traccar.xml file](custom_docker_image/traccar.xml). 
- To test locally make use of the local h2 database.
- For OpenID connection, we have used AWS Cognito user pool *CCTV Users Development*. We have used the *VMS Development* App client for the connection.
- The *web.url* key is used to set the callback URL post completion of login.
- We also have to update the *Allowed callback URLs* in the Cognito Login Pages setup to include the hosted URL for the web app.

## Build docker image 
To build the custom docker image, open the folder in CLI and use the build command:
```
docker build --platform linux/amd64 -t fishtrack-dev .
```
## Test docker container locally
To run and test the image built locally, build the image by commenting out the Database and OpenID connection code and test using the local h2 database.
The traccar application should be running on ```localhost:8082```
```
docker run `
--name fishtrack-dev `
--hostname traccar `
--detach --restart unless-stopped `
--publish 80:8082 `
--publish 5000-5150:5000-5150 `
--publish 5000-5150:5000-5150/udp `
--volume C:/custom-docker-image/logs:/opt/traccar/logs:rw `
--volume C:/custom-docker-image/data:/opt/traccar/data:rw `
fishtrack-dev:latest
```

# Steps used to publish the repository to ECR

```
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 135407538921.dkr.ecr.us-east-1.amazonaws.com

docker build --platform linux/amd64 -t fishtrack-dev .

docker tag fishtrack-dev:latest 135407538921.dkr.ecr.us-east-1.amazonaws.com/fishtrack-dev:latest

docker push 135407538921.dkr.ecr.us-east-1.amazonaws.com/fishtrack-dev:latest
```

# Steps to deploy on ECS

## Task definition in ECS
- Create a new task definition - we have used *traccar-task-dev*
    - Select AWS Fargate as Launch Type 
    - In the container definition add image URI from ECR
    - Add TCP port mappings for 8082 and 5055
    - Create volumes for data and logs folders
    - Add bindings for source and container paths

## Create cluster in ECS
- Create cluster using AWS Fargate - we have used *traccar-dev-cluster*
- Create a service for the cluster 
    - Select the created task definition and revision
    - Under Networking choose VPC, Subnets and Security groups 
    - Select Add Load Balancing
        - Select existing load balancer and map the port 8082 in the container 
        - Use the existing listener using HTTPS protocol and port 443
        - To add a new domain create a new DNS entry in route 53 and route it to load balancer
        - Create a new target group 
- This automatically creates the task using the task definition created earlier
- Check if the task is running and check logs to verify if traccar is working as expected
