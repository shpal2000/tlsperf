<script>
	import { nodeTreeRoot } from './store.js';

	import { Router, Route } from "svelte-routing";

	import Home from "./routes/Home.svelte";
	import Node from "./routes/Node.svelte";
	import Profile from "./routes/Profile.svelte";
	
	import Navbar from "./Navbar.svelte";
	import Sidebar from "./Sidebar.svelte";

	export let url = "";

	let TrafficNodeMenuItems = [{'Name': 'Add Group ...', 'Event': 'addNodeGroup', 'EventCtx': {}}];
	let NodegroupMenuItems = [{'Name': 'Add Node ...', 'Event': 'addNode', 'EventCtx': {}}];

	async function getStorePopulated() {
		const nodeGroups = await fetch ('/api/node_groups');
		const nodes = await fetch ('/api/nodes');

		if (nodeGroups.ok && nodes.ok) {
			const nodeGroupList = await nodeGroups.json();
			const nodeList = await nodes.json();

			$nodeTreeRoot.MenuItems = TrafficNodeMenuItems;
			
			for (const nodeGroup of nodeGroupList) {
				const nodeGroupNodeList = nodeList.filter(n => n.NodeGroup==nodeGroup.Name);
          		const nodeGroupNodeList2 = nodeGroupNodeList.map (n => ({...n, UrlPath: '/node/'+nodeGroup.Name+'/' + n.Name}))

				nodeGroup.expanded = false;
				nodeGroup.children = nodeGroupNodeList2;
				nodeGroup.MenuItems = NodegroupMenuItems;

				nodeGroup.children = nodeGroupNodeList2
				$nodeTreeRoot.children.push(nodeGroup);
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
	<div class="columns">
		<div class="column is-one-fifth">
			<Sidebar />
		</div>
		<div class="column">
			<div class="container">

				<Router url="{url}">
					<Route path="node/*nodeInfo" component={Node}/>
					<Route path="profile/*profileName" component={Profile}/>
					<Route path="/"><Home /></Route>
				</Router>


			</div>
		</div>
	</div>
{/await}


<style>

</style>