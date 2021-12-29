<script>
	import Navbar from "./Navbar.svelte";
	import Sidebar from "./Sidebar.svelte";

    let NodesMenuItems = ['Add Node ...'];
	let ProfilesMenuItems = ['New Profile ...'];
	let RunsMenuItems = ['New Run ...'];

	let data = {
		Name: 'Resources',
		expanded: true,
		children: [
			{Name: 'Traffic Nodes', MenuItems: NodesMenuItems, expanded: false, children: [{Name: 'Node-1'}, {Name: 'Node-2'}, {Name: 'Node-3'}]},
			{Name: 'Traffic Profiles', MenuItems: ProfilesMenuItems, expanded: false, children: [{Name: 'AES128-SHA1-Client@2000CPS'}, {Name: 'TlsClient2'}, {Name: 'TlsClient3'}]},
			{Name: 'Test Runs', MenuItems: RunsMenuItems, children: [{Name: 'PnS-HCx-CPS', children: [{Name: 'Build - 12386'}, {Name: 'Build - 12387'}]}]}
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