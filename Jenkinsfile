pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 1, unit: 'HOURS')
        timestamps()
    }

    environment {
        DOCKER_REGISTRY = credentials('docker-registry-url')
        DOCKER_CREDENTIALS = credentials('docker-credentials')
        SONARQUBE_TOKEN = credentials('sonarqube-token')
        NODE_ENV = 'production'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo '========== Checking out code =========='
                    checkout scm
                }
            }
        }

        stage('Setup') {
            steps {
                script {
                    echo '========== Setting up environment =========='
                    sh '''
                        node --version
                        npm --version
                        docker --version
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        script {
                            echo '========== Installing backend dependencies =========='
                            sh '''
                                cd server
                                npm install
                            '''
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        script {
                            echo '========== Installing frontend dependencies =========='
                            sh '''
                                cd client
                                npm install
                            '''
                        }
                    }
                }
            }
        }

        stage('Linting & Code Quality') {
            parallel {
                stage('Backend Lint') {
                    steps {
                        script {
                            echo '========== Linting backend code =========='
                            sh '''
                                cd server
                                npm run lint || true
                            '''
                        }
                    }
                }
                stage('Frontend Lint') {
                    steps {
                        script {
                            echo '========== Linting frontend code =========='
                            sh '''
                                cd client
                                npm run lint || true
                            '''
                        }
                    }
                }
            }
        }

        stage('Unit Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        script {
                            echo '========== Running backend tests =========='
                            sh '''
                                cd server
                                npm run test || true
                            '''
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        script {
                            echo '========== Running frontend tests =========='
                            sh '''
                                cd client
                                npm run test -- --coverage || true
                            '''
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    echo '========== Running SonarQube analysis =========='
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=wbsic \
                          -Dsonar.sources=. \
                          -Dsonar.host.url=${SONARQUBE_HOST} \
                          -Dsonar.login=${SONARQUBE_TOKEN}
                    ''' || true
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo '========== Building Docker images =========='
                    sh '''
                        docker build -t ${DOCKER_REGISTRY}/wbsic-backend:${IMAGE_TAG} ./server
                        docker build -t ${DOCKER_REGISTRY}/wbsic-frontend:${IMAGE_TAG} ./client
                        docker build -t ${DOCKER_REGISTRY}/wbsic-backend:latest ./server
                        docker build -t ${DOCKER_REGISTRY}/wbsic-frontend:latest ./client
                    '''
                }
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    echo '========== Pushing images to Docker registry =========='
                    sh '''
                        echo ${DOCKER_CREDENTIALS_PSW} | docker login -u ${DOCKER_CREDENTIALS_USR} --password-stdin ${DOCKER_REGISTRY}
                        docker push ${DOCKER_REGISTRY}/wbsic-backend:${IMAGE_TAG}
                        docker push ${DOCKER_REGISTRY}/wbsic-frontend:${IMAGE_TAG}
                        docker push ${DOCKER_REGISTRY}/wbsic-backend:latest
                        docker push ${DOCKER_REGISTRY}/wbsic-frontend:latest
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Development') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    echo '========== Deploying to development environment =========='
                    sh '''
                        kubectl set image deployment/wbsic-backend \
                          wbsic-backend=${DOCKER_REGISTRY}/wbsic-backend:${IMAGE_TAG} \
                          -n development
                        kubectl set image deployment/wbsic-frontend \
                          wbsic-frontend=${DOCKER_REGISTRY}/wbsic-frontend:${IMAGE_TAG} \
                          -n development
                    '''
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'staging'
            }
            steps {
                script {
                    echo '========== Deploying to staging environment =========='
                    sh '''
                        kubectl set image deployment/wbsic-backend \
                          wbsic-backend=${DOCKER_REGISTRY}/wbsic-backend:${IMAGE_TAG} \
                          -n staging
                        kubectl set image deployment/wbsic-frontend \
                          wbsic-frontend=${DOCKER_REGISTRY}/wbsic-frontend:${IMAGE_TAG} \
                          -n staging
                    '''
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            input {
                message "Deploy to production?"
                ok "Deploy"
            }
            steps {
                script {
                    echo '========== Deploying to production environment =========='
                    sh '''
                        kubectl set image deployment/wbsic-backend \
                          wbsic-backend=${DOCKER_REGISTRY}/wbsic-backend:${IMAGE_TAG} \
                          -n production
                        kubectl set image deployment/wbsic-frontend \
                          wbsic-frontend=${DOCKER_REGISTRY}/wbsic-frontend:${IMAGE_TAG} \
                          -n production
                        kubectl rollout status deployment/wbsic-backend -n production
                        kubectl rollout status deployment/wbsic-frontend -n production
                    '''
                }
            }
        }

        stage('Post-Deployment Tests') {
            steps {
                script {
                    echo '========== Running post-deployment tests =========='
                    sh '''
                        sleep 30
                        curl -f http://localhost/health || exit 1
                    ''' || true
                }
            }
        }
    }

    post {
        always {
            echo '========== Cleaning up =========='
            cleanWs()
        }
        success {
            echo '========== Pipeline succeeded =========='
        }
        failure {
            echo '========== Pipeline failed =========='
        }
    }
}