# Set up a Raspberry Pi

To perform this activity you will need a Raspberry Pi, a blank micro-SD card and a micro-SD card reader. Plug the SD card reader into your computer, insert the SD card into the reader and open and the site https://www.raspberrypi.com/software/ 
## Install the operating system
Download and install the Raspberry Pi imager from that site. We are going to use this put the operating system onto the card. Start the imaging software. It may ask you to confirm that you want to change the settings on your machine. Say yes. 
![Imaging software](images/01%20Imaging%20software.png)

 Now click the CHOOSE OS button to select the operating system you want to use. 
 
 ![Choose OS](images/02%20Choose%20OS.png)

Pick the top option. Now click CHOOSE STORAGE to select the SD card you want to write. 

 ![Choose storage](images/03%20Choose%20storage.png)

My system has two external drives. I must make sure that I’m using the correct one, in this case the 8.0 GB one. If you see more than one drive you should make sure you know which is the SD card. One way to do this is to remove the SD card, run the installer and note what drives are shown. Then exit the installer, plug the SD card in and run the installer again. The card that has appeared is the one you want to use.

Now that we have selected the source and destination we can configure the operating sys-tem that is about to be written. This is very useful, it means you can access and use the Pi as soon as it has booted. Click the gear wheel at the bottom right of the Installer window to open the Advanced options dialog.
 
![Configure advanced options](images/04%20Configure%20the%20Pi.png)

The first thing you must set is the hostname. This will allow you to find the pi on your local network when it starts running. Give your machine a name. I’ve called mine iotmaster. Make a note of this name. Set a username and password for the Pi. Make sure you make a note of these as well. Finally, you can enter your network WiFi credentials. This means that when the newly built Pi starts up it will automatically connect to your network. There are other options you can set but these are the most important. Click SAVE to save them. Now click WRITE to write the image. The installer will ask you to confirm the action and then begin writing the operating system onto the card. It will download the operating system if required. Once the SD card has been written you can insert it into your Raspberry Pi and power it up. Give it a few minutes to get started and then open a command prompt on your computer. 
 ## Connect to the Pi
The first thing we can do is make sure that the pi is connected to the network. We can use a command called ping to do this. Open a command prompt on your computer and type the command ping followed by the hostname with .local on the end:

![Ping the pi](images/05%20Ping%20the%20pi.png)

Above you can see the effect of pinging my newly created system. If it works you wil get four replies which will tell you the ip address of the device. Now that we have installed the operating system on the Raspberry Pi we can connect to it. 