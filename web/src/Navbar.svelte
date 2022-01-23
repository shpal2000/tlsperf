<script>
	import { link } from "svelte-spa-router";
	// import { navRoute } from './store.js';
	import {replace} from "svelte-spa-router";
	
	let isActive=false;

	// function onNavRouteViewChange (e) {
	// 	replace('/blank');
	// 	replace($navRoute.Route + '/' + $navRoute.ViewSelect);
	// }

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

			<!-- {#if $navRoute.ViewSelect == ''}
			<p></p>
			{:else}
				<div class="navbar-item breadcrumb-right-padding">
					<nav class="breadcrumb is-medium is-right" aria-label="breadcrumbs">
						<ul>
							{#each $navRoute.Paths as path}
								<li class="is-active has-text-white" ><a class="has-text-white">{path}</a></li>
							{/each}
						</ul>
					</nav>
				</div>
				
				{#if $navRoute.ViewSelect == 'SingleView'}
					<p></p>
				{:else}
					<div class="navbar-item viewmenu-left-padding">
						<div class="select is-small">
							<select bind:value={$navRoute.ViewSelect} on:change={onNavRouteViewChange}>
								{#each  $navRoute.Views as v}
									<option value={v}>{v}</option>	
								{/each}
							</select>
						</div>
					</div>					
				{/if}


				<div class="navbar-item">
					<div class="vl" />
				</div>
			{/if} -->

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