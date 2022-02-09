import os
import sys

net_iface_template = '''
apiVersion: "k8s.cni.cncf.io/v1"
kind: NetworkAttachmentDefinition
metadata:
  name: {InterfaceName}
spec: 
  config: '{
      "cniVersion": "0.3.1",
      "plugins": [
        {
          "type": "macvlan",
          "capabilities": { "ips": true },
          "master": "{InterfaceName}",
          "mode": "bridge",
          "ipam": {
            "type": "static",
            "routes": [
            ] 
          }
        }
      ]
    }'
'''

def get_yaml (input_map):
  return net_iface_template.format(**input_map)

if __name__ == '__main__':
  pass

