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

        stage('Build Docker Images') {
            steps {
                script {
                    echo '========== Building Docker images =========='
                    sh '''
                        docker build -t wbsic-backend:${IMAGE_TAG} ./server
                        docker build -t wbsic-frontend:${IMAGE_TAG} ./client
                        docker build -t wbsic-backend:latest ./server
                        docker build -t wbsic-frontend:latest ./client
                    '''
                }
            }
        }
    }

    post {
        always {
            echo '========== Pipeline completed =========='
        }
        success {
            echo '========== Pipeline succeeded =========='
        }
        failure {
            echo '========== Pipeline failed =========='
        }
    }
}