#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
@author: justin
This script automates interaction with websites, which is started as a process by the streambot program.
i.e. 
python3 autologin.py &

"""
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
driver=webdriver.Chrome()

# browse amq
link = "https://animemusicquiz.com/"
driver.get(link)
time.sleep(3)

# login
username = "*****"
pw = "*****"
# This is terrible practice... too bad!
usernameField = driver.find_element_by_id("loginUsername")
pwField = driver.find_element_by_id("loginPassword")

usernameField.send_keys(username)
pwField.send_keys(pw)

pwField.send_keys(Keys.ENTER)
time.sleep(5)

rankedBtn = driver.find_element_by_id("mpRankedButton")
classname = rankedBtn.get_attribute('class')

if "off" in classname:
    timer = driver.find_element_by_xpath("//div[@id='mpRankedTimer']/h4[1]")
    print(timer.text)
    driver.close()
    exit(1)
else:
    print('ok')
    rankedBtn.click()

# time.sleep(2)
# close web browser
# driver.close()
