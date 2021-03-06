# LETTER WHEEL

[![Build Status](https://travis-ci.org/Fendrian/letter-wheel.svg?branch=master)](https://travis-ci.org/Fendrian/letter-wheel)
[![codecov](https://codecov.io/gh/Fendrian/letter-wheel/branch/master/graph/badge.svg)](https://codecov.io/gh/Fendrian/letter-wheel)
[![jest](https://facebook.github.io/jest/img/jest-badge.svg)](https://github.com/facebook/jest)

## A word-hunting game programmed in React Native

Letter Wheel is an implementation of the newspaper word-hunting game Word Wheel, and was inspired by the [Target app for Android by Ben Buxton](https://github.com/buxtronix/target), which had not been updated in years when this project was started.

Original copyright © 2017 by Wolf Hatch.

## Development Environment

This project is based around a virtual development environment build upon Vagrant and VirtualBox. Where possible, everything needed for development is contained within the virtual machine. Software needed outside of the vm is:

- [Vagrant](https://www.vagrantup.com/)
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- [Android Studio](https://developer.android.com/studio/index.html)

An Android emulator (such as the one included with Android Studio) is recommended for development, but is not required - as long as [ADB](https://developer.android.com/studio/command-line/adb.html) is running on the host machine, development can be achieved with an android device attached to the computer via a USB debugging connection. Installation and usage notes for Android Studio [can be found here](https://facebook.github.io/react-native/docs/getting-started.html).

Note that while Android Studio is required for development, it generally should not be _used_ for development. A project must be created to access the Android Virtual Device manager, but the project has no value or application other than allowing access to AVD. Android Studio can be used as an IDE, but has no especial advantage in this (and several disadvantages). Another editor more suited to Javascript development such as [VSCode](https://code.visualstudio.com/) is generally a better idea.

## Inside the VM

This is a React-Native project, with Yarn being used for package and script management.

Most port forwarding is done via the vagrantfile, but there's some reverse port forwarding required to get the Android environment working outside of the VM. As such, do not use `vagrant ssh` to start a console session - use `./ssh.sh` instead.

If there's a problem connectiong to port 5037, either the ssh reverse port forwarding isn't working right or an adb server isn't running on the host machine. The command to start an adb server is in the Android SDK location which is displayed in the Android Studio SDK manager. Generally on a mac this is `~/Library/Android/sdk/platform-tools/adb start-server`.

Note that when developing with an IDE or editor outside the VM (the usual way), filesystem events will not be forwarded to the VM by default. The recommended method for dealing with this [vagrant-fsnotify](https://github.com/adrienkohlbecker/vagrant-fsnotify), which can be installed (on the host machine) with `vagrant plugin install vagrant-fsnotify`, and then started with `vagrant fsnotify` once the VM is running (after `vagrant up` completes, in the same folder). This will forward filesystem events to the virtual machine.

## LICENSING NOTICES

For the sake of convenience and conformance with general practice and standards, the Vagrantfile in this repository includes code which continues past a point in the Android SDK installation scripts where the developers intended the user to accept or reject the [Android SDK License Agreement](https://developer.android.com/studio/terms.html). Consequently, anyone running 'vagrant up', will be asserting their acceptance of said license agreement.

For information on the source and licenses of the word list used in this project, consult the readme in `/dictionary`.

Fonts used in this project are [Grundschrift by Christian Urff](https://fontlibrary.org/en/font/grundschrift) under the [CC-BY 3.0 license](https://creativecommons.org/licenses/by/3.0/), [Sorts Mill Goudy by Barry Schwartz](https://github.com/theleagueof/sorts-mill-goudy) under the [SIL Open Font License](https://github.com/theleagueof/sorts-mill-goudy/blob/master/Open%20Font%20License.markdown), and [Ruji's Handwriting V2.0](https://fontlibrary.org/en/font/ruji-s-handwriting-font-v-2-0) under the [SIL Open Font License](http://scripts.sil.org/OFL).

Images in this project were created for the project and are covered by the overall project license unless otherwise noted.
The ink circles used for the yellow squares are from [Texture Fabrik](https://texturefabrik.com/)
