import os
import aiohttp, json
from aiohttp import web
import asyncio
import json
import subprocess
import time
from pymongo import MongoClient
import yaml

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
NODE_GROUPS= 'tlsperf_node_groups'
NODE_LISTS= 'tlsperf_node_list'
PROFILE_GROUPS= 'tlsperf_profile_groups'
PROFILE_LISTS= 'tlsperf_profile_list'

stats_ticks = 60

tlsclient_config_map_template = {
    'apiVersion': 'v1', 
    'kind': 'ConfigMap', 
    'metadata': {'name': '--tbd--'}, 
    'data': {'config.json': '--tbd--'}
}

tlsclient_config_json_template = {
    'app_id': 'client-001', 
    'app_gid': 'tlsclient', 
    'server_ip': '12.20.61.1', 
    'server_port': 443, 
    'server_ssl': 1, 
    'stats_ip': '172.31.27.11', 
    'stats_port': 30008, 
    'send_recv_len': 1, 
    'cps': 750, 
    'total_conn_count': 0, 
    'max_active_conn_count': 25
}

tlsclient_pod_template = {
    'apiVersion': 'v1', 
    'kind': 'Pod', 
    'metadata': {'name': 'client-001', 
                 'annotations': { 'k8s.v1.cni.cncf.io/networks': '[ { "name": "eth0", "ips": [ "12.20.51.1/16", "12.20.51.2/16", "12.20.51.3/16", "100.20.51.1/16", "100.20.51.2/16", "100.20.51.3/16"] }]'
                }
    }, 
    'spec': {'containers': [{'name': 'client-001', 'image': 'tlspack/tlsperf:latest', 'imagePullPolicy': 'Always', 'command': ['tlsclient.exe'], 'args': [], 'env': [{'name': 'MY_POD_IP', 'valueFrom': {'fieldRef': {'fieldPath': 'status.podIP'}}}], 'volumeMounts': [{'name': 'config-volume', 'mountPath': '/configs/'}]}], 'volumes': [{'name': 'config-volume', 'configMap': {'name': 'client-001'}}], 'nodeSelector': {'tgid': 'kube-node1'}}}

def start_tlsserver_tlsclient(prof_j):

    clients = []
    servers = []

    for csg in prof_j['CsGroups']:
        pass


def localcmd(cmd_str, check_ouput=False):
    if check_ouput:
        return subprocess.check_output(cmd_str, shell=True, close_fds=True).decode("utf-8").strip()
    else:
        os.system(cmd_str)
        return None

async def index_handle(request):
    return web.FileResponse('public/index.html')

async def api_get_nodes(request):
    # node_group = request.query['nodegroup']
    mongoClient = MongoClient(DB_CSTRING)
    db = mongoClient[DB_NAME]
    node_col = db[NODE_LISTS]
    nodes = node_col.find({}, {'_id' : False})
    if not nodes:
        return []
    return web.json_response(list(nodes))
    # node_items = v1Api.list_node().items
    # node_list= map(lambda n : {'Name' : n.metadata.name}, node_items)
    # return web.json_response(list(node_list))

async def api_add_node(request):
    try:
        r_text = await request.text()
        r_json = json.loads(r_text)

        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]
        node_col = db[NODE_LISTS]
        node_col.insert_one(r_json) 
        return web.json_response({'status' : 0})
    except:
        return web.json_response({'status' : -1, 'message': 'tbd'})

async def api_get_node_groups(request):
    mongoClient = MongoClient(DB_CSTRING)
    db = mongoClient[DB_NAME]
    node_group_col = db[NODE_GROUPS]
    node_groups = node_group_col.find({}, {'_id' : False})
    if not node_groups:
        return []
    return web.json_response(list(node_groups))

async def api_add_node_group(request):
    try:
        r_text = await request.text()
        r_json = json.loads(r_text)

        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]
        node_group_col = db[NODE_GROUPS]
        node_group_col.insert_one(r_json) 
        return web.json_response({'status' : 0})
    except:
        return web.json_response({'status' : -1, 'message': 'tbd'})

async def api_get_profiles(request):
    mongoClient = MongoClient(DB_CSTRING)
    db = mongoClient[DB_NAME]
    profile_col = db[PROFILE_LISTS]
    profiles = profile_col.find({}, {'_id' : False})
    if not profiles:
        return []
    return web.json_response(list(profiles))

async def api_add_profile(request):
    try:
        r_text = await request.text()
        r_json = json.loads(r_text)

        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]
        profile_col = db[PROFILE_LISTS]
        profile_col.insert_one(r_json) 
        return web.json_response({'status' : 0})
    except:
        return web.json_response({'status' : -1, 'message': 'tbd'})

async def api_get_profile_groups(request):
    mongoClient = MongoClient(DB_CSTRING)
    db = mongoClient[DB_NAME]
    profile_group_col = db[PROFILE_GROUPS]
    profile_groups = profile_group_col.find({}, {'_id' : False})
    if not profile_groups:
        return []
    return web.json_response(list(profile_groups))

async def api_add_profile_group(request):
    try:
        r_text = await request.text()
        r_json = json.loads(r_text)

        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]
        profile_group_col = db[PROFILE_GROUPS]
        profile_group_col.insert_one(r_json) 
        return web.json_response({'status' : 0})
    except:
        return web.json_response({'status' : -1, 'message': 'tbd'})

async def api_start_run(request):
    try:
        r_text = await request.text()
        r_json = json.loads(r_text)
        profileGroup = r_json['ProfileGroup']
        name = r_json['Name']

        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]
        profile_col = db[PROFILE_LISTS]
        profile = profile_col.find_one({'ProfileGroup': profileGroup,
                                    'Name': name}, {'_id' : False})
        if profile:
            pass #v1Api.
        else:
            return web.json_response({'status' : -1, 'message': 'tbd'})
        return web.json_response({'status' : 0})
    except:
        return web.json_response({'status' : -1, 'message': 'tbd'})

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

app.add_routes([web.route('post'
                            , '/api/nodes'
                            , api_add_node)])

app.add_routes([web.route('get'
                            , '/api/node_groups'
                            , api_get_node_groups)])

app.add_routes([web.route('post'
                            , '/api/node_groups'
                            , api_add_node_group)])

app.add_routes([web.route('get'
                            , '/api/profiles'
                            , api_get_profiles)])

app.add_routes([web.route('post'
                            , '/api/profiles'
                            , api_add_profile)])

app.add_routes([web.route('get'
                            , '/api/profile_groups'
                            , api_get_profile_groups)])

app.add_routes([web.route('post'
                            , '/api/profile_groups'
                            , api_add_profile_group)])

app.add_routes([web.route('post'
                            , '/api/start_run'
                            , api_start_run)])

# app.add_routes([web.route('post'
#                             , '/api/stop_run'
#                             , stop_run)])

# app.add_routes([web.route('get'
#                             , '/api/run'
#                             , get_run)])

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

