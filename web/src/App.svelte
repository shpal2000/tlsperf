<script>
	import { Router, Route } from "svelte-routing";

	import Home from "./routes/Home.svelte";
	import Node from "./routes/Node.svelte";
	import Profile from "./routes/Profile.svelte";
	
	import Navbar from "./Navbar.svelte";
	import Sidebar from "./Sidebar.svelte";

	export let url = "";

</script>

<Navbar/>

<div class="columns">
	<div class="column is-one-fifth">
		<Sidebar />
	</div>
	<div class="column">
		<div class="container">

			<Router url="{url}">
				<Route path="node/*nodeName" component={Node}/>
				<Route path="profile/*profileName" component={Profile}/>
				<Route path="/"><Home /></Route>
			  </Router>


		</div>
	</div>
</div>



<style>

</style>