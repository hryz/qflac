# QNAP FLAC player

When I bought a QNAP NAS I was very enthusiastic about its applications that provide access to your files from any place in the worlds. One of such applications is __Music Station__. This app claims to be web based player for your collection of music. After a few days of usage I was super disappointed of it. The user interface is super inconvenient, it's slow, it can't play a folder. The most serious issue of this app is that it transcodes original track and the quality decreases significantly. If you have a decent DAC and headphones you will hear the difference.  

At some point of time I decided that enough is enough. I need only very specific set of features. I don't need a fancy UI (Foobar2000-ish is OK). I need my FLAC music _as is_ right in the browser.  

Thankfully, I found an old but still working lib [FLAC.js](https://github.com/audiocogs/flac.js/) and a player that can work with it [Aurora.js](https://github.com/audiocogs/aurora.js/). This library is a JS port of FFMpeg decoder of FLAC.  

Next, I reverse-engineered the QNAP _File-station_ app to get my files in the original quality. QNAP have an option to host you static/PHP sites. This was a perfect opportunity, at least I thought so. It turned out that QNAP uses 2 instances of Apache web server: 1 for system applications, 1 for user sites. Obviously, because of CORS you can not do AJAX requests between them. My adventures continued. I SSH-ed to the NAS and reverse engineered the config location and modified them to allow CORS. To my disappointment, after every reboot of NAS the configs were restored. Modification of templates for configs did nothing.  

At that point I decided to throw away the _File-staten_ and write my own super minimal backend in PHP. Even though I hate PHP, I didn't want to install another backend language because of limited resources of the device.  

I created a symbolic link of my music collection so that it is kinda in the folder of my site. Also, I wrote 20 lines of PHP that recursively search the music folder and reply with a tree in JSON.  

The user interface was created **over night** using `React` and `Typescript`.
The result is the following:  

![Alt text](readme_images/player.jpg?raw=true "UI")