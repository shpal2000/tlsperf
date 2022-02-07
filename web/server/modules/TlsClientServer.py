import os
import sys
import argparse
import time
import yaml

current_dir = os.path.dirname(os.path.realpath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append (parent_dir)
from config import *

import kubernetes.client
from pymongo import MongoClient


default_key = '''
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDxwoQGJdfXDDoH
O3dlU6L8bbtPvKc9axGMThp4v/Z/7s/nOxu/ab3sCm/rDDawGtpccS6S9J+2q5p7
aGWiPrUvoCa/zd+b9PSMkIa6nWOV/9g8HNA1/bexlcGhgwG2SgYFLQIc5qtXtPgM
Spw2o29coa/YHqIS0jBg/ZZE1Pg2ajyB64KsSON194OBNYFhPopkoMcKsEm399pn
LSiSzMS/FU63m2bVDcikLMSLjJ5C68gNGiVqG8VRUF/Ps/XY7Q0mxCeWjoOYsV4M
T5OqDXYbzbMm885cnMevgJKgLGpftixufWMVCfjuRIAlny3eU3Kg6xrJAOG/fbxM
+pBVFfMHAgMBAAECggEBAKo6br/tcZdocouZIa7lP0RC97tjeNbURxzl+dnAQQ8/
1oBYrGcRS7uidb+pb/B8V/jzcPnk6Xi0SChREA833FhWijJQAf1Mc81uDo/kNrTt
2xIor6r0pZ2Tdy4EkvYKFUcbs/spqMgvEuGEv43xcn5lEu44U6KxAYOpy19YHhYh
RXQ2I1WfuOx9PWGUyywo92TAeBw6v3EhsjPpx8sL/3efFYsPNPogTGoMkWRTLw7i
zM/jWsQekitvB0YBG7Ez3ypQ71Womf8L5Lx5ZLoziikFduc4B0cXCWymzm3QEuHT
rScZSy7qxlMj+0cx+oblw144bEpT2pzLBUhvAOiSncECgYEA+gKS52uTkGkm8JwX
BHVHU6Gi445YIWdYTglJb14OMH2C1L1dgalwY7deG+Y2jVvC9Oizabwv73DmQW7a
yHF/uvHhQksw0O6dhLkbfIcso7gPil4kxvo19cdCAfZlJHD2LtgydOq+a/IGnKXv
Xp/y8rApRY+yByaqnyb0D7xLH9cCgYEA941W5nrMCIW1FKB41QjhCXvREfteZ+nU
r9+l8miMl6GWTxf74OFWGr2O8SjEWEczUpElBgrem7zWK8w8ovecoQxVLapMDB2w
ubZzEj7ZB+6aABsE5LSjPd2MHVu1rBvqXm7V6yhA+y76fnWMwuPLQam/uNO4Khzh
ytu677qaIFECgYAHirZVxtf/vjxPe9Xx63vIWRLp3GxqLYzrZbpSYrr42YBt3HyK
ocrjJy/ulYZFw2PhMXfgE646geRgSvDMpSfeQtexwUTquJgF3fOnUQiWs8G8QdTI
L9oa3PTvzDgG3mV+ykTTZBV0eiua5CKRby/MBGZqU8hiENeKz4kDRIHbpwKBgEdI
9BU6lzZ9Cj/+Vc1C2UqZ1QKQmAbkVtKuXGMJqDKh3V65UVbYjKr2mwrm6mNhXW4R
TdAHoULHhgTmsy9ajkfx/TVBLNTwV8uitlAyuNyH4ODW5vnU6o0OFyL9HbuJ7ltz
HzawSMYMKSXxQ697WTR3ZTYcAZRe7MY1sAcIfQmBAoGBAKPivTevLEtgd9F8h+DE
nAPopzo+MFlvLloGqMEANoRZvB+Bdacfzur78SBVjoOia9uF9shcQwoV8rcdaDPF
1xS57X8Qxejbp/pTaQqPQrUWSWuOODJM7WmmrGAEaGNdd+EQKPQOZN2EiYOgZ7e0
/JDiUvNu8lM0sY5fPJ8KPvNt
-----END PRIVATE KEY-----
'''


default_cert = '''
-----BEGIN CERTIFICATE-----
MIIDDzCCAfegAwIBAgIUAI01G3+PLSoFkZAKb5W+xk1GXw8wDQYJKoZIhvcNAQEL
BQAwFjEUMBIGA1UEAwwLc3MtcnNhLTIwNDgwIBcNMjIwMjA2MjE0ODQwWhgPMjEy
MjAxMTMyMTQ4NDBaMBYxFDASBgNVBAMMC3NzLXJzYS0yMDQ4MIIBIjANBgkqhkiG
9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8cKEBiXX1ww6Bzt3ZVOi/G27T7ynPWsRjE4a
eL/2f+7P5zsbv2m97Apv6ww2sBraXHEukvSftquae2hloj61L6Amv83fm/T0jJCG
up1jlf/YPBzQNf23sZXBoYMBtkoGBS0CHOarV7T4DEqcNqNvXKGv2B6iEtIwYP2W
RNT4Nmo8geuCrEjjdfeDgTWBYT6KZKDHCrBJt/faZy0okszEvxVOt5tm1Q3IpCzE
i4yeQuvIDRolahvFUVBfz7P12O0NJsQnlo6DmLFeDE+Tqg12G82zJvPOXJzHr4CS
oCxqX7Ysbn1jFQn47kSAJZ8t3lNyoOsayQDhv328TPqQVRXzBwIDAQABo1MwUTAd
BgNVHQ4EFgQUTUVkhiNahDkpfRwHyFWHe/dv/kAwHwYDVR0jBBgwFoAUTUVkhiNa
hDkpfRwHyFWHe/dv/kAwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOC
AQEAWFH8CdaqJr4FChm2wpKBEjdrPhXHoin152P8MOtTPWRGKPLu7ufZUAXizyEh
sCgToSQUMKm1e/pQ6ZkT3kZOIrII272Toz+FounIaqC3ygHQeUMRJ6yNuTBd+MvL
8lHByrfMzVqpNE7v7jt3298nRW4dN4c5ru3u413HLm9xR1cdWkIG7SyA4ZmRzvMs
fX4+Y6AmLbwi1lYJYIm6PXe/sIDyRXo1pUm87OYA5hMRi8EtsZMKc9kl1fnz+9wx
F1ag/5rLM5XgnLdbJEJKj+K0Am901JL9Q8g2gMJJoMtoH7+GGeucKQ35huuHRnT0
IiTeT4+t5dboeDFh3HNsLqlh9w==
-----END CERTIFICATE-----
'''


# ########################### set profile defaults ######################### #

def set_profile_defaults (prof_j):

    cs_groups = [
        { "client_ips" :  ["12.20.50.1/16", "12.20.50.2/16"], 
            "server_ip": "12.20.100.1/16"
        }
        # ,
        # { "client_ips" :  ["12.20.51.1/16", "12.20.51.2/16"], 
        #     "server_ip": "12.20.101.1/16"
        # },
        # { "client_ips" :  ["12.20.52.1/16", "12.20.52.2/16"], 
        #     "server_ip": "12.20.102.1/16"
        # },
        # { "client_ips" :  ["12.20.53.1/16", "12.20.53.2/16"], 
        #     "server_ip": "12.20.103.1/16"
        # },
        # { "client_ips" :  ["12.20.54.1/16", "12.20.54.2/16"], 
        #     "server_ip": "12.20.104.1/16"
        # },
        # { "client_ips" :  ["12.20.55.1/16", "12.20.55.2/16"], 
        #     "server_ip": "12.20.105.1/16"
        # },
        # { "client_ips" :  ["12.20.56.1/16", "12.20.56.2/16"], 
        #     "server_ip": "12.20.106.1/16"
        # },
        # { "client_ips" :  ["12.20.57.1/16", "12.20.57.2/16"], 
        #     "server_ip": "12.20.107.1/16"
        # },
        # { "client_ips" :  ["12.20.58.1/16", "12.20.58.2/16"], 
        #     "server_ip": "12.20.108.1/16"
        # },
        # { "client_ips" :  ["12.20.59.1/16", "12.20.59.2/16"], 
        #     "server_ip": "12.20.109.1/16"
        # }
    ]    
    
    prof_j["CPS"] = 1
    prof_j["DataLength"] = 1
    prof_j["MaxPipeline"] = 1
    prof_j["Transactions"] = 60000

    prof_j['cs_groups'] = []
    csg_index = 0
    for csg in cs_groups:

        csg_index += 1
        csg["app_id"] = "CSG" + str(csg_index)
        
        csg["app_gid"] = prof_j['Group'] + '--' + prof_j['Name']

        csg["server_port"] = 443
        csg["server_ssl"] = 1
        csg["send_recv_len"] = prof_j["DataLength"]
        csg["cps"] = int (prof_j["CPS"]/len(cs_groups)) 
        csg["max_active_conn_count"] = int (prof_j["MaxPipeline"]/len(cs_groups))
        csg["total_conn_count"] = int (prof_j["Transactions"]/len(cs_groups))
        csg["server_key"] = default_key.strip()
        csg["server_cert"] = default_cert.strip()

        prof_j['cs_groups'].append(csg)


# ###############################yaml templates ########################### #

client_config_map = '''
apiVersion: v1
kind: ConfigMap
metadata:
  name: tlsclient--{AppGid}--{AppId}
data:
  config.json: >
    {{
      "app_id" : "tlsclient--{AppGid}--{AppId}",
      "app_gid" : "tlsclient--{AppGid}",

      "server_ip"   : "{ServerIP}",
      "server_port" : {ServerPort},
      "server_ssl"  : {IsTls},

      "stats_ip"   : "{WebIP}",
      "stats_port" : {WebPortStats},

      "send_recv_len" : {ClientServerDataLen},

      "client_ips"  : [{ClientIPs}]
      "cps": {CPS},
      "total_conn_count" : {Transactions},
      "max_active_conn_count" : {MaxPipeline}
    }}
'''


client_pod = '''
apiVersion: v1
kind: Pod
metadata:
  name: tlsclient--{AppGid}--{AppId}
  annotations:
    k8s.v1.cni.cncf.io/networks: '[
            {{ "name": "{ClientInterfaceName}",
               "ips": [{ClientIPs}]
            }}]'
spec:
  containers:
  - name: tlsclient--{AppGid}--{AppId}
    image: tlspack/tlsperf:latest
    imagePullPolicy: Always
    command: [tlsclient.exe]
    args: []
    env:
    - name: MY_POD_IP
      valueFrom:
        fieldRef:
          fieldPath: status.podIP
    volumeMounts:
    - name: config-volume
      mountPath: /configs/
  volumes:
  - name: config-volume
    configMap:
      name: tlsclient--{AppGid}--{AppId} 

  nodeSelector:
    tgid: {ClientNodeLabel}
'''


server_config_map = '''
apiVersion: v1
kind: ConfigMap
metadata:
  name: TlsServer--{AppGid}--{AppId}
data:
  config.json: >
    {{
      "app_id" : "TlsServer--{AppGid}--{AppId}",
      "app_gid" : "TlsServer--{AppGid}",

      "server_ip"   : "{ServerIP}",
      "server_port" : {ServerPort},
      "server_ssl"  : {IsTls},

      "stats_ip"   : "{WebIP}",
      "stats_port" : {WebPortStats},

      "send_recv_len" : {ClientServerDataLen}
    }}
  
  key.pem: |
    {ServerKey}

  cert.pem: |
    {ServerCert}
'''


server_pod = '''
apiVersion: v1
kind: Pod
metadata:
  name: TlsServer--{AppGid}--{AppId}
  annotations:
    k8s.v1.cni.cncf.io/networks: '[
            { "name": "{ServerInterfaceName}",
              "ips": [{ServerIPs}]
            }]'
spec:
  containers:
  - name: TlsServer--{AppGid}--{AppId}
    image: tlspack/tlsperf:latest
    imagePullPolicy: Always
    command: ["tlsserver.exe"]
    args: []
    env:
    - name: MY_POD_IP
      valueFrom:
        fieldRef:
          fieldPath: status.podIP
    volumeMounts:
    - name: config-volume
      mountPath: /configs/
  volumes:
  - name: config-volume
    configMap:
      name: TlsServer--{AppGid}--{AppId} 
  nodeSelector:
    tgid: {ServerNodeLabel}
'''


def get_v1_api ():
    with open ('/var/run/secrets/kubernetes.io/serviceaccount/token') as f:
        k8s_token = f.read()
    k8s_config = kubernetes.client.Configuration()
    k8s_config.api_key['authorization'] = k8s_token
    k8s_config.api_key_prefix['authorization'] = 'Bearer'
    k8s_config.host='https://kubernetes.default.svc'
    k8s_config.ssl_ca_cert='/var/run/secrets/kubernetes.io/serviceaccount/ca.crt'
    v1_api= kubernetes.client.CoreV1Api(kubernetes.client.ApiClient(k8s_config))
    return v1_api

def start (group, name):

    v1Api= get_v1_api ()

    mongoClient = MongoClient(DB_CSTRING)
    db = mongoClient[DB_NAME]
    task_col = db[TASK_LISTS]


    query = {'Group': group, 'Name': name}
    task = task_col.find_one(query)
    events = list(task['Events'])

    profile_col = db[PROFILE_LISTS]
    profile = profile_col.find_one(query)


    start_jsons = []
    for csg in profile['cs_groups']:
        input_map = {
            'AppGid': csg["app_gid"],
            'AppId': csg["app_id"],
            'ServerKey': csg["server_key"],
            'ServerCert': csg["server_cert"],
            'ServerIP': csg["server_ip"],
            'ServerPort': csg["server_port"],
            'IsTls': csg["server_ssl"],
            'WebIP': "10.32.0.4",
            'WebPortStats': 7000,
            'ClientServerDataLen': csg["send_recv_len"],
            'CPS': csg["cps"],
            'ClientIPs': ','.join(csg["client_ips"]),
            'Transactions': csg["total_conn_count"],
            'MaxPipeline': csg["max_active_conn_count"]
        }

        server_config_map_yaml = server_config_map.format(**input_map)
        server_config_map_json = yaml.safe_load(server_config_map_yaml)

        client_config_map_yaml = client_config_map.format(**input_map)
        client_config_map_json = yaml.safe_load(client_config_map_yaml)

        server_pod_yaml = server_pod.format(**input_map)
        server_pod_json = yaml.safe_load(server_pod_yaml)

        client_pod_yaml = client_pod.format(**input_map)
        client_pod_json = yaml.safe_load(client_pod_yaml)

        start_jsons.append ({
            'server_config_map_json': server_config_map_json,
            'client_config_map_json': client_config_map_json,
            'server_pod_json': server_pod_json,
            'client_pod_json': client_pod_json
        })

    events.append('timestamp: starting server pods')
    update = { '$set': {'Status': 'starting servers', 'Events': events}}
    task_col.update_one(query, update)
    for start_json in start_jsons:
        resp = v1Api.create_namespaced_config_map(namespace='default',
                                    body=start_json['server_config_map_json'])
        resp = v1Api.create_namespaced_pod (namespace='default',
                                    body=start_json['server_pod_json'])

    events.append('timestamp: checking server pods status')
    update = { '$set': {'Status': 'checking servers', 'Events': events}}
    task_col.update_one(query, update)
    all_pod_started = False
    while not all_pod_started:
        all_pod_started = True
        time.sleep(1)
        for start_json in start_jsons:
            resp = v1Api.read_namespaced_pod (namespace='default',
                                    name=start_json['server_pod_json']['metadata']['name'])
            if resp.status.phase == 'Pending':
                all_pod_started = False
                break

    time.sleep(5)

    events.append('timestamp: starting clients pods')
    update = { '$set': {'Status': 'starting clients', 'Events': events}}
    task_col.update_one(query, update)
    for start_json in start_jsons:
        resp = v1Api.create_namespaced_config_map(namespace='default',
                                    body=start_json['client_config_map_json'])
        resp = v1Api.create_namespaced_pod (namespace='default',
                                    body=start_json['client_pod_json'])


    events.append('timestamp: checking clients pods status')
    update = { '$set': {'Status': 'checking clients', 'Events': events}}
    task_col.update_one(query, update)
    all_pod_started = False
    while not all_pod_started:
        all_pod_started = True
        time.sleep(1)
        for start_json in start_jsons:
            resp = v1Api.read_namespaced_pod (namespace='default',
                                    name=start_json['client_pod_json']['metadata']['name'])
            if resp.status.phase == 'Pending':
                all_pod_started = False
                break

    events.append('timestamp: client, server pods running')
    update = { '$set': {'Status': 'running', 'Events': events}}
    task_col.update_one(query, update)


def stop (group, name):

    v1Api= get_v1_api ()
  
    mongoClient = MongoClient(DB_CSTRING)
    db = mongoClient[DB_NAME]
    task_col = db[TASK_LISTS]

    query = {'Group': group, 'Name': name}
    task = task_col.find_one(query)
    events = list(task['Events'])

    events.append('timestamp: stopping clients pods')
    update = { '$set': {'Status': 'stopping clients', 'Events': events}}
    task_col.update_one(query, update)

    events.append('timestamp: checking clients pods status')
    update = { '$set': {'Status': 'checking clients', 'Events': events}}
    task_col.update_one(query, update)

    events.append('timestamp: stopping server pods')
    update = { '$set': {'Status': 'stopping servers', 'Events': events}}
    task_col.update_one(query, update)

    events.append('timestamp: checking server pods status')
    update = { '$set': {'Status': 'checking servers', 'Events': events}}
    task_col.update_one(query, update)

    events.append('timestamp: client, server pods stopped')
    update = { '$set': {'Status': 'stopped', 'Events': events}}
    task_col.update_one(query, update)


if __name__ == '__main__':
    parser = argparse.ArgumentParser (description='TlsClientServer module')
    parser.add_argument ('--ops', action='store', required=True)
    parser.add_argument ('--group', action='store', required=True)    
    parser.add_argument ('--name', action='store', required=True)
    cmdArgs = parser.parse_args()

    if cmdArgs.ops == 'start':
        start (cmdArgs.group, cmdArgs.name)
    
    elif cmdArgs.ops == 'stop':
        stop (cmdArgs.group, cmdArgs.name)
    
    elif cmdArgs.ops == 'teststart':
        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]
        task_col = db[TASK_LISTS]
        profile_col = db[PROFILE_LISTS]

        query = {'Group': cmdArgs.group, 'Name': cmdArgs.name}


        profile_col.delete_many(query)
        task_col.delete_many(query)

        profile = {}
        profile['Group'] = cmdArgs.group
        profile['Name'] = cmdArgs.name        
        profile['Type'] = 'TlsClientServer'        
        set_profile_defaults(profile)
        profile_col.insert_one(profile)       

        task = {}
        task['Group'] = cmdArgs.group
        task['Name'] = cmdArgs.name 
        task['Status'] = 'init' 
        task['Events'] = ['timestamp: init']
        task_col.insert_one(task)

        start (cmdArgs.group, cmdArgs.name)
    
    elif cmdArgs.ops == 'teststop':
        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]
        task_col = db[TASK_LISTS]

        query = {'Group': cmdArgs.group, 'Name': cmdArgs.name}
        update = { '$set': {'Status': 'stopping', 'Events': ['timestamp: stopping']}}
        task = task_col.find_one(query)
        if task and task['Status'] not in ['stopped', 'aborted']:
            task_col.update_one(query, update)
            
        stop (cmdArgs.group, cmdArgs.name)

