<script>
    let isActive=false;

	import { nodeTreeRoot } from '$lib/store';
	import { profileTreeRoot } from '$lib/store';

    import TrafficProfiles from "$lib/TrafficProfiles.svelte";
    import TrafficNodes from "$lib/TrafficNodes.svelte";

	let NodeGroupRootMenuItems = [{'Name': 'Add Folder ...', 'Event': 'addNodeGroup', 'EventCtx': {}}];

	let NodeGroupMenuItems = [{'Name': 'Add Node ...', 'Event': 'addNode', 'EventCtx': {}}, 
                                {'Name': 'Remove Folder ...', 'Event': 'removeNodeGroup', 'EventCtx': {}} ];

	let ProfileGroupRootMenuItems = [{'Name': 'Add Folder ...', 'Event': 'addProfileGroup', 'EventCtx': {}}];

	let ProfileGroupMenuItems = [{'Name': 'Add Profile ...', 'Event': 'addProfile', 'EventCtx': {}}, 
                                    {'Name': 'Remove Folder ...', 'Event': 'removeProfileGroup', 'EventCtx': {}}];

    let nodeMenuItems = [{'Name': 'Remove Node ...', 'Event': 'removeNode', 'EventCtx': {}}];

    let profileMenuItems = [{'Name': 'Remove Profile ...', 'Event': 'removeProfile', 'EventCtx': {}}];

	async function getStorePopulated() {
		const nodeGroups = await fetch ('/api/node_groups.json');
		const nodes = await fetch ('/api/nodes.json');

		const profileGroups = await fetch ('/api/profile_groups.json');
		const profiles = await fetch ('/api/profiles.json');

		if (nodeGroups.ok && nodes.ok) {
			const nodeGroupList = await nodeGroups.json();
			const nodeList = await nodes.json();

			$nodeTreeRoot.MenuItems = NodeGroupRootMenuItems;
			
			for (const nodeGroup of nodeGroupList) {
				const nodeGroupNodeList = nodeList.filter(n => n.Group==nodeGroup.Name);
          		const nodeGroupNodeList2 = nodeGroupNodeList.map (n => ({...n, MenuItems: nodeMenuItems, UrlPath: '/node/'+nodeGroup.Name+'/' + n.Name, UrlPathView: '/node/'+nodeGroup.Name+'/' + n.Name}))

				nodeGroup.expanded = false;
				nodeGroup.children = nodeGroupNodeList2;
				nodeGroup.MenuItems = NodeGroupMenuItems;

				$nodeTreeRoot.children.push(nodeGroup);
			}
		}

		if (profileGroups.ok && profiles.ok) {
			const profileGroupList = await profileGroups.json();
			const profileList = await profiles.json();

			$profileTreeRoot.MenuItems = ProfileGroupRootMenuItems;
			
			for (const profileGroup of profileGroupList) {
				const profileGroupProfileList = profileList.filter(n => n.Group==profileGroup.Name);
          		const profileGroupProfileList2 = profileGroupProfileList.map (n => ({...n, MenuItems: profileMenuItems, UrlPath: '/profile/'+profileGroup.Name+'/' + n.Name, UrlPathView: '/profile/'+profileGroup.Name+'/' + n.Name}))

				profileGroup.expanded = false;
				profileGroup.children = profileGroupProfileList2;
				profileGroup.MenuItems = ProfileGroupMenuItems;

				$profileTreeRoot.children.push(profileGroup);
			}
		}


		return 0;
	}

	let nodeGroupsPromise = getStorePopulated();

</script>

<svelte:window on:resize="{() => isActive=false}"/>

{#await nodeGroupsPromise}
	<p>Loading ...</p>
{:then}
    <!-- svelte-ignore a11y-no-redundant-roles -->
    <nav class="navbar topbar is-dark has-shadow" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="/">
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
                <!-- <div class="navbar-item">
                    <div class="buttons">
                        <button class="button is-info is-small">Sign in</button>
                        <button class="button is-info is-small is-outlined">Sign up</button>
                    </div>
                </div>

                <a class="navbar-item" href="/about">
                    <button class="button is-info is-small is-outlined">About</button>
                </a> -->
            </div>
        </div>
    </nav>

    <div class="columns is-gapless">
        <div class="column is-one-fifth">
            <div class="leftbar">
                <TrafficProfiles />
                <!-- <TrafficNodes /> -->
            </div>
        </div>

        <div class="column">
            <div class="container rightbar">

                <slot />

            </div>
        </div>
    </div>
{/await}

<style>
    .topbar {
        position:sticky;
        border-bottom: 1px solid lightgray;
    }

    .leftbar {
        height: calc(100vh - 3.25rem);
        border-right: 1px solid lightgrey;
        overflow: scroll;
    }

    .rightbar {
        height: calc(100vh - 3.25rem);
        overflow: scroll;
    }

</style>



