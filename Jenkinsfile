pipeline {
    agent any
    
    environment {
        ZALO_APP_BACKEND_IMAGE_NAME = 'vincent181102/zalo-app-backend'
        IMAGE_TAG = 'v1.0'
    }
    stages {
        stage('Build') {
            steps {
                withDockerRegistry(credentialsId: 'dockerhub', url: 'https://index.docker.io/v1/') {
                    sh 'docker build -t $ZALO_APP_BACKEND_IMAGE_NAME:$IMAGE_TAG .'
                    sh 'docker push $ZALO_APP_BACKEND_IMAGE_NAME:$IMAGE_TAG'
                }
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker rm -f $(docker ps -a | grep -v "my-jenkins" | cut -d " " -f1) || true'
                sh 'docker compose up -d'
                sh 'docker rmi $(docker images -f "dangling=true" -q) || true'
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}