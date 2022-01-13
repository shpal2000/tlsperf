<script>
	import { nodeTreeRoot } from './store.js';
	import { profileTreeRoot } from './store.js';

	import { Router, Route } from "svelte-routing";

	import Home from "./routes/Home.svelte";
	import Node from "./routes/Node.svelte";
	import Profile from "./routes/Profile.svelte";
	
	import Navbar from "./Navbar.svelte";
	import Sidebar from "./Sidebar.svelte";

	export let url = "";

	let NodeGroupRootMenuItems = [{'Name': 'Add Folder ...', 'Event': 'addNodeGroup', 'EventCtx': {}}];
	let NodeGroupMenuItems = [{'Name': 'Add Node ...', 'Event': 'addNode', 'EventCtx': {}}];

	let ProfileGroupRootMenuItems = [{'Name': 'Add Folder ...', 'Event': 'addProfileGroup', 'EventCtx': {}}];
	let ProfileGroupMenuItems = [{'Name': 'Add Profile ...', 'Event': 'addProfile', 'EventCtx': {}}];

	async function getStorePopulated() {
		const nodeGroups = await fetch ('/api/node_groups');
		const nodes = await fetch ('/api/nodes');

		const profileGroups = await fetch ('/api/profile_groups');
		const profiles = await fetch ('/api/profiles');

		if (nodeGroups.ok && nodes.ok) {
			const nodeGroupList = await nodeGroups.json();
			const nodeList = await nodes.json();

			$nodeTreeRoot.MenuItems = NodeGroupRootMenuItems;
			
			for (const nodeGroup of nodeGroupList) {
				const nodeGroupNodeList = nodeList.filter(n => n.NodeGroup==nodeGroup.Name);
          		const nodeGroupNodeList2 = nodeGroupNodeList.map (n => ({...n, UrlPath: '/node/'+nodeGroup.Name+'/' + n.Name}))

				nodeGroup.expanded = false;
				nodeGroup.children = nodeGroupNodeList2;
				nodeGroup.MenuItems = NodeGroupMenuItems;

				$nodeTreeRoot.children.push(nodeGroup);
			}
		}

		if (profileGroups.ok && profiles.ok) {
			const profileGroupList = await profileGroups.json();
			const profileList = await profiles.json();

			$profileTreeRoot.MenuItems = ProfileGroupRootMenuItems;
			
			for (const profileGroup of profileGroupList) {
				const profileGroupNodeList = profileList.filter(n => n.ProfileGroup==profileGroup.Name);
          		const profileGroupNodeList2 = profileGroupNodeList.map (n => ({...n, UrlPath: '/profile/'+profileGroup.Name+'/' + n.Name}))

				profileGroup.expanded = false;
				profileGroup.children = profileGroupNodeList2;
				profileGroup.MenuItems = ProfileGroupMenuItems;

				$profileTreeRoot.children.push(profileGroup);
			}
		}


		return 0;
	}

	let nodeGroupsPromise = getStorePopulated();

</script>

<Navbar/>

{#await nodeGroupsPromise}
	<p>Waiting ...</p>
{:then}
	<div class="columns is-gapless">
		<div class="column is-one-fifth">
			<Sidebar />
		</div>
		<div class="column">
			<div class="container rightbar">

				<Router url="{url}">
					<Route path="node/*nodeUrlPath" component={Node}/>
					<Route path="profile/*profileUrlPath" component={Profile}/>
					<Route path="/"><Home /></Route>
				</Router>

			</div>
		</div>
	</div>
{/await}


<style>
    .rightbar {
        height: calc(100vh - 5.25rem);
        overflow: scroll;
    }
</style>