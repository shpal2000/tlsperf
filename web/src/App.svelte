<script>
	import Navbar from "./Navbar.svelte";
	import Deployment from "./Deployment.svelte";
	import Sidebar from "./Sidebar.svelte";

    let NodesMenuItems = ['Add Node ...'];
	let ProfilesMenuItems = ['New Profile ...'];
	let RunsMenuItems = ['New Run ...'];

	let data = {
		Name: 'Resources',
		expanded: true,
		children: [
			{Name: 'Nodes', MenuItems: NodesMenuItems, expanded: false, children: [{Name: 'Node-1'}, {Name: 'Node-2'}, {Name: 'Node-3'}]},
			{Name: 'Profile', MenuItems: ProfilesMenuItems, expanded: false, children: [{Name: 'TlsClient1'}, {Name: 'TlsClient2'}, {Name: 'TlsClient3'}]},
			{Name: 'Runs', MenuItems: RunsMenuItems, children: [{Name: 'AES128-SHA1 CPS'}]}
		]
	};

</script>

<Navbar/>

<div class="columns">
	<div class="column is-one-fifth">
		<Sidebar {data}/>
	</div>
	<div class="column">
		<div class="container">
		sidebar-contnet
		</div>
	</div>
</div>



<style>

</style>