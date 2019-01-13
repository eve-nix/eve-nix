'''
    Chris Clifford
    1/2019

    populate.py
        used to populate database
        1. delete old new database - prod
        2. make new database - prod
        3. populate database with orders
        4. delete old database - eve-nix
        5. rename new database - prod -> eve-nix
'''

from pymongo import MongoClient
import requests
import sys
import time

start = time.time()

regions_URI = 'https://esi.evetech.net/latest/universe/regions/?datasource=tranquility'
mongo_URI = 'mongodb://localhost:27017'

client = MongoClient( mongo_URI )

''' 1. delete old prod db '''
client.drop_database( 'prod' )

''' 2. make new prod database '''
prod_db = client['prod']

prod_orders = prod_db.orders

regions_dict = {}

request = requests.get( regions_URI )
assert request.status_code == 200
regions = request.json()

''' 3. populate prod with orders '''
for region_id in regions:

    start_region = time.time()
    order_count = 0

    region_orders_URI = 'https://esi.evetech.net/latest/markets/' + str( region_id ) + '/orders/?datasource=tranquility&order_type=all&page='

    page_count = int( requests.get( region_orders_URI ).headers['X-Pages'] )
    print( '-----' + str( region_id ) + ': ' + str( page_count ) + ' pages -----' )

    perc = page_count // 4
    percs = [ perc, perc*2, perc*3 ]

    for page in range( 1, page_count+1 ):

        if ( page in percs ):
            print( "{0:.0f}%".format( 100*page/page_count ) )

        try:
            orders = requests.get( region_orders_URI + str( page ) ).json()

            if ( len( orders ) != 0 ):
                prod_orders.insert_many( orders )

            order_count += len( orders )
        except json.decoder.JSONDecodeError:
            print( 'Decoding JSON has failed.' )

    end_region = time.time()

    print( '' )
    print( 'execution time for region: {0:0.2f} seconds'.format( end_region - start_region ) )
    if ( order_count != 0 ):
        print( 'time per order: {0:0.2f} milliseconds'.format( 1000 * ( end_region - start_region ) / order_count ) ) 
    print( '' )

''' 4. delete old db '''
client.drop_database( 'eve-nix' )

''' 5. replace old db '''
client.admin.command( 'copydb', fromdb='prod', todb='eve-nix' )

''' remove old db '''
client.drop_database( 'prod' )

end = time.time()
print( "execution time: {0:0.2f} seconds".format( end - start ) )
