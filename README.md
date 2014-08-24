# traccar-web

Web page - http://www.traccar.org

Authors: Anton Tananaev (anton.tananaev@gmail.com), Vitaly Litvak (vitavaque@gmail.com)

## Summary

Web interface for traccar server.

## Features

This project has following features, which don't exist in original `traccar-web` project:

* converted traccar-web to maven project to simplify builds
* following device
* printing device name
* recording device trace
* printing time stamps at device trace points (frequency is configured in Settings >> Preferences) both for archive and recorded trace
* translation to russian language (available via ?locale=ru URL parameters)
* translation to german language (available via ?locale=de URL parameter)
* show server log menu for viewing tracker-server.log file on Web
* speed filtering in archive view
* change default map center position, zoom (in Settings >> Preferences)
* replaced 'current state' panel with popups. They appear either when you hover a row in 'devices' table or when you hover a marker on map
* archive panel is collapsed by default. There is a button in upper right hand corner to expand it
* new 'managers' functionality: 
  * added new role to traccar - manager. Managers can add users and can manage access between devices of their users. So they have access to their devices and to devices of all managed users.
  * administrators have full access to everything. They can manage all devices, all users and access between devices and users
  * there is a new menu item called 'Share' to manage access to selected device
* improved performance of positions loading when DB grows up
* fixed issue when devices are not updated between different instances of web browser
* moved DB transaction management and user rights checks outside of data service implementation (AOP)
* possibility to detect 'offline' devices - when signal hasn't came for some time (set up in device settings). They will be shown on a map with a marker of different colour and there will be some sign in popup that they are actually offline.
* new device status - idle. It is shown in popup and also there will be a time of idling. Consider that vehicle is idle when it's speed is zero.


## Building

You can build it yourself easily without installing IDE (eclipse, idea, netbeans, etc.). The only requirement is installed Java Development Kit (JDK) v. 6 or greater:

1) Clone my repository

```
git clone https://github.com/vitalidze/traccar-web.git
```

2) Change to the cloned repo folder

```
cd traccar-web
```

3) Run build via maven wrapper

On Linux/Unix:

```
./mvnw package
```

On Windows:

```
mvnw package
```

Build can take several minutes. Once it completes the 'war' file will be under 'target' folder.

## Eclipse

Project can be set up in Eclipse.

#### Environment

Eclipse 4.3 with plugins:

  - m2e (a.k.a. Maven Integration for Eclipse (Juno and newer))
  - m2e-wtp (a.k.a. Maven Integration for Eclipse WTP (Juno))
  - google plugin for eclipse

#### Instructions

0) Clone repository:

    git clone https://github.com/vitalidze/traccar-web.git

1) Go to File >> Import project... Select Maven >> Existing Maven Projects and click 'Next'.
Then browse for a folder containing maven project. It should automatically find pom.xml file. Then click 'Next' to check maven goals or click finish.

2) In project's context menu select Google >> GWT Compile and unfold 'Advanced' section. Put '-war src/main/webapp' In 'Additional compiler arguments' section (this setting will is remembered for further compilations). Then hit 'Compile' button and wait until GWT compilation completes.

3) Run/Debug project. In project's context menu select Run as >> Web application.

#### Troubleshooting

* If you are getting "Main type not specified" then go to Run/Debug configuration settings (for example via Run >> Run Configurations... menu), select Web Application >> traccar.html and put `com.google.gwt.dev.DevMode` to the `Main class` field.

* If it complains about missing `src/test/java` folder then go to Project prefrences >> Java Build Path >> Source(tab) and remove `src/test/java` entry from source entries.

## IntelliJ IDEA

Project can be easily set up in IntelliJ IDEA ultimate.

1) Check out from version control, select ‘Git’, enter repository url and set up folder where you want to put project

![Check out](http://i57.tinypic.com/334t5bl.png)


2) Wait until it completes

![Wait until completes](http://i61.tinypic.com/2nks7me.png)

3) Confirm project opening

![Confirm project opening](http://i57.tinypic.com/wths0p.png)

4) Click ‘configure’ link at the green popup appeared at the upper right hand corner to configure detected frameworks:

![Click 'configure' link](http://i61.tinypic.com/dr5mw0.png)

5) Confirm default configuration of JPA:

![Confirm default JPA config](http://i59.tinypic.com/14wdafb.png)

6) Edit Launch configurations:

![Edit launch config](http://i62.tinypic.com/28vrcyf.png)


7) Add new GWT Configuration by clicking ‘+’ button

![Add GWT config](http://i58.tinypic.com/2w4fslk.png)

8) Set up parameters like on screen shot below:

![GWT config params](http://i59.tinypic.com/2wdmxpe.png)

9) Just run or debug this configuration, it will open web browser window with traccar-web application automatically

## License

Apache License, Version 2.0

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

