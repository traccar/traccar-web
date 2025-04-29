FROM traccar/traccar:6.6-ubuntu

WORKDIR /opt/traccar

# Install tools needed to build the frontend
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    curl \
    nodejs \
    npm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Clone and build the custom web UI
RUN git clone https://github.com/Tech-Prescient/traccar-web-oceantrack.git /tmp/web-ui && \
    cd /tmp/web-ui && \
    npm install && \
    npm run build && \
    rm -rf /opt/traccar/web/* && \
    cp -r /tmp/web-ui/build/* /opt/traccar/web/ && \
    rm -rf /tmp/web-ui

COPY traccar.xml /opt/traccar/conf/traccar.xml

EXPOSE 8082

# Start the server
ENTRYPOINT ["java", "-Xms1g", "-Xmx1g", "-Djava.net.preferIPv4Stack=true"]
CMD ["-jar", "tracker-server.jar", "conf/traccar.xml"]