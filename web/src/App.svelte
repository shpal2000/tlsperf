<script>
	import Navbar from "./Navbar.svelte";
	import Sidebar from "./Sidebar.svelte";

    let NodesMenuItems = ['New Node ...', 'Add Folder ...'];
	let ProfilesMenuItems = ['New Profile ...', 'Add Folder ...'];

	let data = {
		Name: 'Resources',
		expanded: true,
		children: [
			{Name: 'Traffic Nodes', MenuItems: NodesMenuItems, expanded: false
				, children: [{Name: 'Node-1'}, {Name: 'Node-2'}, {Name: 'Node-3'}]},
			{Name: 'Traffic Profiles', MenuItems: ProfilesMenuItems, expanded: false, children: [{Name: 'AES128-SHA1-Client@2000CPS'}, {Name: 'TlsClient2'}, {Name: 'TlsClient3'}]},
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