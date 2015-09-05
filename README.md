# Match 3 War
### Running the game

### My game design

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
