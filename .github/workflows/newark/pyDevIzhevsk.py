# I will never have A10s, should I get contacts or just ropemaxx?
# It may be over.

import os, shutil, time
from datetime import datetime

current_date = datetime.now()
date_mmddYY = current_date.strftime('%m-%d-%Y')
date_mmdd = current_date.strftime('%m.%d')
unixTime = int(time.time())
try:
    version = os.getenv('rVersion')
except Exception as e:
    print('error in getting env var, probably development build so doesnt matter.')
    print(e)

devHeader = f"""/* ==UserStyle==
@name           ROBLOX 2016 dev{date_mmddYY}
@namespace      Userstyle
@author         anthony1x6000
@description    Userstyle that changes the look of ROBLOX to be more faithful to what it would look like in 2016.
@version        {date_mmdd}.{unixTime}
@license        MIT License
@var select profileVis 'Hide profile in nav bar?' ['block:Visible', 'none:Hidden']
==/UserStyle== */
"""

releaseHeader = f"""/* ==UserStyle==
@name           ROBLOX 2016 dev{date_mmddYY}
@namespace      Userstyle
@author         anthony1x6000
@description    Userstyle that changes the look of ROBLOX to be more faithful to what it would look like in 2016.
@version        {date_mmdd}.{unixTime}
@license        MIT License
@var select profileVis 'Hide profile in nav bar?' ['block:Visible', 'none:Hidden']
==/UserStyle== */
"""

def concat(style, newUSS):
    with open(style, 'r') as f2, open(newUSS, 'w') as uss:
        uss.write(devHeader)
        uss.write(f2.read())

repRoot = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
flowRoot = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))

devFName = f'roblox2016-pre{date_mmdd}.user.css'
releaseFName = 'release.user.css'

mainDev = os.path.join(repRoot, 'stylustheme.css')
devStyle = os.path.join(repRoot, devFName)
releaseStyle = os.path.join(repRoot, releaseFName)

if not version:
    print("Running as dev build")

    concat(mainDev, devStyle)

    if os.path.exists(f'{repRoot}/devDownloads/{devFName}'):
        os.remove(f'')
    shutil.move(devStyle, f'{repRoot}/devDownloads/')
    