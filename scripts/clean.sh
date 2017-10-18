#########################################################
#
# Kills any development-related processes

if [ \
  "$(pgrep -af '/vagrant/node_modules/.bin/react-native' | cut -d" " -f1)" ]; then kill `pgrep -af '/vagrant/node_modules/.bin/react-native' \
  | \
  cut -d" " -f1`;\
fi