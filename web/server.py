import os
import aiohttp, json
from aiohttp import web
import asyncio
import json
import subprocess
import time
from pymongo import MongoClient

import kubernetes.client

with open ('/var/run/secrets/kubernetes.io/serviceaccount/token') as f:
    k8s_token = f.read()

k8s_config = kubernetes.client.Configuration()
k8s_config.api_key['authorization'] = k8s_token
k8s_config.api_key_prefix['authorization'] = 'Bearer'
k8s_config.host='https://kubernetes.default.svc'
k8s_config.ssl_ca_cert='/var/run/secrets/kubernetes.io/serviceaccount/ca.crt'
v1Api= kubernetes.client.CoreV1Api(kubernetes.client.ApiClient(k8s_config))



DB_CSTRING = 'localhost:27017'
DB_NAME = 'tlsperf_db'
REALTIME_STATS = 'tlsperf_realtime_stats'

stats_ticks = 60

def localcmd(cmd_str, check_ouput=False):
    if check_ouput:
        return subprocess.check_output(cmd_str, shell=True, close_fds=True).decode("utf-8").strip()
    else:
        os.system(cmd_str)
        return None

async def index_handle(request):
    return web.FileResponse('public/index.html')

async def api_get_nodes(request):
    node_items = v1Api.list_node().items
    node_list= map(lambda n : {'Name' : n.metadata.name}, node_items)
    return web.json_response(list(node_list))

async def api_get_profiles(request):
    return web.json_response([{'Name': 'TlsClient-1'}, {'Name': 'TlsClient-2'}, {'Name': 'TlsClient-4'}])

async def api_get_stats(request):
    mongoClient = MongoClient(DB_CSTRING)
    db = mongoClient[DB_NAME]
    stats_col = db[REALTIME_STATS]
    appGId = request.match_info['appGId']
    gstats = stats_col.find_one ({'appGId' : appGId}, {'_id' : False})
    if not gstats:
        gstats = {}
    return web.json_response(gstats)

app = web.Application()

app.add_routes([web.static('/build', 'public/build')])
app.add_routes([web.static('/assets', 'public/assets')])

app.add_routes([web.route('get'
                            , '/api/nodes'
                            , api_get_nodes)])

app.add_routes([web.route('get'
                            , '/api/profiles'
                            , api_get_profiles)])

app.add_routes([web.route('get'
                            , '/api/stats/{appGId:.*}'
                            , api_get_stats)])

app.add_routes([web.route('get', '/{tail:.*}', index_handle)])

class StatsListener:
    def connection_made(self, transport):
        self.transport = transport

    def datagram_received(self, data, addr):
        message = data.decode()
        stats = json.loads(message)
        appId = stats['appId']
        appGId = stats['appGId']

        del stats['appId']
        del stats['appGId']

        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]
        stats_col = db[REALTIME_STATS]

        gstats = stats_col.find_one ({'appGId' : appGId})
        if not gstats:
            gstats = {'appGId' : appGId,
                        'stats' : {'sum' : [stats], appId : [stats]}}
            stats_col.insert_one(gstats)
        else:
            if not gstats['stats'].get(appId):
                gstats['stats'][appId] = [stats]
            else:
                gstats['stats'][appId].append(stats)
                if len(gstats['stats'][appId]) > stats_ticks:
                    gstats['stats'][appId].pop(0)

            del gstats['stats']['sum']
            sum_stats_list = []
            for i in range (stats_ticks):
                sum_stats = {}
                for app_id, app_stats_list in gstats['stats'].items():
                    if i < len(app_stats_list):
                        app_stats = app_stats_list[i]
                        for k in app_stats.keys():
                            if not sum_stats.get(k):
                                sum_stats[k] = app_stats[k]
                            else:
                                sum_stats[k] = sum_stats[k]+ app_stats[k]
                sum_stats_list.append(sum_stats)
            gstats['stats']['sum'] = sum_stats_list
            stats_col.find_one_and_replace({'appGId' : appGId}, gstats)


def main ():
    global stats_ticks

    localcmd("mongod --noauth --dbpath /data &")
    time.sleep(5)

    cfg_file = '/configs/config.json'
    with open(cfg_file) as f:
        cfg = json.loads(f.read())

    stats_ticks = cfg['stats_ticks']

    loop = asyncio.get_event_loop()
    runner = aiohttp.web.AppRunner(app)
    loop.run_until_complete(runner.setup())
    site = aiohttp.web.TCPSite(runner
                , host=cfg['webui_ip']
                , port=cfg['webui_port']
                , reuse_port=True)
    loop.run_until_complete(site.start())

    listen = loop.create_datagram_endpoint(StatsListener
                    , local_addr=(cfg['webui_ip']
                                    , cfg['stats_port'])
                    , reuse_port=True)

    loop.run_until_complete(listen)

    loop.run_forever()


if __name__ == '__main__':
    main()

