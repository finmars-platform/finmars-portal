pipeline {

  agent any

  stages {
    stage('Build') {
      steps {
        echo "Running ${env.BUILD_ID} on ${env.JENKINS_URL}"
        echo "Branch ${GIT_BRANCH}"
        echo "Branch ${ENV}"
        sh 'docker build . -t 34cxn70m0o9cy1h/legacy-frontend'
      }
    }
    stage('Publish') {
      steps {
	    withDockerRegistry([ credentialsId: "3ba5937e-6ef6-4909-8bac-d4df4ce67869", url: "" ]) {
            sh 'docker push 34cxn70m0o9cy1h/legacy-frontend:${ENV}'
	    }
      }
    }
  }
}