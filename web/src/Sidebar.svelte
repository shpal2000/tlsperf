<script>
    import Treenode from "./Treenode.svelte";

    let NodesMenuItems = ['New Node ...'];
	let ProfilesMenuItems = ['New Profile ...'];
	let ProfileMenuItems = ['Clone Profile ...'];

	async function getNodes() {
		const nodes = await fetch ('/api/nodes');
        const nodesData = {Name: 'Traffic Nodes', expanded: true, MenuItems: ['Error!'], children: []};

        if (nodes.ok) {
            const nodeList = await nodes.json();
            
            nodesData.MenuItems = NodesMenuItems;

            for (const node of nodeList) {
                nodesData.children.push({Name: node.Name, UrlPath: '/node'});
            }
        }
        return nodesData;
	}

	async function getProfiles() {
		const profiles = await fetch ('/api/profiles');
        const profilesData = {Name: 'Traffic Profiles', expanded: true, MenuItems: ['Error!'], children: []};

        if (profiles.ok) {
            const profileList = await profiles.json();
            
            profilesData.MenuItems = ProfilesMenuItems;

            for (const profile of profileList) {
                profilesData.children.push({Name: profile.Name, MenuItems: ProfileMenuItems, UrlPath: '/profile'});
            }
        }
        
        return profilesData;
	}

    let nodesPromise = getNodes();
    let profilesPromise = getProfiles();

</script>

<div class="sidebar">

    {#await nodesPromise}
        <p>Nodes waiting ...</p>
    {:then nodes} 
        <ul>
            <Treenode node={nodes}/>
        </ul>   
    {/await}


    {#await profilesPromise}
        <p>Profiles waiting ...</p>
    {:then profiles}
        <ul>
            <Treenode node={profiles}/>
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