# Match 3 War
### Setup the game project
The game was developed using Game Closure devkit. The main project is inside match3war folder. Simply "cd" to the match3war folder and type "devkit install" as usual.

The game will run normally on simulator like other GC devkit project.

### Android
At the root of this repo, you can find match3war-release.apk, which can be installed and run on supported Android devices.

### Features
1. The usual yet-another-gem swap game with a taste of war.
2. The goal of the game is to crush enemy's base by recruiting soldiers that will march toward the enemy's line.
3. Player matches as many gems as possible to earn coins and mana.
3. With coins, soldiers are automatically recruited to attack enemies.
4. Mana is currently not usuable yet.
5. Similar to Popcap's Bejeweled, gem swapping is fluid and seamless (almost no pause between player's actions).
6. The game engine provides hints to player.
7. If no moves available, all gems will be exploded.
8. The magic gem can match any other colors.
9. Each level has different gems board size and difficulty. Enjoy!

### Notes on artworks
Most artworks are already provided by Weeby, but as my game needs more, I had to Google them. The artwork of soldiers are from Heroes of Might & Magic 2, which is not legal, but for a private test project, I hope for your tolerance.

All other artworks are licensed to be free for sharing.

### Programmer reflection

##### No coding IDE?
Without a specialized Code Editor, it could be quite a challenge to program bigger games. While using Intel XDK that already supports Phaser or Pixi SJ is very convenient and fast to develop with, it is a challenge to get GC Devkit works with any popular HTML5 Code Editor. I am currently using Brackets to code, but only benefit from the syntax highlights and very basic coding aids. It would be nice to have an IDE fully working with GC Devkit.

##### Multiple screen resolutions
Solving multiple screen resolutions with GC is quite easy for simple problems, but can be a burden without more tools.

Basic layout components should be available for this. 

##### Great Spriter!
When working with sprites, I normally used applications like Texture Packer or in-house tools to generate sprite atlases. The workflow is good enough but Spriter is even better. I do not have to keep original images along-side with sprite sheet in project repositories anymore.

Spriter is similar to Unity 3D's sprite packer, but is more controllable.

##### ViewPool
ViewPool gives a stroong boost to GC performance.

I am not sure if I am using older version of GC devkit or I did something wrong, but at the moment, I could not use onUpdate or onObtain event. I did not spend time to investigate this matter in order to save time for further development of this demo.

I would try to fix this problem.

##### Some time wasted just to wait for recompile
Every time modifying source code, I had to wait for GC server to reload the project to see the change on the simulator.

Reloading time is hard to improve, but while this is a real weakness compared to some other HTML5 solutions like Intel XDK with Pixi JS, something should be done to fix this issue.

If GC has a dedicated IDE, some methods like realtime compiling and putting whole projects into RAM will absolutely help.

##### Good debugger
The debugger is good and easy to understand. I did not even read the documentation of debugger and still I could use it straight away.

##### No support for image sequences animation?
I wanted to do something like this:
animate(this).now({image: '1.png'}).then({image: '2.png'}).then({image: '3.png');

But I did not succeed, and I could not find something similar anywhere in the documentation of GC.

##### ui.ScoreView should have tinting
And outline and background color too.

##### SpriteView
Using SpriteView is very convenient, and its performance on browser is amazingly fast too.

However, SpriteView is still missing some flexibility, and here are my suggestions:

1. After playing a non-loop animation, it automatically goes back to the default. There should be some options to prevent this.
2. The callback option of startAnimation should have the paramater frame Index instead of just being called at final frame. Emitting frame messages can solve this, but it might be slower then callback.
3. Each animation frame should have the option to delay longer than others. If SpriteView has the option to specify which frame is which image, this is absolutely achievable.
4. I could not find a way to alter the sheet url for a SpriteView obtained from a ViewPool. A method for this task should be available.

##### Building on Android
I failed instantly when trying for the first time. And after these steps, I finally got it working:

1. Install Android NDK, set the PATH to ndk-build in /etc/environment
2. Also set the path to Android SDK.
3. Install Android platform-19 SDK.
4. Run preinstall.sh script in Android plugin in modules/devkit-core/modules/native-android
5. I installed Node JS modules: bluebird, chalk
6. I installed node by: apt-get install node
7. I made the missing symlink inside Tealeaf/jni: ln -s ../../native-core core
8. I remove checkSymlinks in Makefile of native-android module, so that I can run "make setup" there.

Still I could not build on Android...

9. So, I decided to go through the tutorial nicely, taking Whack-a-mole as reference, I setup the manifest.json file correctly.
10. At this point, I managed to get through most errors, but still something wrong with build.js.
11. I removed the command that bugs build.js, which is actually generating the important strings.xml file.
12. By ignoring the strings.xml construction, ant could not build the generated Android project.
13. I made up the strings.xml manually, and finally I got the apk file working on my Sony phone
