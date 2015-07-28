import csv
import json
import logging
import sys
from pprint import pprint

in_filename = sys.argv[1]
out_filename = sys.argv[2]

class State(object):
    id = ''
    institutions = []
    
    def __init__(self, id):
        self.id = id

# # Convert encoding of csv
# sourceEncoding = "iso-8859-1"
# targetEncoding = "utf-8"
# source = open(in_filename, 'rU')
# csvFile = open(out_filename, "w+")
# csvFile.write(unicode(source.read(), sourceEncoding).encode(targetEncoding))

csvFile = open(in_filename, 'rU')
jsonFile = open(out_filename, 'w')

fieldNames = ('a','b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag', 'ah', 'ai', 'aj', 'ak', 'al', 'am', 'an', 'ao', 'ap')

input = csv.DictReader( csvFile, fieldNames )


COL_INSTITUTION = 'a'
COL_CITY = 'b'
COL_STATE = 'c'
COL_COURSE_TITLE = 'd'
COL_PRODUCT = 'e'
COL_YEAR = 'k'
COL_RESULT = 'l'
COL_LINK = 'm'

items = []
states = {}
stateIds = []
itemCount = 0

for row in input:

    #logging.warning('input row ' + row[COL_PROJECT_LEAD])

    productName = row[COL_PRODUCT]

    # Omit blank rows and header rows
    if productName and productName != 'Product':

        item = dict()

        # We get the following from the CSV
        
            
        item['state']       = row[COL_STATE]
        item['institution'] = row[COL_INSTITUTION]
        item['city']        = row[COL_CITY]
        item['courseTitle'] = row[COL_COURSE_TITLE]
        item['product']     = row[COL_PRODUCT]
        item['year']        = row[COL_YEAR]
        item['result']      = row[COL_RESULT]
        item['link']        = row[COL_LINK]

        # Other fields

        item['id'] = itemCount
        item['enabled'] = 'true'

        itemCount = itemCount + 1
        items.append( item )
        
        stateId = item['state']
        if not stateId in stateIds:
            stateIds.append(stateId)
            states[stateId] = {'id':stateId, 'items': []}
            

# pprint(states)

for item in items:
     
    for key, state in states.items():
#         print('key: ' + key + '; state type: ' + type(state).__name__)
        if key == item['state']:
            state['items'].append(item)
        
#logging.warning( items )

jsonFile.write( json.dumps( states ) )
