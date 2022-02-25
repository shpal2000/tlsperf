import os
import sys
import argparse
import time
from threading import Thread

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

import random

def get_new_csg (csg_index, group, name):

  ipstr = str(random.randint(1,254)) + '.' + str(random.randint(1,254)) + '.' + str(random.randint(1,254))

  csg = {
    "client_ips" : [ipstr + '.1/16'],
    "server_ip": ipstr + '.201/16',
    "index": csg_index,
    "app_id": "CSG" + str(csg_index+1),
    "app_gid": group + '-' + name,
    "server_port": 443,
    "server_ssl": 1,
    "server_key": default_key.strip(),
    "server_cert": default_cert.strip()
  }

  return csg

def set_profile_defaults (prof_j):
    csg_count = 4
    prof_j["Transactions"] = 60000
    prof_j["CPS"] = 100
    prof_j["DataLength"] = 1
    prof_j["MaxPipeline"] = 10
    prof_j["ClientIface"] = ""
    prof_j["ServerIface"] = ""

    prof_j['cs_groups'] = []
    for csg_index in range(0, csg_count):

        csg = get_new_csg (csg_index, prof_j['Group'], prof_j['Name'])

        csg["send_recv_len"] = prof_j["DataLength"]
        csg["cps"] = int (prof_j["CPS"]/csg_count) 
        csg["max_active_conn_count"] = int (prof_j["MaxPipeline"]/csg_count)
        csg["total_conn_count"] = int (prof_j["Transactions"]/csg_count)

        prof_j['cs_groups'].append(csg)

def get_v1_api_instance ():

  with open ('/var/run/secrets/kubernetes.io/serviceaccount/token') as f:
      k8s_token = f.read()
  k8s_config = kubernetes.client.Configuration()
  k8s_config.api_key['authorization'] = k8s_token
  k8s_config.api_key_prefix['authorization'] = 'Bearer'
  k8s_config.host='https://kubernetes.default.svc'
  k8s_config.ssl_ca_cert='/var/run/secrets/kubernetes.io/serviceaccount/ca.crt'

  v1_api= kubernetes.client.CoreV1Api(kubernetes.client.ApiClient(k8s_config))
  return v1_api

def start_pod_th(v1_api, cmap, pod):

    try:
      resp = v1_api.delete_namespaced_config_map(namespace='default',
                      name=cmap.metadata.name)
    except kubernetes.client.rest.ApiException as err:
      pass # stale server config map does not exist
                
    resp = v1_api.create_namespaced_config_map(namespace='default',
                      body=cmap)

    try:
      resp = v1_api.delete_namespaced_pod(namespace='default',
                      name=pod.metadata.name)
    except kubernetes.client.rest.ApiException as err:
      pass # stale server pod does not exist

    resp = v1_api.create_namespaced_pod (namespace='default',
                        body=pod)

    while True:
      time.sleep(1)

      resp = v1_api.read_namespaced_pod (namespace='default',
                        name=pod.metadata.name)

      if resp.status.phase == 'Running':
        break


def start (group, name, stats_addr):

    v1Api= get_v1_api_instance ()

    mongoClient = MongoClient(DB_CSTRING)
    db = mongoClient[DB_NAME]
    task_col = db[TASK_LISTS]


    query = {'Group': group, 'Name': name}
    task = task_col.find_one(query)
    events = list(task['Events'])

    profile_col = db[PROFILE_LISTS]
    profile = profile_col.find_one(query)


    start_pod_info = []
    for csg in profile['cs_groups']:
        cips = ''
        _cips = ''
        for cip in csg["client_ips"]:
          cips = cips + '"' + cip+ '",'
          _cips = _cips + '"' + cip.split('/')[0] + '",'
        cips = cips.rstrip(',')
        _cips = _cips.rstrip(',')
        
        input_map = {
            'AppGid': csg["app_gid"],
            'AppId': csg["app_id"],
            'AppMetaId': csg["app_gid"].lower() + '-' + csg["app_id"].lower(),
            'ServerKey': csg["server_key"],
            'ServerCert': csg["server_cert"],
            'ServerIPAnno': csg["server_ip"],
            'ServerIP': csg["server_ip"].split('/')[0],
            'ServerPort': csg["server_port"],
            'IsTls': csg["server_ssl"],
            'WebIP': stats_addr.split(':')[0],
            'WebPortStats': int(stats_addr.split(':')[1]),
            'ClientServerDataLen': csg["send_recv_len"],
            'CPS': csg["cps"],
            'ClientIPsAnno': cips,
            'ClientIPs': _cips,
            'Transactions': csg["total_conn_count"],
            'MaxPipeline': csg["max_active_conn_count"],

            'ServerNodeLabel': profile["ServerIface"].split(':')[0],
            'ClientNodeLabel': profile["ClientIface"].split(':')[0],
            'ServerInterfaceName': profile["ServerIface"].split(':')[1],
            'ClientInterfaceName': profile["ClientIface"].split(':')[1]
        }

        server_cmap = kubernetes.client.V1ConfigMap()
        server_cmap.metadata = kubernetes.client.V1ObjectMeta(name='tlsserver-{AppMetaId}'.format(**input_map))
        server_cmap.data = {}
        server_cmap.data['config.json'] = '''{{
          "app_id" : "TlsServer-{AppId}",
          "app_gid" : "TlsClientServer-{AppGid}",

          "server_ip"   : "{ServerIP}",
          "server_port" : {ServerPort},
          "server_ssl"  : {IsTls},

          "stats_ip"   : "{WebIP}",
          "stats_port" : {WebPortStats},

          "send_recv_len" : {ClientServerDataLen}
        }}'''.format(**input_map)
        server_cmap.data['key.pem'] = '{ServerKey}'.format(**input_map)
        server_cmap.data['cert.pem'] = '{ServerCert}'.format(**input_map)


        client_cmap = kubernetes.client.V1ConfigMap()
        client_cmap.metadata = kubernetes.client.V1ObjectMeta(name='tlsclient-{AppMetaId}'.format(**input_map))
        client_cmap.data = {}
        client_cmap.data['config.json'] = '''{{
          "app_id" : "TlsClient-{AppId}",
          "app_gid" : "TlsClientServer-{AppGid}",

          "server_ip"   : "{ServerIP}",
          "server_port" : {ServerPort},
          "server_ssl"  : {IsTls},

          "stats_ip"   : "{WebIP}",
          "stats_port" : {WebPortStats},

          "send_recv_len" : {ClientServerDataLen},

          "client_ips"  : [{ClientIPs}],  
          "cps": {CPS},
          "total_conn_count" : {Transactions},
          "max_active_conn_count" : {MaxPipeline}
        }}'''.format(**input_map)

        server_pod = kubernetes.client.V1Pod()

        server_pod.metadata = kubernetes.client.V1ObjectMeta(name='tlsserver-{AppMetaId}'.format(**input_map))
        server_pod.metadata.annotations = {'k8s.v1.cni.cncf.io/networks' : '[{{ "name": "{ServerInterfaceName}", "ips": ["{ServerIPAnno}"]}}]'.format(**input_map)}
        
        container = kubernetes.client.V1Container(name='tlsserver-{AppMetaId}'.format(**input_map))
        container.image = 'tlspack/tlsperf:latest'
        container.command = ["tlsserver.exe"]
        container.args = []
        container.env = [
          kubernetes.client.V1EnvVar(
            name='MY_POD_IP',
            value_from=kubernetes.client.V1EnvVarSource(field_ref=kubernetes.client.V1ObjectFieldSelector(field_path='status.podIP')))
        ]
        container.volume_mounts= [
          kubernetes.client.V1VolumeMount(
            name='config-volume',
            mount_path='/configs/'
          )
        ]
        volume = kubernetes.client.V1Volume(name='config-volume'
                      , config_map=kubernetes.client.V1ConfigMapVolumeSource(name='tlsserver-{AppMetaId}'.format(**input_map)))

        server_pod.spec = kubernetes.client.V1PodSpec(containers=[container], 
                                                      volumes=[volume],
                                                      termination_grace_period_seconds=0)

        client_pod = kubernetes.client.V1Pod()

        client_pod.metadata = kubernetes.client.V1ObjectMeta(name='tlsclient-{AppMetaId}'.format(**input_map))
        client_pod.metadata.annotations = {'k8s.v1.cni.cncf.io/networks' : '[{{ "name": "{ClientInterfaceName}", "ips": [{ClientIPsAnno}]}}]'.format(**input_map)}
        
        container = kubernetes.client.V1Container(name='tlsclient-{AppMetaId}'.format(**input_map))
        container.image = 'tlspack/tlsperf:latest'
        container.command = ["tlsclient.exe"]
        container.args = []
        container.env = [
          kubernetes.client.V1EnvVar(
            name='MY_POD_IP',
            value_from=kubernetes.client.V1EnvVarSource(field_ref=kubernetes.client.V1ObjectFieldSelector(field_path='status.podIP')))
        ]
        container.volume_mounts= [
          kubernetes.client.V1VolumeMount(
            name='config-volume',
            mount_path='/configs/'
          )
        ]
        volume = kubernetes.client.V1Volume(name='config-volume'
                      , config_map=kubernetes.client.V1ConfigMapVolumeSource(name='tlsclient-{AppMetaId}'.format(**input_map)))

        client_pod.spec = kubernetes.client.V1PodSpec(containers=[container], 
                                                      volumes=[volume],
                                                      termination_grace_period_seconds=0)

        start_pod_info.append ({
            'server_cmap': server_cmap,
            'server_pod': server_pod,
            'client_cmap': client_cmap,
            'client_pod': client_pod
        })

    events.append('starting servers')
    update = { '$set': {'Events': events}}
    task_col.update_one(query, update)

    startth_list = []
    for start_json in start_pod_info:
        thd = Thread(target=start_pod_th
                    , args=[v1Api
                            , start_json['server_cmap']
                            , start_json['server_pod'] ])
                    
        thd.daemon = True
        thd.start()
        startth_list.append(thd)
    
    for thd in startth_list:
        thd.join()

    time.sleep(5)

    events.append('starting clients')
    update = { '$set': {'Events': events}}
    task_col.update_one(query, update)

    startth_list = []
    for start_json in start_pod_info:
        thd = Thread(target=start_pod_th
                    , args=[v1Api
                            , start_json['client_cmap']
                            , start_json['client_pod']])
                    
        thd.daemon = True
        thd.start()
        startth_list.append(thd)
    
    for thd in startth_list:
        thd.join()

    events.append('clients, servers running')
    update = { '$set': {'Events': events}}
    task_col.update_one(query, update)



def stop (group, name, stats_addr):

    v1Api= get_v1_api_instance ()
  
    mongoClient = MongoClient(DB_CSTRING)
    db = mongoClient[DB_NAME]
    task_col = db[TASK_LISTS]

    query = {'Group': group, 'Name': name}
    task = task_col.find_one(query)
    events = list(task['Events'])

    profile_col = db[PROFILE_LISTS]
    profile = profile_col.find_one(query)

    events.append('stopping clients pods')
    update = { '$set': {'Events': events}}
    task_col.update_one(query, update)

    start_pod_info = []
    for csg in profile['cs_groups']:
        cips = ''
        _cips = ''
        for cip in csg["client_ips"]:
          cips = cips + '"' + cip+ '",'
          _cips = _cips + '"' + cip.split('/')[0] + '",'
        cips = cips.rstrip(',')
        _cips = _cips.rstrip(',')
          
        input_map = {
            'AppGid': csg["app_gid"],
            'AppId': csg["app_id"],
            'AppMetaId': csg["app_gid"].lower() + '-' + csg["app_id"].lower(),
            'ServerKey': csg["server_key"],
            'ServerCert': csg["server_cert"],
            'ServerIPAnno': csg["server_ip"],
            'ServerIP': csg["server_ip"].split('/')[0],
            'ServerPort': csg["server_port"],
            'IsTls': csg["server_ssl"],
            'WebIP': stats_addr.split(':')[0],
            'WebPortStats': int(stats_addr.split(':')[1]),
            'ClientServerDataLen': csg["send_recv_len"],
            'CPS': csg["cps"],
            'ClientIPsAnno': cips,
            'ClientIPs': _cips,
            'Transactions': csg["total_conn_count"],
            'MaxPipeline': csg["max_active_conn_count"],

            'ServerNodeLabel': profile["ServerIface"].split(':')[0],
            'ClientNodeLabel': profile["ClientIface"].split(':')[0],
            'ServerInterfaceName': profile["ServerIface"].split(':')[1],
            'ClientInterfaceName': profile["ClientIface"].split(':')[1]
        }
        name = 'tlsclient-{AppMetaId}'.format(**input_map)
        try:
          resp = v1Api.delete_namespaced_pod (namespace='default',
                                              name=name)
        except kubernetes.client.rest.ApiException as err:
          events.append('delete client pod failed')

        try:
          resp = v1Api.delete_namespaced_config_map (namespace='default',
                                              name=name)
        except kubernetes.client.rest.ApiException as err:
          events.append('delete client config map failed')

    events.append('stopping server pods')
    update = { '$set': {'Events': events}}
    task_col.update_one(query, update)

    for csg in profile['cs_groups']:
        cips = ''
        _cips = ''
        for cip in csg["client_ips"]:
          cips = cips + '"' + cip+ '",'
          _cips = _cips + '"' + cip.split('/')[0] + '",'
        cips = cips.rstrip(',')
        _cips = _cips.rstrip(',')
          
        input_map = {
            'AppGid': csg["app_gid"],
            'AppId': csg["app_id"],
            'AppMetaId': csg["app_gid"].lower() + '-' + csg["app_id"].lower(),
            'ServerKey': csg["server_key"],
            'ServerCert': csg["server_cert"],
            'ServerIPAnno': csg["server_ip"],
            'ServerIP': csg["server_ip"].split('/')[0],
            'ServerPort': csg["server_port"],
            'IsTls': csg["server_ssl"],
            'WebIP': stats_addr.split(':')[0],
            'WebPortStats': int(stats_addr.split(':')[1]),
            'ClientServerDataLen': csg["send_recv_len"],
            'CPS': csg["cps"],
            'ClientIPsAnno': cips,
            'ClientIPs': _cips,
            'Transactions': csg["total_conn_count"],
            'MaxPipeline': csg["max_active_conn_count"],

            'ServerNodeLabel': profile["ServerIface"].split(':')[0],
            'ClientNodeLabel': profile["ClientIface"].split(':')[0],
            'ServerInterfaceName': profile["ServerIface"].split(':')[1],
            'ClientInterfaceName': profile["ClientIface"].split(':')[1]
        }
        name = 'tlsserver-{AppMetaId}'.format(**input_map)
        try:
          resp = v1Api.delete_namespaced_pod (namespace='default',
                                              name=name)
        except kubernetes.client.rest.ApiException as err:
          events.append('delete server pod failed')

        try:
          resp = v1Api.delete_namespaced_config_map (namespace='default',
                                              name=name)
        except kubernetes.client.rest.ApiException as err:
          events.append('delete server config map failed')

    events.append('client, server pods stopped')
    update = { '$set': {'Events': events}}
    task_col.update_one(query, update)


if __name__ == '__main__':
    parser = argparse.ArgumentParser (description='TlsClientServer module')
    parser.add_argument ('--ops', action='store', required=True)
    parser.add_argument ('--group', action='store', required=True)    
    parser.add_argument ('--name', action='store', required=True)
    parser.add_argument ('--stats_addr', action='store', required=True)

    cmdArgs = parser.parse_args()

    if cmdArgs.ops == 'start':
        start (cmdArgs.group, cmdArgs.name, cmdArgs.stats_addr)
    
    elif cmdArgs.ops == 'stop':
        stop (cmdArgs.group, cmdArgs.name, cmdArgs.stats_addr)


