"""

This is a conversion script primarily intended to filter the YAWL
list with words from other word lists.abs

This is intended to keep only Scrabble-legal words (no proper nouns)
while filtering out some of the more esoteric and/or archaic words.

"""

#!/usr/bin/env python

import re

CHECK_LIST = {}

DICT_LISTS = [
    ['OpenSubtitle FrequencyWords from hermitdave.txt'],
    ['Moby Words 2 single word list.txt'],
    ['Moby_Words_2_crosswords.txt'],
    [
        'LibreOffice spellcheck words/en_AU.dic',
        'LibreOffice spellcheck words/en_CA.dic',
        'LibreOffice spellcheck words/en_GB.dic',
        'LibreOffice spellcheck words/en_US.dic',
        'LibreOffice spellcheck words/en_ZA.dic'
    ],
    ['ENABLE - Enhanced North American Benchmark Lexicon.txt'],
    ['YAWL.list'],
]

# Keep only words which appearear in this many dictionaries
THRESHOLD = 3

# Main loop
for dict_group in DICT_LISTS:
    for dictionary in dict_group:
        COMBINED = []
        with open(dictionary, 'r') as f:
            for line in f:
                WORD = line.strip().lower().split('/')[0].split(' ')[0]
                if len(WORD) <= 9 and len(re.findall('^[a-zA-Z]*$', WORD)) == 1:
                    COMBINED.append(WORD)
        for word in COMBINED:
            if word not in CHECK_LIST:
                CHECK_LIST[word] = 1
            else:
                CHECK_LIST[word] += 1


# Filter the output based on threshold
OUTPUT = [word for word, count in CHECK_LIST.items() if count >= THRESHOLD]

# Post-filter the output - keep only words that appear in the last dictionary
# (This allows dictionaries that contain proper nouns to be used as a filter)
LAST_DICT = {}
for dictionary in DICT_LISTS[-1]:
    with open(dictionary, 'r') as f:
        for line in f:
            LAST_DICT[line.strip().lower().split('/')[0].split(' ')[0]] = True
OUTPUT = [word for word in OUTPUT if word in LAST_DICT]

# Save the output
with open("output.txt", "wb") as output_file:
    output_file.writelines("\n".join(sorted(OUTPUT)))
