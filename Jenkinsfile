pipeline {

  agent any

  stages {
    stage('Build') {
      steps {
        sh 'docker build . -t 34cxn70m0o9cy1h/legacy-frontend'
      }
    }
    stage('Test') {
          steps {

          }
        }
    stage('Publish') {
      steps {
	    withDockerRegistry([ credentialsId: "2004efc3-4a15-46b2-b0dc-c2116d6870c1", url: "" ]) {
            sh 'docker push 34cxn70m0o9cy1h/legacy-frontend'
	    }
      }
    }
  }
}