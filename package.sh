rm -f traccar-web.war
mkdir tmp/
mv war/WEB-INF/classes/org/traccar/web/client/ tmp/
mv war/WEB-INF/deploy/ tmp/
mv war/WEB-INF/lib/mysql-* tmp/
jar cv -C war/ . > traccar-web.war
mv tmp/mysql-* war/WEB-INF/lib/
mv tmp/deploy/ war/WEB-INF/
mv tmp/client/ war/WEB-INF/classes/org/traccar/web/
rm -r -f tmp/

