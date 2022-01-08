<script>
    import { sideStore } from "./store";
    import TrafficProfiles from "./TrafficProfiles.svelte";
    import TrafficNodes from "./TrafficNodes.svelte";

    let NodesMenuItems = ['New Node ...'];
	let ProfilesMenuItems = ['New Profile ...'];
	let ProfileMenuItems = ['Clone Profile ...'];

	async function getNodes() {
		const nodes = await fetch ('/api/nodes');

        if (nodes.ok) {
            const nodeList = await nodes.json();
            
            $sideStore.NodeRoot.MenuItems = NodesMenuItems;

            for (const node of nodeList) {
                $sideStore.NodeRoot.children.push({Name: node.Name, UrlPath: '/node'});
            }
        }
        return 0;
	}

	async function getProfiles() {
		const profiles = await fetch ('/api/profiles');

        if (profiles.ok) {
            const profileList = await profiles.json();
            
            $sideStore.ProfileRoot.MenuItems = ProfilesMenuItems;

            for (const profile of profileList) {
                $sideStore.ProfileRoot.children.push({Name: profile.Name, MenuItems: ProfileMenuItems, UrlPath: '/profile'});
            }
        }
        
        return 0;
	}

    let nodesPromise = getNodes();
    let profilesPromise = getProfiles();

</script>

<div class="sidebar">

    {#await nodesPromise}
        <p>Nodes waiting ...</p>
    {:then} 
        <ul>
            <TrafficNodes />
        </ul>   
    {/await}


    {#await profilesPromise}
        <p>Profiles waiting ...</p>
    {:then}
        <ul>
            <TrafficProfiles />
        </ul>   

    {/await}

</div>


<style>

    .sidebar {
        height: 100vh;
        background-color: whitesmoke;
    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

</style>