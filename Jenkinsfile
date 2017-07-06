node ('traccar') {
   stage('Preparation') { // for display purposes
      git 'https://github.com/rodrigocastrillon/traccar-web.git'
   }
   stage('Deploy') {
      sh "mkdir -p /opt/traccar/web"
      sh "rm -Rf /opt/traccar/web/*"
      sh "cp -R web/* /opt/traccar/web"
   }
}
