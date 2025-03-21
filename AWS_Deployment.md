# AWS Deployment Guide for MessageNode

This guide explains the steps required to containerize, build, and deploy the MessageNode application on AWS using ECR, CodeBuild, ECS (Fargate), and an Application Load Balancer.

## Step 1: VPC and Networking Configuration for Backend

1.  **VPC Setup:**
    - Create a new VPC with an appropriate CIDR block (e.g., `10.0.0.0/16`).
2.  **Subnets:**
    - Create two public subnets in different Availability Zones (AZs) for high availability.
    - Create two private subnets in the same AZs for deploying ECS tasks (backend). These subnets access the internet via a NAT Gateway.
3.  **Internet Gateway (IGW):**
    - Create a new IGW and attach it to the VPC. The ALB in the public subnets uses this to receive and respond to external traffic.
4.  **NAT Gateway:**
    - Create a NAT Gateway in one of the public subnets.
    - Reserve an Elastic IP (EIP) and associate it with the NAT Gateway (provides a static IP that can be whitelisted).
5.  **Route Tables:**
    - For public subnets: Ensure a route for `0.0.0.0/0` points to the Internet Gateway.
    - For private subnets: Ensure a route for `0.0.0.0/0` points to the NAT Gateway.
6.  **Security Groups:**
    - **ALB Security Group (ALB-SG):**
      - Allow inbound TCP traffic on ports 80 (HTTP) and 443 (HTTPS) from `0.0.0.0/0`.
    - **ECS Security Group (ECS-Backend-SG):**
      - Allow inbound traffic on port 8080 (backend) only from the ALB security group.

## Step 2: Application Load Balancer Setup

1.  **Create an Application Load Balancer (ALB):**
    - Select **Internet-facing** for the scheme.
2.  **Listeners Configuration:**
    - Configure listeners on ports 80 (HTTP) and 443 (HTTPS).
3.  **VPC and Subnets:**
    - Choose the VPC where your ALB and backend resources reside.
    - Select two public subnets in different Availability Zones.
4.  **Security Group:**
    - Attach the security group created earlier (ALB-SG).
5.  **Routing:**
    - Add listeners for ports 80 and 443, each associated with a target group.
6.  **Create a Target Group:**
    - Target type: **IP address** (choose "instance" for EC2 or "ip" for Fargate).
    - Specify a name (e.g., `messagenode-TargetGroup`).
    - Set the port to the backend listening port (e.g., `8080`) and protocol to **HTTP**.
7.  **SSL/TLS:**
    - Add a default SSL/TLS certificate from ACM (AWS Certificate Manager) using a pre-generated certificate.
8.  **Finish ALB Creation.**

## Step 3: Domain and SSL Setup

1.  **Domain Purchase:**
    - Buy a domain (e.g., `mywebsite.com`) from a registrar like GoDaddy.
2.  **DNS Configuration:**
    - Create a CNAME subdomain (e.g., `app.mywebsite.com`) pointing to the DNS name of the Application Load Balancer.
3.  **Certificate Management:**
    - In AWS Certificate Manager (ACM), request a certificate for `app.mywebsite.com`.
4.  **Update DNS:**
    - In your domain registrar (e.g., GoDaddy), add a CNAME DNS record as specified by ACM (remove the domain part for the record name if necessary).
5.  **Propagation:**
    - After DNS propagation, the certificate will be validated and active.

## Step 4: Containerize the Application

### Create a Dockerfile

In the root of the project, create a file named `Dockerfile` with the following content:

```dockerfile
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (use --production for production builds)
RUN npm install --production

# Copy the rest of your application code
COPY . .

# Expose the port your app listens on (e.g., 8080)
EXPOSE 8080

# Run your app (make sure your start script is set for production)
CMD [ "node", "src/app.js" ]
```

## Step 5: Create an ECR Repository

- Create a new repository named **messagenode** in AWS ECR.

---

## Step 6: Set Up a CodeBuild Project

### 1. Create a buildspec.yml File

In the root of the project, create a file named `buildspec.yml` with the following content:

```yml
version: 0.2

phases:

pre_build:

commands:

- echo Logging in to Amazon ECR...

- aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

- REPOSITORY_URI=$ECR_REGISTRY/$APP_NAME

- IMAGE_TAG=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)

build:

commands:

- echo Building the Docker image...

- docker build -t $REPOSITORY_URI:$IMAGE_TAG .

post_build:

commands:

- echo Pushing the Docker image...

- docker push $REPOSITORY_URI:$IMAGE_TAG

- echo Writing image definitions...

- printf '[{"name":"%s","imageUri":"%s"}]' $APP_NAME $REPOSITORY_URI:$IMAGE_TAG > imagedefinitions.json

artifacts:

files: imagedefinitions.json
```

### 2. Create a CodeBuild Project

- **Source Provider:** Choose GitHub and connect to your repository.
- **Additional Configuration:**
  - Enable **Privileged Mode** (required for running Docker commands).
  - **Buildspec:** Select “Use a buildspec file” and point to `buildspec.yml`.
- **Environment Variables:**
  - `AWS_REGION`: `us-east-1`
  - `ECR_REGISTRY`: _Your ECR registry URL (exclude the part after "/")_ (e.g., `153159662393.dkr.ecr.us-east-1.amazonaws.com`)
  - `APP_NAME`: `messagenode`
- Save the project.

### 3. Attach New Policy in IAM

1.  Navigate to **IAM → Roles**.
2.  Find and select the CodeBuild service role (e.g., `codebuild-messagenode-beta-codebuild-service-role`).
3.  Go to the **Permissions** tab and click **Attach policies**.
4.  Search for **AmazonEC2ContainerRegistryPowerUser** and attach it.

### 4. Test the Build

- Run the CodeBuild project.
- The resulting image should appear in your ECR repository.

---

## Step 7: Create an ECS Cluster, Task Definition, and Service

### a. Create an ECS Cluster

- Create a new ECS Cluster and select **Networking only (Fargate)**.

### b. Create a Task Definition

- **Container Details:**
  - Use the ECR image URL created earlier (the URL will be updated later by CodePipeline).  
    _Example:_ `153159662393.dkr.ecr.us-east-1.amazonaws.com/messagenode:abc123`
  - **Port Mappings:** Set the container port to the port that your backend listens on (e.g., `8080`).
  - **Environment Variables:**
    - Add the environment variables as defined in your backend `.env` file (do not include quotes).
  - **Health Check Settings:**
    - Set the path to `/health` (your app should respond with HTTP 200 for this route).

### c. Create an ECS Service

- In your ECS Cluster, create a new service:
  - **Compute Options:** Launch type.
  - **Launch Type:** Fargate.
  - **Application Type:** Service.
  - **Task Definition:** Select the task definition created earlier (e.g., `messagenode-task`).
  - **Service Name:** `messagenode-service`
  - **Desired Tasks:** 1
  - **Networking:**
    - Choose the pre-configured VPC and two private subnets.
    - Select the security group created earlier (e.g., `ECS-Backend-SG`).
    - Disable public IP assignment.
  - **Load Balancing:**
    - Enable load balancing.
    - Choose the previously created ALB.
    - Use the existing listener on port 443 (HTTPS) and the existing target group.
    - Set the evaluation order to 1.
