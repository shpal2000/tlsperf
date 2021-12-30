<script>
	import Navbar from "./Navbar.svelte";
	import Sidebar from "./Sidebar.svelte";

    let NodesMenuItems = ['New Node ...', 'Add Folder ...'];
	let ProfilesMenuItems = ['New Profile ...', 'Add Folder ...'];
	let ProfileMenuItems = ['Clone Profile ...'];

	let data = {
		Name: 'Resources',
		expanded: true,
		children: [
			{Name: 'Traffic Nodes', MenuItems: NodesMenuItems, expanded: false
				, children: [{Name: 'Node-1'}
								, {Name: 'Node-2'}
								, {Name: 'Node-3'}]},
			{Name: 'Traffic Profiles', MenuItems: ProfilesMenuItems, expanded: false
				, children: [{Name: 'AES128-SHA1-Client', MenuItems: ProfileMenuItems}
								, {Name: 'TlsClient2', MenuItems: ProfileMenuItems}
								, {Name: 'TlsClient3', MenuItems: ProfileMenuItems}]},
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