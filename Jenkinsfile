pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 1, unit: 'HOURS')
        timestamps()
    }

    environment {
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
                        pwd
                        ls -la
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
                                if [ -d "insurance-backend" ]; then
                                    cd insurance-backend
                                    npm install
                                elif [ -d "server" ]; then
                                    cd server
                                    npm install
                                else
                                    echo "Backend directory not found"
                                    ls -la
                                    exit 1
                                fi
                            '''
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        script {
                            echo '========== Installing frontend dependencies =========='
                            sh '''
                                if [ -d "frontend" ]; then
                                    cd frontend
                                    npm install
                                elif [ -d "client" ]; then
                                    cd client
                                    npm install
                                else
                                    echo "Frontend directory not found"
                                    ls -la
                                    exit 1
                                fi
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
                                if [ -d "insurance-backend" ]; then
                                    cd insurance-backend
                                elif [ -d "server" ]; then
                                    cd server
                                fi
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
                                if [ -d "frontend" ]; then
                                    cd frontend
                                elif [ -d "client" ]; then
                                    cd client
                                fi
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
                                if [ -d "insurance-backend" ]; then
                                    cd insurance-backend
                                elif [ -d "server" ]; then
                                    cd server
                                fi
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
                                if [ -d "frontend" ]; then
                                    cd frontend
                                elif [ -d "client" ]; then
                                    cd client
                                fi
                                npm run test -- --coverage || true
                            '''
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo '========== Building Docker images =========='
                    sh '''
                        # Determine backend directory
                        if [ -d "insurance-backend" ]; then
                            BACKEND_DIR="insurance-backend"
                        else
                            BACKEND_DIR="server"
                        fi

                        # Determine frontend directory
                        if [ -d "frontend" ]; then
                            FRONTEND_DIR="frontend"
                        else
                            FRONTEND_DIR="client"
                        fi

                        echo "Building backend from: $BACKEND_DIR"
                        docker build -t wbsic-backend:${IMAGE_TAG} ./$BACKEND_DIR
                        docker build -t wbsic-backend:latest ./$BACKEND_DIR

                        echo "Building frontend from: $FRONTEND_DIR"
                        docker build -t wbsic-frontend:${IMAGE_TAG} ./$FRONTEND_DIR
                        docker build -t wbsic-frontend:latest ./$FRONTEND_DIR
                    '''
                }
            }
        }

        stage('Push to Registry') {
            when {
                expression {
                    return env.BRANCH_NAME == 'main' || env.GIT_BRANCH == 'origin/main'
                }
            }
            steps {
                script {
                    echo '========== Pushing images to Docker registry =========='
                    sh '''
                        # This requires Docker registry credentials configured in Jenkins
                        # docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
                        # docker push wbsic-backend:${IMAGE_TAG}
                        # docker push wbsic-frontend:${IMAGE_TAG}
                        echo "Skipping registry push - configure credentials in Jenkins"
                    '''
                }
            }
        }

        stage('Deploy to Development') {
            when {
                expression {
                    return env.BRANCH_NAME == 'develop' || env.GIT_BRANCH == 'origin/develop'
                }
            }
            steps {
                script {
                    echo '========== Deploying to development environment =========='
                    sh '''
                        echo "Deployment to development would happen here"
                        # kubectl set image deployment/wbsic-backend wbsic-backend=wbsic-backend:${IMAGE_TAG} -n development || true
                        # kubectl set image deployment/wbsic-frontend wbsic-frontend=wbsic-frontend:${IMAGE_TAG} -n development || true
                    '''
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                expression {
                    return env.BRANCH_NAME == 'staging' || env.GIT_BRANCH == 'origin/staging'
                }
            }
            steps {
                script {
                    echo '========== Deploying to staging environment =========='
                    sh '''
                        echo "Deployment to staging would happen here"
                        # kubectl set image deployment/wbsic-backend wbsic-backend=wbsic-backend:${IMAGE_TAG} -n staging || true
                        # kubectl set image deployment/wbsic-frontend wbsic-frontend=wbsic-frontend:${IMAGE_TAG} -n staging || true
                    '''
                }
            }
        }

        stage('Deploy to Production') {
            when {
                expression {
                    return env.BRANCH_NAME == 'main' || env.GIT_BRANCH == 'origin/main'
                }
            }
            input {
                message "Deploy to production?"
                ok "Deploy"
            }
            steps {
                script {
                    echo '========== Deploying to production environment =========='
                    sh '''
                        echo "Deployment to production would happen here"
                        # kubectl set image deployment/wbsic-backend wbsic-backend=wbsic-backend:${IMAGE_TAG} -n production || true
                        # kubectl set image deployment/wbsic-frontend wbsic-frontend=wbsic-frontend:${IMAGE_TAG} -n production || true
                        # kubectl rollout status deployment/wbsic-backend -n production || true
                        # kubectl rollout status deployment/wbsic-frontend -n production || true
                    '''
                }
            }
        }

        stage('Post-Deployment Tests') {
            steps {
                script {
                    echo '========== Running post-deployment tests =========='
                    sh '''
                        echo "Health checks would run here"
                        # curl -f http://localhost/health || exit 1
                    '''
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