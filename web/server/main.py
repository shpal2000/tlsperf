import os
from pickle import FALSE
import signal
import aiohttp
from aiohttp import web
import asyncio
import json
from pymongo import MongoClient
import yaml
import asyncssh
import time

from config import *

from modules import TlsClientServer

class SshLinux():
    def __init__(self, ip, username, password):
        self.ip = ip
        self.username = username
        self.password = password
        self.log = []
   
    async def read_until(self, reader, msg_list):
        y = ''
        while True:
            y += await reader.read(1)
            if y == '':
                return ''
            for msg in msg_list:
                if y.endswith(msg):
                    self.log.append(y)
                    return msg
 
    def get_log(self):
        return ''.join(self.log)

    async def send_commamnd(self, command):
        async with asyncssh.connect(self.ip
                                    , username=self.username
                                    , password=self.password
                                    , known_hosts=None) as conn:
            _stdin, _stdout, _stderr = await conn.open_session(command)
            read_msg = await _stdout.read(-1)
            read_msg += await _stderr.read(-1)
            self.log.append(read_msg)
            return read_msg

    async def send_commamnd2(self, command):
        async with asyncssh.connect(self.ip
                                    , username=self.username
                                    , password=self.password
                                    , known_hosts=None) as conn:
            await conn.run (command)

    async def start_tcpdump1(self, iface, capfile):
        async with asyncssh.connect(self.ip
                                    , username=self.username
                                    , password=self.password
                                    , known_hosts=None) as conn:
            _stdin, _stdout, _stderr = await conn.open_session('sudo tcpdump -i {} -n -c 1000 -w ~/{}.pcap&'.format(iface, capfile))
           
            capture_msg = 'bytes'
            sudo_pass_msg = 'for {}: '.format(self.username)
 
            print ('here1')
            read_msg = await self.read_until(_stderr, [capture_msg, sudo_pass_msg])
            print ('here2')
            print (read_msg)

            if read_msg.endswith(capture_msg):
                read_msg += await _stdout.read(-1)
                read_msg += await _stderr.read(-1)
                self.log.append(read_msg)
                return read_msg
            elif read_msg == sudo_pass_msg:
                _stdin.write ('{}\n'.format(self.password))
                read_msg += await _stdout.read(-1)
                read_msg += await _stderr.read(-1)
                self.log.append(read_msg)
                return read_msg
 
    async def stop_tcpdump1(self):
        async with asyncssh.connect(self.ip
                                    , username=self.username
                                    , password=self.password
                                    , known_hosts=None) as conn:
            _stdin, _stdout, _stderr = await conn.open_session('sudo killall tcpdump')
           
            not_found_msg = 'no process found'
            kernel_msg = 'kernel'
            sudo_pass_msg = 'for {}: '.format(self.username)
 
            read_msg = await self.read_until(_stderr, [not_found_msg, kernel_msg, sudo_pass_msg])
 
            if read_msg.endswith(not_found_msg) or read_msg.endswith(kernel_msg):
                read_msg += await _stdout.read(-1)
                read_msg += await _stderr.read(-1)
                self.log.append(read_msg)
                return read_msg
            elif read_msg == sudo_pass_msg:
                _stdin.write ('{}\n'.format(self.password))
                read_msg += await _stdout.read(-1)
                read_msg += await _stderr.read(-1)
                self.log.append(read_msg)
                return read_msg

stats_ticks = 60

async def api_get_node(request):
    group = request.query['group']
    name = request.query['name']

    mongoClient = MongoClient(DB_CSTRING)
    db = mongoClient[DB_NAME]
    node_col = db[NODE_LISTS]
    node = node_col.find_one({'Group': group, 'Name': name}, {'_id' : False})
    if not node:
        return web.json_response({'status' : -1, 'message': 'node not found'})
    return web.json_response({'status': 0, 'data': node})

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

        node = node_col.find_one({'Name': r_json['Name']
                                        , 'Group': r_json['Group']}
                                        , {'_id' : False})
        if node:
            return web.json_response({'status' : -1, 'message': 'already exist'})

        # sshLinux = SshLinux(r_json['SshIP']
        #                     , r_json['SshUser']
        #                     , r_json['SshUser'])

        try:
            # allIfaces = await asyncio.wait_for (sshLinux.send_commamnd ('ip a'), timeout=10.0)
            # print (allIfaces)
            node_col.insert_one(r_json)
            return web.json_response({'status' : 0})
        except asyncio.TimeoutError:
            return web.Response(text='ssh connection failed')
    except Exception as e:
        return web.Response(text=str(e))

async def api_delete_node(request):
    try:
        r_text = await request.text()
        r_json = json.loads(r_text)
        group = r_json['Group']
        name = r_json['Name']

        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]
        node_col = db[NODE_LISTS]

        # check if runnig?
        node_col.delete_one({'Group': group, 'Name': name})

        return web.json_response({'status' : 0})
    except Exception as e:
        return web.Response(text=str(e))

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

        node = node_group_col.find_one({'Name': r_json['Name']}
                                        , {'_id' : False})
        if node:
            return web.json_response({'status' : -1, 'message': 'already exist'})
        
        node_group_col.insert_one(r_json) 
        return web.json_response({'status' : 0})
    except Exception as err:
        return web.json_response({'status' : -1, 'message': str(err)})

async def api_delete_node_group(request):
    try:
        r_text = await request.text()
        r_json = json.loads(r_text)
        name = r_json['Name']

        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]
        node_group_col = db[NODE_GROUPS]
        node_col = db[NODE_LISTS]
        nodes = node_col.find({}, {'_id' : False})
        if not nodes:
            nodes = []
        else:
            nodes = list(nodes)
        
        if list(filter(lambda a : a['Group'] == name,  nodes)):
            return web.json_response({'status' : -1, 'message': 'Folder not empty'})

        node_group_col.delete_one({'Name': name})
        return web.json_response({'status' : 0})
    except Exception as e:
        return web.Response(text=str(e))

async def api_get_profiles(request):
    try:
        group = request.query.get('group')
        name = request.query.get('name')
        newcsg = request.query.get('newcsg')

        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]
        profile_col = db[PROFILE_LISTS]

        if (group and name):
            query = {'Group': group, 'Name': name}
            profile = profile_col.find_one(query, {'_id' : False})
            if not profile:
                return web.json_response({'status' : -1, 'message': 'profile not found'})
            
            if newcsg:
                csg_index = int(newcsg)
                new_csg = TlsClientServer.get_new_csg(csg_index, group, name)
                return web.json_response({'status': 0, 'data': new_csg})
            else:
                return web.json_response({'status': 0, 'data': profile})
        else:
            profiles = profile_col.find({}, {'_id' : False})
            if not profiles:
                return web.json_response([])
            return web.json_response(list(profiles))
    except Exception as err:
        return web.json_response({'status' : -1, 'message': str(err)})

async def api_add_profile(request):
    try:
        r_text = await request.text()
        r_json = json.loads(r_text)
        group = r_json['Group']
        name = r_json['Name']

        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]
        profile_col = db[PROFILE_LISTS]
        task_col = db[TASK_LISTS]

        query = {'Group': group, 'Name': name}

        profile = profile_col.find_one(query)
        if profile:
            return web.json_response({'status' : -1, 'message': 'already exist'})

        TlsClientServer.set_profile_defaults(r_json)

        profile_col.insert_one(r_json)

        task_col.insert_one ({'Group': group,
                                'Name': name,
                                'Type': '',    # start_run/stop_run/abort_run/generate_report/abort_report
                                'Status': 'done', #done/progress
                                'State': 'view', #view/run
                                'Events': []})

        return web.json_response({'status' : 0})
    except Exception as err:
        return web.json_response({'status' : -1, 'message': str(err)})

async def api_save_profile(request):
    try:
        r_text = await request.text()
        r_json = json.loads(r_text)
        group = r_json['Group']
        name = r_json['Name']

        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]
        profile_col = db[PROFILE_LISTS]
        task_col = db[TASK_LISTS]

        query = {'Group': group, 'Name': name}

        profile = profile_col.find_one(query)
        if not profile:
            return web.json_response({'status' : -1, 'message': 'does not exist'})

        task = task_col.find_one(query, {'_id' : False})
        if task['State'] != 'view':
            return web.json_response({'status' : -1, 'message': 'is busy'})

        profile_col.delete_one(query)

        profile_col.insert_one(r_json)

        return web.json_response({'status' : 0})
    except Exception as err:
        return web.json_response({'status' : -1, 'message': str(err)})

async def api_delete_profile(request):
    try:
        r_text = await request.text()
        r_json = json.loads(r_text)
        group = r_json['Group']
        name = r_json['Name']

        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]
        profile_col = db[PROFILE_LISTS]
        task_col = db[TASK_LISTS]
        stats_col = db[REALTIME_STATS]
        
        query = {'Group': group, 'Name': name}
        task = task_col.find_one(query, {'_id' : False})

        if task['State'] == 'run':
            return web.json_response({'status' : -1, 'message': 'is running'})

        if task['Status'] == 'progress':
            return web.json_response({'status' : -1, 'message': '{} in porgress'.format(task['Type'])})


        profile_col.delete_one(query)
        task_col.delete_one(query)

        stats = stats_col.find_one(query)
        if stats:
            stats_col.find_one(query)

        return web.json_response({'status' : 0})
    except Exception as err:
        return web.json_response({'status' : -1, 'message': str(err)})

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

        profile = profile_group_col.find_one({'Name': r_json['Name']}
                                        , {'_id' : False})
        if profile:
            return web.json_response({'status' : -1, 'message': 'already exist'})

        profile_group_col.insert_one(r_json) 
        return web.json_response({'status' : 0})
    except Exception as err:
        return web.json_response({'status' : -1, 'message': str(err)})

async def api_delete_profile_group(request):
    try:
        r_text = await request.text()
        r_json = json.loads(r_text)
        name = r_json['Name']

        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]
        profile_group_col = db[PROFILE_GROUPS]
        profile_col = db[PROFILE_LISTS]
        profiles = profile_col.find({}, {'_id' : False})
        if not profiles:
            profiles = []
        else:
            profiles = list(profiles)

        if list(filter(lambda a : a['Group'] == name,  profiles)):
            return web.json_response({'status' : -1, 'message': 'Folder not empty'})

        profile_group_col.delete_one({'Name': name})
        return web.json_response({'status' : 0})
    except Exception as err:
        return web.json_response({'status' : -1, 'message': str(err)})

async def api_get_profile_runs(request):
    try:
        group = request.query['group']
        name = request.query['name']

        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]
        task_col = db[TASK_LISTS]

        if (group and name):
            query = {'Group': group, 'Name': name}
            task = task_col.find_one(query, {'_id' : False})
            if not task:
                return web.json_response({'status' : -1, 'message': 'profile run not found'})
            return web.json_response({'status': 0, 'data': task})
        else:
            tasks = task_col.find({}, {'_id' : False})
            if not tasks:
                return web.json_response([])
            return web.json_response(list(tasks))
    except Exception as err:
        return web.json_response({'status' : -1, 'message': str(err)})

        

        if task:
            return web.json_response({'status' : 0, 'info': task})
        else:
            return web.json_response({'status' : -1, 'message': 'profile not found'})
    except Exception as err:
        return web.json_response({'status' : -1, 'message': str(err)})

async def task_start_profile_run(group, name):

    stats_addr = '{}:{}'.format(os.environ.get('MY_POD_IP')
                                , os.environ.get('SPORT'))

    proc = await asyncio.create_subprocess_exec('python3',
                                                './modules/TlsClientServer.py',
                                                    '--ops', 'start',
                                                    '--group', group,
                                                    '--name', name,
                                                    '--stats_addr', stats_addr)

    mongoClient = MongoClient(DB_CSTRING)
    db = mongoClient[DB_NAME]

    query = {'Group': group, 'Name': name}

    task_col = db[TASK_LISTS]
    update = {'$set': {'Pid': proc.pid}}
    task_col.update_one(query, update)

    await proc.wait()

    task_col = db[TASK_LISTS]
    update = {'$set': {'Status': 'done'}}
    task_col.update_one(query, update)

async def api_start_profile_run(request):
    try:
        r_text = await request.text()
        r_json = json.loads(r_text)
        group = r_json['Group']
        name = r_json['Name']

        query = {'Group': group, 'Name': name}
        
        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]

        profile_col = db[PROFILE_LISTS]
        profile = profile_col.find_one(query)

        task_col = db[TASK_LISTS]
        task = task_col.find_one(query)

        stats_col = db[REALTIME_STATS]
        stats = stats_col.find_one(query)

        node_col = db[NODE_LISTS]
    
        if profile:
            if task['State'] == 'run':
                return web.json_response({'status' : -1, 'message': 'is already running'})

            client_node_label, client_node_iface  = profile["ClientIface"].split(':')
            server_node_label, server_node_iface = profile["ServerIface"].split(':')

            client_node = node_col.find_one ({'Label': client_node_label})
            server_node = node_col.find_one ({'Label': server_node_label})

            if not client_node:
                return web.json_response({'status' : -1, 'message': 'node not found ' + client_node_label})

            if not server_node:
                return web.json_response({'status' : -1, 'message': 'node not found ' + server_node_label})

            client_node_iface_status = client_node.get(client_node_iface, {})
            if not client_node_iface_status:
                return web.json_response({'status' : -1, 'message': 'iface not found {}:{}'.format (client_node_label, client_node_iface)})

            server_node_iface_status = server_node.get(server_node_iface, {})
            if not server_node_iface_status:
                return web.json_response({'status' : -1, 'message': 'iface not found {}:{}'.format (server_node_label, server_node_iface)})

            if client_node_iface_status.get('Usage') == 'inuse':
                return web.json_response({'status' : -1, 'message': 'iface in use {}:{} by {}:{}'.format (client_node_label
                                                                                                        , client_node_iface
                                                                                                        , client_node_iface_status['Group']
                                                                                                        , client_node_iface_status['Name'])})
            if server_node_iface_status.get('Usage') == 'inuse':
                return web.json_response({'status' : -1, 'message': 'iface in use {}:{} by {}:{}'.format (server_node_label
                                                                                                        , server_node_iface
                                                                                                        , server_node_iface_status['Group']
                                                                                                        , server_node_iface_status['Name'])})

            node_col.update_one ({'Label': client_node_label}, {'$set': {client_node_iface: {'Usage' : 'inuse', 'Group': profile['Group'], 'Name': profile['Name']}}} )

            node_col.update_one ({'Label': server_node_label}, {'$set': {server_node_iface: {'Usage' : 'inuse', 'Group': profile['Group'], 'Name': profile['Name']}}} )

            if stats:
                stats_col.delete_one (query)

            update = { '$set': {'Type': 'start_run', 'Status': 'progress', 'State': 'run', 'Events': []}}
            task_col.update_one(query, update)

            asyncio.create_task (task_start_profile_run(group, name))

            return web.json_response({'status' : 0})
        else:
            return web.json_response({'status' : -1, 'message': 'profile not found'})
    except Exception as err:
        return web.json_response({'status' : -1, 'message': str(err)})

async def task_stop_profile_run(group, name):

    stats_addr = '{}:{}'.format(os.environ.get('MY_POD_IP')
                                , os.environ.get('SPORT'))

    proc = await asyncio.create_subprocess_exec('python3',
                                                './modules/TlsClientServer.py',
                                                    '--ops', 'stop',
                                                    '--group', group,
                                                    '--name', name,
                                                    '--stats_addr', stats_addr)
    await proc.wait()

    mongoClient = MongoClient(DB_CSTRING)
    db = mongoClient[DB_NAME]

    query = {'Group': group, 'Name': name}
    task_col = db[TASK_LISTS]
    
    update = {'$set': {'Status': 'done', 'State': 'view'}}
    task_col.update_one(query, update)

async def api_stop_profile_run(request):
    try:
        r_text = await request.text()
        r_json = json.loads(r_text)
        group = r_json['Group']
        name = r_json['Name']

        query = {'Group': group, 'Name': name}
        
        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]

        profile_col = db[PROFILE_LISTS]
        profile = profile_col.find_one(query)

        task_col = db[TASK_LISTS]
        task = task_col.find_one(query)

        if profile:
            if task['State'] == 'view':
                return web.json_response({'status' : -1, 'message': 'not running'})

            if task['Status'] == 'progress':
                if task['Type'] == 'start_run':
                    try:
                        os.kill(task['Pid'], signal.SIGKILL)
                    except:
                        pass
                else:
                    return web.json_response({'status' : -1, 'message': '{} already in porgress'.format(task['Type'])})

            update = { '$set': {'Type': 'stop_run', 'Status': 'progress', 'Events': []}}
            task_col.update_one(query, update)

            asyncio.create_task (task_stop_profile_run(group, name))

            node_col = db[NODE_LISTS]

            client_node_label, client_node_iface  = profile["ClientIface"].split(':')
            server_node_label, server_node_iface = profile["ServerIface"].split(':')

            node_col.update_one ({'Label': client_node_label}, {'$set': {client_node_iface: {'Usage' : 'idle', 'Group': '', 'Name': ''}}} )
            node_col.update_one ({'Label': server_node_label}, {'$set': {server_node_iface: {'Usage' : 'idle', 'Group': '', 'Name': ''}}} )

            return web.json_response({'status' : 0})
        else:
            return web.json_response({'status' : -1, 'message': 'profile not found'})
    except Exception as err:
        return web.json_response({'status' : -1, 'message': str(err)})


async def api_start_profile_tcpdump(request):
    try:
        r_text = await request.text()
        r_json = json.loads(r_text)
        group = r_json['Group']
        name = r_json['Name']

        query = {'Group': group, 'Name': name}
        
        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]

        profile_col = db[PROFILE_LISTS]
        profile = profile_col.find_one(query)

        node_col = db[NODE_LISTS]
    
        if profile:

            client_node_label, client_node_iface  = profile["ClientIface"].split(':')
            server_node_label, server_node_iface = profile["ServerIface"].split(':')

            client_node = node_col.find_one ({'Label': client_node_label})
            server_node = node_col.find_one ({'Label': server_node_label})

            if not client_node:
                return web.json_response({'status' : -1, 'message': 'node not found ' + client_node_label})

            if not server_node:
                return web.json_response({'status' : -1, 'message': 'node not found ' + server_node_label})

            client_node_iface_status = client_node.get(client_node_iface, {})
            if not client_node_iface_status:
                return web.json_response({'status' : -1, 'message': 'iface not found {}:{}'.format (client_node_label, client_node_iface)})

            server_node_iface_status = server_node.get(server_node_iface, {})
            if not server_node_iface_status:
                return web.json_response({'status' : -1, 'message': 'iface not found {}:{}'.format (server_node_label, server_node_iface)})

            if client_node_iface_status.get('PacketCapture') == 'on':
                return web.json_response({'status' : -1, 'message': 'iface capture on {}:{}'.format (client_node_label
                                                                                                    , client_node_iface)})
            if server_node_iface_status.get('PacketCapture') == 'on':
                return web.json_response({'status' : -1, 'message': 'iface capture on {}:{}'.format (server_node_label
                                                                                                    , server_node_iface)})

            node_col.update_one ({'Label': client_node_label}, {'$set': {client_node_iface: {'PacketCapture' : 'on'}}} )

            node_col.update_one ({'Label': server_node_label}, {'$set': {server_node_iface: {'PacketCapture' : 'on'}}} )

            client_node = node_col.find_one ({'Label': client_node_label})

            server_node = node_col.find_one ({'Label': server_node_label})


            sshLinux = SshLinux(client_node['Ssh']['Ip']
                                , client_node['Ssh']['User']
                                , client_node['Ssh']['Pass'])

            tcpdump_command = 'sudo nohup tcpdump -i {} -n -c 1000 -w ~/{}_client.pcap < /dev/null > /dev/null 2>&1 &'.format(client_node_iface, client_node_iface)
            await asyncio.wait_for (sshLinux.send_commamnd2 (tcpdump_command), timeout=10.0)


            tcpdump_command = 'sudo nohup tcpdump -i {} -n -c 1000 -w ~/{}_server.pcap < /dev/null > /dev/null 2>&1 &'.format(server_node_iface, server_node_iface)
            await asyncio.wait_for (sshLinux.send_commamnd2 (tcpdump_command), timeout=10.0)

            return web.json_response({'status' : 0})
        else:
            return web.json_response({'status' : -1, 'message': 'profile not found'})
    except Exception as err:
        return web.json_response({'status' : -1, 'message': str(err)})


async def api_stop_profile_tcpdump(request):
    try:
        r_text = await request.text()
        r_json = json.loads(r_text)
        group = r_json['Group']
        name = r_json['Name']

        query = {'Group': group, 'Name': name}
        
        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]

        profile_col = db[PROFILE_LISTS]
        profile = profile_col.find_one(query)

        node_col = db[NODE_LISTS]
    
        if profile:

            client_node_label, client_node_iface  = profile["ClientIface"].split(':')
            server_node_label, server_node_iface = profile["ServerIface"].split(':')

            client_node = node_col.find_one ({'Label': client_node_label})
            server_node = node_col.find_one ({'Label': server_node_label})

            if not client_node:
                return web.json_response({'status' : -1, 'message': 'node not found ' + client_node_label})

            if not server_node:
                return web.json_response({'status' : -1, 'message': 'node not found ' + server_node_label})

            client_node_iface_status = client_node.get(client_node_iface, {})
            if not client_node_iface_status:
                return web.json_response({'status' : -1, 'message': 'iface not found {}:{}'.format (client_node_label, client_node_iface)})

            server_node_iface_status = server_node.get(server_node_iface, {})
            if not server_node_iface_status:
                return web.json_response({'status' : -1, 'message': 'iface not found {}:{}'.format (server_node_label, server_node_iface)})

            if client_node_iface_status.get('PacketCapture') == 'off':
                return web.json_response({'status' : -1, 'message': 'iface capture off {}:{}'.format (client_node_label
                                                                                                    , client_node_iface)})
            if server_node_iface_status.get('PacketCapture') == 'off':
                return web.json_response({'status' : -1, 'message': 'iface capture off {}:{}'.format (server_node_label
                                                                                                    , server_node_iface)})


            sshLinux = SshLinux(client_node['Ssh']['Ip']
                                , client_node['Ssh']['User']
                                , client_node['Ssh']['Pass'])

            await asyncio.wait_for (sshLinux.send_commamnd2('sudo pkill tcpdump'), timeout=5.0)

            await asyncio.wait_for (sshLinux.send_commamnd2('sudo pkill tcpdump'), timeout=5.0)


            node_col.update_one ({'Label': client_node_label}, {'$set': {client_node_iface: {'PacketCapture' : 'off'}}} )

            node_col.update_one ({'Label': server_node_label}, {'$set': {server_node_iface: {'PacketCapture' : 'off'}}} )

            client_node = node_col.find_one ({'Label': client_node_label})

            server_node = node_col.find_one ({'Label': server_node_label})

            return web.json_response({'status' : 0})
        else:
            return web.json_response({'status' : -1, 'message': 'profile not found'})
    except Exception as err:
        return web.json_response({'status' : -1, 'message': str(err)})



async def api_get_stats(request):
    try:
        group = request.query['group']
        name = request.query['name']

        query = {'Group': group, 'Name': name}

        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]
        stats_col = db[REALTIME_STATS]

        gstats = stats_col.find_one (query, {'_id' : False})

        if not gstats:
            return web.json_response({'status': -1, 'message': 'stats not found'})
        return web.json_response({'status': 0, 'data': gstats})
    except Exception as err:
        return web.json_response({'status' : -1, 'message': str(err)})

async def ws_handler (request):

    ws = web.WebSocketResponse()
    await ws.prepare(request)

    async for msg in ws:
        if msg.type == aiohttp.WSMsgType.TEXT:
            if msg.data == 'close':
                await ws.close()
            else:
                r_json = json.loads(msg.data)
                group = r_json['Group']
                name = r_json['Name']

                query = {'Group': group, 'Name': name}

                await asyncio.sleep(0.75)

                mongoClient = MongoClient(DB_CSTRING)
                db = mongoClient[DB_NAME]
                stats_col = db[REALTIME_STATS]
                task_col = db[TASK_LISTS]

                gstats = stats_col.find_one (query, {'_id' : False})
                task = task_col.find_one(query, {'_id' : False})

                if gstats and task:
                    resp = {'stats': gstats, 'task': task}
                    await ws.send_str(json.dumps(resp))
                else:
                    await ws.send_str(json.dumps({}))
                
        elif msg.type == aiohttp.WSMsgType.ERROR:
                print ('error %s' % ws.exception())

    return ws    

app = web.Application()

app.add_routes([web.route('get'
                            , '/api/node'
                            , api_get_node)])

app.add_routes([web.route('get'
                            , '/api/nodes'
                            , api_get_nodes)])

app.add_routes([web.route('post'
                            , '/api/nodes'
                            , api_add_node)])

app.add_routes([web.route('delete'
                            , '/api/nodes'
                            , api_delete_node)])

app.add_routes([web.route('get'
                            , '/api/node_groups'
                            , api_get_node_groups)])

app.add_routes([web.route('post'
                            , '/api/node_groups'
                            , api_add_node_group)])

app.add_routes([web.route('delete'
                            , '/api/node_groups'
                            , api_delete_node_group)])

app.add_routes([web.route('get'
                            , '/api/profiles'
                            , api_get_profiles)])

app.add_routes([web.route('post'
                            , '/api/profiles'
                            , api_add_profile)])

app.add_routes([web.route('put'
                            , '/api/profiles'
                            , api_save_profile)])

app.add_routes([web.route('delete'
                            , '/api/profiles'
                            , api_delete_profile)])


app.add_routes([web.route('get'
                            , '/api/profile_groups'
                            , api_get_profile_groups)])

app.add_routes([web.route('post'
                            , '/api/profile_groups'
                            , api_add_profile_group)])

app.add_routes([web.route('delete'
                            , '/api/profile_groups'
                            , api_delete_profile_group)])

app.add_routes([web.route('get'
                            , '/api/profile_runs'
                            , api_get_profile_runs)])

app.add_routes([web.route('post'
                            , '/api/profile_runs'
                            , api_start_profile_run)])

app.add_routes([web.route('delete'
                            , '/api/profile_runs'
                            , api_stop_profile_run)])


app.add_routes([web.route('get'
                            , '/api/stats'
                            , api_get_stats)])


# app.add_routes([web.route('get'
#                             , '/api/profile_tcpdump'
#                             , api_get_profile_tcpdump)])

app.add_routes([web.route('post'
                            , '/api/profile_tcpdump'
                            , api_start_profile_tcpdump)])

app.add_routes([web.route('delete'
                            , '/api/profile_tcpdump'
                            , api_stop_profile_tcpdump)])

app.add_routes([web.get('/ws', ws_handler)])


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

        app, group, name = appGId.split('-')

        csg_app, csg_name = appId.split('-')

        query = {'Group': group, 'Name': name}

        mongoClient = MongoClient(DB_CSTRING)
        db = mongoClient[DB_NAME]
        stats_col = db[REALTIME_STATS]

        gstats = stats_col.find_one (query , {'_id' : False})

        profile_col = db[PROFILE_LISTS]
        profile = profile_col.find_one(query, {'_id' : False})
        expected_cfg_detect_count = len(profile['cs_groups'])

        if not gstats:
            tlsClientStats = {'sum' : {}}
            tlsServerStats = {'sum' : {}}

            if csg_app == 'TlsClient':
                tlsClientStats['sum'] = stats
                tlsClientStats[csg_name] = stats

            if csg_app == 'TlsServer':
                tlsServerStats['sum'] = stats
                tlsServerStats[csg_name] = stats
                
            gstats = {'Group': group, 'Name': name,
                        'TlsClient' : tlsClientStats,
                        'TlsServer': tlsServerStats,
                        'tickStats': {'TlsClient' : [tlsClientStats],
                                        'TlsServer': [tlsServerStats]},
                        'tick': time.time(), 
                        'appDoneTick': 0,
                        'appDone': 0}

            stats_col.insert_one(gstats)
        else:
            gstats[csg_app][csg_name] = stats
            if not gstats[csg_app]['sum']: #empty
                gstats[csg_app]['sum'] = stats

            time_elpse = time.time() - gstats['tick']
            
            tls_client_cfg_detected = len(gstats['TlsClient'].keys()) - 1
            tls_server_cfg_detected = len(gstats['TlsServer'].keys()) - 1

            if time_elpse >= 0.25 and tls_client_cfg_detected == expected_cfg_detect_count and tls_server_cfg_detected == expected_cfg_detect_count:
                gstats['tick'] = time.time()

                for _csg_app in ['TlsClient', 'TlsServer']:
                    del gstats[_csg_app]['sum']
                    _sum_stats = {}
                    for _csg_name, _csg_stats in gstats[_csg_app].items():
                        for _stats_name, _stats_value in _csg_stats.items():
                            if not _sum_stats.get(_stats_name):
                                _sum_stats[_stats_name] = _stats_value
                            elif _stats_name in ['tcal', 'scal', 'adal']:
                                if _stats_value > 0:
                                    _sum_stats[_stats_name] = int ((_sum_stats[_stats_name] + _stats_value) / 2)
                                else:
                                    pass
                            else:
                                _sum_stats[_stats_name] = _sum_stats[_stats_name] + _stats_value

                    gstats[_csg_app]['sum'] = _sum_stats

                    if _sum_stats.get('appDone', 0) == expected_cfg_detect_count:
                        gstats['appDone'] = gstats['appDone'] + 1
                        if not gstats['appDoneTick']:
                            gstats['appDoneTick'] = time.time()
                    
                    if int(time.time() - gstats['appDoneTick']) < 5 or  gstats['appDone'] < 5:
                        gstats['tickStats'][_csg_app].append(gstats[_csg_app])
                        if len(gstats['tickStats'][_csg_app]) > stats_ticks:
                            gstats['tickStats'][_csg_app].pop(0)

            stats_col.find_one_and_replace(query, gstats)


def main ():
    global stats_ticks

    stats_ticks = int(os.environ.get('STATS_TICKS', '2'))

    loop = asyncio.get_event_loop()
    runner = aiohttp.web.AppRunner(app)
    loop.run_until_complete(runner.setup())
    site = aiohttp.web.TCPSite(runner
                , host=os.environ.get('HOST', '0.0.0.0')
                , port=int(os.environ.get('BPORT', '8887'))
                , reuse_port=True)
    loop.run_until_complete(site.start())

    listen = loop.create_datagram_endpoint(StatsListener
                    , local_addr=(os.environ.get('HOST', '0.0.0.0')
                                    , int(os.environ.get('SPORT', '7000')))
                    , reuse_port=True)

    loop.run_until_complete(listen)

    loop.run_forever()


if __name__ == '__main__':
    main()

