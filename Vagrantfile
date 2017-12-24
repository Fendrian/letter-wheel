# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = "bento/ubuntu-16.04"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  config.vm.network "forwarded_port", guest: 22, host: 2963, id: "ssh"
  config.vm.network "forwarded_port", guest: 8081, host: 8081

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"
  config.vm.synced_folder ".", "/vagrant", fsnotify: true,
    exclude: [
        "node_modules",
        ".tmp",
        ".history",
    ]

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
    vb.memory = "2048"
  end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Define a Vagrant Push strategy for pushing to Atlas. Other push strategies
  # such as FTP and Heroku are also available. See the documentation at
  # https://docs.vagrantup.com/v2/push/atlas.html for more information.
  # config.push.define "atlas" do |push|
  #   push.app = "YOUR_ATLAS_USERNAME/YOUR_APPLICATION_NAME"
  # end

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  config.vm.provision "shell", inline: <<-SHELL
	curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
	echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
    add-apt-repository ppa:openjdk-r/ppa
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - 
    sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
	curl -sL https://deb.nodesource.com/setup_8.x | -E bash -

	apt-get install -y nodejs yarn unzip
    apt-get install -y git openjdk-8-jdk ant expect lib32stdc++6 lib32z1 xterm automake autoconf python-dev libtool pkg-config google-chrome-stable
	
	# Install Android SDK
    wget --progress=bar:force https://dl.google.com/android/repository/sdk-tools-linux-3859397.zip
	mkdir android_sdk
    unzip sdk-tools-linux-3859397.zip -d ./android_sdk
	yes | /home/vagrant/android_sdk/tools/bin/sdkmanager tools --verbose
	/home/vagrant/android_sdk/tools/bin/sdkmanager "add-ons;addon-google_apis-google-23" "build-tools;23.0.1" "build-tools;23.0.2" "build-tools;23.0.3" "platforms;android-23" "sources;android-23" --verbose
    chown -R vagrant /home/vagrant/android_sdk/
	
    # Install watchman
	git clone https://github.com/facebook/watchman.git
	cd watchman
	git checkout v4.9.0
	./autogen.sh
	./configure
	make
	make install
	
    # Enable the gradle daemon for root
    mkdir ~/.gradle
    touch ~/.gradle/gradle.properties && echo "org.gradle.daemon=true" >> ~/.gradle/gradle.properties
		
	echo "export ANDROID_HOME=~/android_sdk" >> /home/vagrant/.bashrc
    echo "export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/" >> /home/vagrant/.bashrc
    echo "export PATH=\$PATH:~/android_sdk/tools/bin:~/android_sdk/platform-tools:/vagrant/node_modules/.bin" >> /home/vagrant/.bashrc
	echo "cd /vagrant/" >> /etc/bash.bashrc
	chown -R vagrant /vagrant
	
  SHELL
  
end
