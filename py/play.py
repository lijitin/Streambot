#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
driver=webdriver.Chrome()

link = "https://www.youtube.com/watch?v=93Hb-_GWi4k"
driver.get(link)

time.sleep(240)
# close web browser
driver.close()
