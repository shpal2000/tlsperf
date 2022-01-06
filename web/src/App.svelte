<script>
	import { Router, Route } from "svelte-routing";
	import Home from "./routes/Home.svelte";
	import Node from "./routes/Node.svelte";
	
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
				<div>
				  <Route path="node/:id" component="{Node}" />
				  <Route path="/"><Home /></Route>
				</div>
			  </Router>


		</div>
	</div>
</div>



<style>

</style>