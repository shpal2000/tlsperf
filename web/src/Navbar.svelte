<script>
	import { link } from "svelte-routing";
import { text } from "svelte/internal";
	
	let isActive=false;
</script>

<svelte:window on:resize="{() => isActive=false}"/>


<nav class="navbar mynavbar is-dark has-shadow" role="navigation" aria-label="main navigation">
	<div class="navbar-brand">
		<a class="navbar-item" use:link href="/">
			<p class="is-size-6">&nbsp;&nbsp;&nbsp;TLS Perf&nbsp;</p>
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
</style>