#!/bin/bash
set -e

red=`tput setaf 1`
green=`tput setaf 2`

action=$1

if [[ $action == '--init' ]]; then
  start () {
    pm2 start "yarn start" --name ytmate
  }

elif [[ $action == '--delete' ]]; then
  pm2 delete ytmate
  exit 1

else 
  start () {
    pm2 restart ytmate
  }
fi

FORMATTED_INPUT="${1,,}"

# hard deploy -> remove & install node_modules & soft deploy only install new

if [[ $FORMATTED_INPUT == '--hard' ]];
then
	echo -e "Deploy Type: HARD\nRemoving node_modules"
	rm -rf node_modules/
else
	echo "Deploy Type: SOFT"
fi

rm -rf ./.next

yarn 

yarn build

# sudo rm -rf /var/www/ytmate_backup/*

# sudo cp -rp /var/www/ytmate/* /var/www/ytmate_backup

sudo rm -rf /var/www/ytmate/*

sudo cp -rp ./.next/* /var/www/ytmate

ls -lt /var/www/ytmate

start

sudo nginx -t

sudo systemctl restart nginx

echo "${red} Previous backup is at ytmate_backup"

echo "${green} Deployed ytmate app & restarted nginx"
