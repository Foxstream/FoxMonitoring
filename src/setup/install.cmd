#echo off
SET INSTALL_FOLDER=C:\Foxstream\
SET MONITORING_FOLDER=%INSTALL_FOLDER%\FoxMonitoring

mkdir %INSTALL_FOLDER%
cd %INSTALL_FOLDER%

git clone https://github.com/Foxstream/FoxMonitoring.git

Schtasks /create /F /SC daily /TN UpdateFoxMonitoring /ST 12:00:00 /TR %MONITORING_FOLDER%\src\setup\update.cmd