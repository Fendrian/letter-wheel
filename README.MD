# TARGET WORDS

## A word-hunting game programmed in React Native

Target Words is based on the popular newspaper game Target, and inspired by the long-abandoned Target app for Android by Ben Buxton. 

Original copyright © 2017 by Wolf Hatch.

## Development Environment

This project is based around a virtual development environment build upon Vagrant and VirtualBox. Where possible, everything needed for development is contained within the virtual machine. Software needed outside of the vm is:

- [Vagrant](https://www.vagrantup.com/)
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- [Android Studio](https://developer.android.com/studio/index.html)

An Android emulator (such as the one included with Android Studio) is recommended for development, but is not required - as long as [ADB](https://developer.android.com/studio/command-line/adb.html) is running on the host machine, development can be achieved with an android device attached to the computer via a USB debugging connection.

Additionally, Android Studio can be used as an IDE, but has no especial advantage in this. Another editor more suited to Javascript development such as [VSCode](https://code.visualstudio.com/) is advantageous.

## Inside the VM

This is a React-Native project, with Yarn being used for package and script management.

## LICENSING NOTICE

For the sake of convenience and conformance with general practice and standards, the Vagrantfile in this repository includes code which continues past a point in the Android SDK installation scripts where the developers intended the user to accept or reject the [Android SDK License Agreement](https://developer.android.com/studio/terms.html). Consequently, anyone running 'vagrant up', will be asserting their acceptance of said license agreement.
