<script>
	import Navbar from "./Navbar.svelte";
	import Deployment from "./Deployment.svelte";
	import Sidebar from "./Sidebar.svelte";

	let data = {
		data: 'Resources',
		expanded: false,
		children: [
			{data: 'Nodes', expanded: false, children: [{data: 'Node-1'}, {data: 'Node-2'}, {data: 'Node-3'},]},
			{data: 'Profile', expanded: false, children: [{data: 'TlsClient1'}, {data: 'TlsClient2'}, {data: 'TlsClient3'}]},
			{data: 'Runs'}
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