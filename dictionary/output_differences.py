"""

This is a utility script to output an alphabetised line-by-line
difference comparison of two files.

"""

#!/usr/bin/env python

import re

FILE_1 = 'output.txt'
FILE_2 = 'YAWL.list'

OUTPUT = {}

with open(FILE_1, 'r') as f:
    for line in f:
        WORD = line.strip().lower().split('/')[0].split(' ')[0]
        if len(WORD) <= 9 and len(re.findall('^[a-zA-Z]*$', WORD)) == 1:
            OUTPUT[WORD] = 1

with open(FILE_2, 'r') as f:
    for line in f:
        WORD = line.strip().lower().split('/')[0].split(' ')[0]
        if len(WORD) <= 9 and len(re.findall('^[a-zA-Z]*$', WORD)) == 1:
            if WORD not in OUTPUT:
                OUTPUT[WORD] = 1
            else:
                OUTPUT[WORD] += 1

SORTED_OUT = sorted([word for word, count in OUTPUT.items() if count == 1])

with open("difference.txt", "wb") as output_file:
    output_file.writelines("\n".join(SORTED_OUT))
