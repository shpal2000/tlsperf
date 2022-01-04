<script>
    import Treenode from "./Treenode.svelte";

    let NodesMenuItems = ['New Node ...', 'Add Folder ...'];
	let ProfilesMenuItems = ['New Profile ...', 'Add Folder ...'];
	let ProfileMenuItems = ['Clone Profile ...'];

	// let nodes = {
	// 	Name: 'Traffic Nodes',
	// 	expanded: false,
    //     MenuItems: NodesMenuItems,
    //     children: [{Name: 'Node-1'}
    //             , {Name: 'Node-2'}
    //             , {Name: 'Node-3'}]
	// };

	// let profiles = {
    //     Name: 'Traffic Profiles',
    //     expanded: false,
    //     MenuItems: ProfilesMenuItems,
	// 	children: [{Name: 'AES128-SHA1-Client', MenuItems: ProfileMenuItems}
    //             , {Name: 'TlsClient2', MenuItems: ProfileMenuItems}
    //             , {Name: 'TlsClient3', MenuItems: ProfileMenuItems}]

	// };

	async function getNodes() {
		const nodes = await fetch ('/api/nodes');
        const nodesData = {Name: 'Traffic Nodes', expanded: false, MenuItems: ['Error!'], children: []};

        if (nodes.ok) {
            const nodeList = await nodes.json();
            
            nodesData.MenuItems = NodesMenuItems;

            for (const node of nodeList) {
                nodesData.children.push({Name: node.Name, MenuItems: []});
            }
        }
        return nodesData;
	}

	async function getProfiles() {
		const profiles = await fetch ('/api/profiles');
        const profilesData = {Name: 'Traffic Profiles', expanded: false, MenuItems: ['Error!'], children: []};

        if (profiles.ok) {
            const profileList = await profiles.json();
            
            profilesData.MenuItems = ProfilesMenuItems;

            for (const profile of profileList) {
                profilesData.children.push({Name: profile.Name, MenuItems: ProfileMenuItems});
            }
        }
        
        return profilesData;
	}

    let nodesPromise = getNodes();
    let profilesPromise = getProfiles();

</script>

<div class="sidebar">

    <br/>

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