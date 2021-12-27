import os
import asyncio
import json
import subprocess
import time


stats_ticks = time.time()
current_tick = 0

def localcmd(cmd_str, check_ouput=False):
    if check_ouput:
        return subprocess.check_output(cmd_str, shell=True, close_fds=True).decode("utf-8").strip()
    else:
        os.system(cmd_str)
        return None

class StatsListener:
    def connection_made(self, transport):
        self.transport = transport

    def datagram_received(self, data, addr):
        global current_tick
        global stats_ticks
        next_tick = int(time.time() - stats_ticks)
        if next_tick > current_tick:
            current_tick = next_tick
            stats_ticks = time.time()

        message = data.decode()
        stats = json.loads(message)
        stats['tick'] = 


def main ():
    localcmd("mongod --noauth --dbpath /rundir/db &")
    time.sleep(5)

    cfg_file = '/configs/config.json'
    with open(cfg_file) as f:
        cfg = json.loads(f.read())

    stats_ticks = cfg['stats_ticks']

    loop = asyncio.get_event_loop()
    listen = loop.create_datagram_endpoint(StatsListener
                    , local_addr=(cfg['webui_ip']
                                    , cfg['stats_port'])
                    , reuse_port=True)

    loop.run_until_complete(listen)

    loop.run_forever()


if __name__ == '__main__':
    main()

