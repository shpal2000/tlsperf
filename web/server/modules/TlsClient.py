import os
import sys

config_map_template = '''
apiVersion: v1
kind: ConfigMap
metadata:
  name: tlsclient--{ProfileGroup}--{ProfileName}--{ClientServerGroupName}
data:
  config.json: >
    {{
      "app_id" : "tlsclient--{ProfileGroup}--{ProfileName}--{ClientServerGroupName}",
      "app_gid" : "tlsclient--{ProfileGroup}--{ProfileName}",

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

pod_template = '''
apiVersion: v1
kind: Pod
metadata:
  name: tlsclient--{ProfileGroup}--{ProfileName}--{ClientServerGroupName}
  annotations:
    k8s.v1.cni.cncf.io/networks: '[
            {{ "name": "{ClientInterfaceName}",
               "ips": [{ClientIPs}]
            }}]'
spec:
  containers:
  - name: tlsclient--{ProfileGroup}--{ProfileName}--{ClientServerGroupName}
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
      name: tlsclient--{ProfileGroup}--{ProfileName}--{ClientServerGroupName} 

  nodeSelector:
    tgid: {ClientNodeLabel}
'''

def get_config_map_yaml (input_map):
  return config_map_template.format(**input_map)

def get_pod_yaml (input_map):
  return pod_template.format(**input_map)

if __name__ == '__main__':
  pass

