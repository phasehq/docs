import { Tag } from '@/components/Tag'

export const description = 'Integrate Phase with Jenkins'

<Tag variant="small">INTEGRATE</Tag>

# Jenkins

You can use the Phase CLI retrieve secrets inside your Jenkins CI pipelines or jobs.

## Prerequisites

- Have signed up for the [Phase Console](https://console.phase.dev) and created an application
- `PHASE_SERVICE_TOKEN`

<Note>
  If you are using a Self-Hosted instance of the Phase Console, you may supply
  `PHASE_HOST` environment variable with your URL (`https://<HOST>`).
</Note>

### Step 1: Set the `PHASE_SERVICE_TOKEN`

1. Go to the Jenkins Dashboard
2. Click on **Manage Jenkins**
![Navigate to Jenkins management](/assets/images/platform-integrations/jenkins/step-1/1-nagivate-to-manage-jenkins.png)
3. Select **Credentials** under the **Security** section
![Select credentials](/assets/images/platform-integrations/jenkins/step-1/2-go-to-credentials-under-the-security-section.png)
4. Click on **(global)** dropdown under the 'Stores scoped to Jenkins' **Domain** section
![Click on global domains](/assets/images/platform-integrations/jenkins/step-1/3-stores-scoped-to-jenkins-click-global.png)
5. Click **+ Add Credentials**
![Click add credentials](/assets/images/platform-integrations/jenkins/step-1/4-click-add-credetials.png)
6. In the New credentials page's **Kind** dropdown, select **Secret text**
![Select secret text from dropdown](/assets/images/platform-integrations/jenkins/step-1/5-choose-secret-text-from-kind-dropdown.png)
7. Paste the `PHASE_SERVICE_TOKEN` in the **Secret** box, provide a suitable **ID** (to be referenced in our pipelines) along with a **Description**, and click **Create**
![](/assets/images/platform-integrations/jenkins/step-1/6-enter-cred.png)
8. Make a note of the secret **ID**
![](/assets/images/platform-integrations/jenkins/step-1/7-creadential-created.png)

### Step 2: Access secrets inside your pipelines using the `phasehq/cli` image:

Jenkins, with its Docker Pipeline plugin, supports multi-stage Docker pipelines. Here's an example where we are retrieving and consuming Docker Hub secrets:

<Note>
Please make sure to set a version tag for the `phasehq/cli` Docker image to avoid breaking changes. You can get the latest tags on [Docker Hub](https://hub.docker.com/r/phasehq/cli/tags).
</Note>

```groovy
pipeline {
    agent any
    stages {
        stage('Prepare') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'PHASE_SERVICE_TOKEN', variable: 'PHASE_SERVICE_TOKEN')]) {
                        // Set the credential ID for the phase service token ☝️ you set in step 1
                        docker.image('phasehq/cli:1.18.5').inside {
                            // Set the cli version ☝️
                            withCredentials([usernamePassword(credentialsId: 'docker-credentials', 
                                                           usernameVariable: 'DOCKERHUB_USERNAME', 
                                                           passwordVariable: 'DOCKERHUB_TOKEN')]) {
                                sh 'secrets export --app "my application name" --env prod DOCKERHUB_USERNAME DOCKERHUB_TOKEN'
                                // Export and directly store secrets in Jenkins credentials store ☝️
                            }
                        }
                    }
                }
            }
        }
        stage('Build and Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-credentials', 
                                                    usernameVariable: 'DOCKERHUB_USERNAME', 
                                                    passwordVariable: 'DOCKERHUB_TOKEN')]) {
                        sh '''
                            echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
                            docker build -t my-image .
                            docker push my-image:latest
                        '''
                    }
                }
            }
        }
    }
}
```

This method pulls the `phasehq/cli` Docker image, runs it to retrieve the secrets, and then stores those secrets in Jenkins credential store. These secrets are then accessible in subsequent stages.
