#MP3 Importer

This tool depends on ffmetadata.
https://www.npmjs.org/package/ffmetadata
- "The ffmpeg command-line tool (or the libav fork) must be installed."

http://www.libav.org/index.html

#CentOS
http://pkgs.org/centos-6/naulinux-school-i386/libavcodec52-0.7.10-50.el6.i686.rpm.html

http://wiki.razuna.com/display/ecp/FFMpeg+Installation+on+CentOS+and+RedHat

```
sudo yum install glibc gcc gcc-c++ autoconf automake libtool git make nasm pkgconfig SDL-devel a52dec a52dec-devel alsa-lib-devel faac faac-devel faad2 faad2-devel freetype-devel giflib gsm gsm-devel imlib2 imlib2-devel lame lame-devel libICE-devel libSM-devel libX11-devel libXau-devel libXdmcp-devel libXext-devel libXrandr-devel libXrender-devel libXt-devel libogg libvorbis vorbis-tools mesa-libGL-devel mesa-libGLU-devel xorg-x11-proto-devel zlib-devel libtheora theora-tools ncurses-devel libdc1394 libdc1394-devel amrnb-devel amrwb-devel opencore-amr-devel 


cd /opt
git clone git://source.ffmpeg.org/ffmpeg.git
cd ffmpeg
git checkout release/2.2
./configure --enable-version3 --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libvpx --enable-libfaac \
--enable-libmp3lame --enable-libtheora --enable-libvorbis --enable-libx264 --enable-libvo-aacenc --enable-libxvid --disable-ffplay \
--enable-shared --enable-gpl --enable-postproc --enable-nonfree --enable-avfilter --enable-pthreads --extra-cflags=-fPIC
make
make install
```

##import_all_mp3_to_elastic_search.js
  * change folders in the end of this file

```
fsHelper.addFolder('[MY_FOLDER]');
```

  * run:

```
node import_all_mp3_to_elastic_search.js
```

