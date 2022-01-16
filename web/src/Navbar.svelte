<script>
	import { link } from "svelte-spa-router";
import { text } from "svelte/internal";
	
	let isActive=false;
</script>

<svelte:window on:resize="{() => isActive=false}"/>


<nav class="navbar mynavbar is-dark has-shadow" role="navigation" aria-label="main navigation">
	<div class="navbar-brand">
		<a class="navbar-item" use:link href="/">
			<p class="is-size-6">MyTLS</p>
		</a>
		<!-- svelte-ignore a11y-missing-attribute -->
		<a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarTopMenu" on:click="{() => isActive=!isActive}">
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
		</a>
	</div>

	<div id="navbarTopMenu" class="navbar-menu" class:is-active={isActive}>
		<div class="navbar-start">
		</div>

		<div class="navbar-end">

			<div class="navbar-item breadcrumb-right-padding">
				<nav class="breadcrumb is-medium is-right" aria-label="breadcrumbs">
					<ul>
					  <li class="is-active has-text-white" ><a class="has-text-white">Profile</a></li>
					  <li class="is-active has-text-white" ><a class="has-text-white">abc</a></li>
					  <li class="is-active has-text-white" ><a class="has-text-white">def</a></li>
					</ul>
				  </nav>
			</div>
			
			<div class="navbar-item viewmenu-left-padding">
				<div class="select is-small">
					<select class="">
						<option>View: Config</option>
						<option>View: Report</option>
					</select>
				</div>
			</div>

			<div class="navbar-item">
				<div class="vl" />
			</div>



			<div class="navbar-item">
				<div class="buttons">
					<button class="button is-info is-small">Sign in</button>
					<button class="button is-info is-small is-outlined">Sign up</button>
				</div>
			</div>
		</div>
	</div>
</nav>

<style>
	.mynavbar {
		position:sticky;
		border-bottom: 1px solid lightgray;
	}

	.vl {
		border-left: 1px solid whitesmoke;
		height: 1.5rem;
	}

	.breadcrumb-right-padding {
		padding-right: 0px;
	}

	.viewmenu-left-padding {
		padding-left: 0px;
	}
</style>