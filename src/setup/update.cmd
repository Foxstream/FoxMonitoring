#echo off
SET INSTALL_FOLDER=C:\Foxstream\
SET MONITORING_FOLDER=%INSTALL_FOLDER%\FoxMonitoring

cd %MONITORING_FOLDER%
git pull https://github.com/Foxstream/FoxMonitoring.git
npm install